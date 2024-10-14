<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
class OrderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    // Relacionamento com os itens do pedido
    public function index(Request $request)
    {
        $companyId = auth()->user()->company_id;
    
        // Verifica se o parâmetro 'sort' foi passado na requisição, define a ordenação como 'desc' por padrão
        $sortOrder = $request->input('sort', 'desc');
        
        // Recupera todos os pedidos da empresa do usuário autenticado, com os itens relacionados, faz paginação (10 pedidos por página)
        $orders = Order::with('orderItems')
            ->where('company_id', $companyId) // Filtra pelo company_id
            ->orderBy('order_date', $sortOrder) // Ordena pela coluna 'order_date'
            ->paginate(10);
        
        return response()->json($orders);
    }
    

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // Validação dos dados recebidos
        $validatedData = $request->validate([
            'order_date' => 'required|date',
            'supplier_id' => 'required|integer|exists:suppliers,id',
            'total_amount' => 'required|numeric|min:0',
            'delivery_date' => 'nullable|date',
            'notes' => 'nullable|string',
            'delivery_status' => 'required|boolean',
            'file' => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:2048',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|integer|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.unit_price' => 'required|numeric|min:0',
            'items.*.total_price' => 'required|numeric|min:0',
        ]);
    
        // Transação para garantir que ambas as operações (ordem e itens) sejam salvas corretamente
        DB::transaction(function () use ($request, $validatedData) {
            $companyId = auth()->user()->company_id;
    
            // Verifica se o arquivo foi enviado e faz o upload para o S3
            if ($request->hasFile('file')) {
                $path = $request->file('file')->store('order_files-' . $companyId, 's3');
                $validatedData['file'] = Storage::disk('s3')->url($path); // Salva a URL pública do arquivo
            }
    
            // Criação do pedido (Order)
            $order = Order::create([
                'company_id' => $companyId,
                'order_date' => $validatedData['order_date'],
                'supplier_id' => $validatedData['supplier_id'],
                'total_amount' => $validatedData['total_amount'],
                'delivery_date' => $validatedData['delivery_date'],
                'notes' => $validatedData['notes'],
                'delivery_status' => $validatedData['delivery_status'],
                'file' => $validatedData['file'] ?? null, // Salva a URL do arquivo ou null se não houver arquivo
            ]);
    
            // Inserir itens do pedido (OrderItem)
            foreach ($validatedData['items'] as $item) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $item['product_id'],
                    'quantity' => $item['quantity'],
                    'unit_price' => $item['unit_price'],
                    'total_price' => $item['total_price'],
                ]);
            }
        });
    
        // Redirecionar com sucesso
        return redirect()->route('inventory.dashboard')->with('success', 'Pedido criado com sucesso!');
    }
    

    /**
     * Display the specified resource.
     */
    public function show(Order $order)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Order $order)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Order $order)
    {
        // Validação dos dados recebidos
        $validatedData = $request->validate([
            'order_date' => 'required|date',
            'supplier_id' => 'required|integer|exists:suppliers,id',
            'total_amount' => 'required|numeric|min:0',
            'delivery_date' => 'nullable|date',
            'notes' => 'nullable|string',
            'delivery_status' => 'required|boolean',
            'file' => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:2048',
            'items' => 'required|array|min:1',
            'items.*.id' => 'nullable|integer|exists:order_items,id', // Verifica se o item já existe
            'items.*.product_id' => 'required|integer|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.unit_price' => 'required|numeric|min:0',
            'items.*.total_price' => 'required|numeric|min:0',
        ]);
    
        DB::transaction(function () use ($request, $order, $validatedData) {
            // Atualizar o pedido (Order)
            $order->update([
                'order_date' => $validatedData['order_date'],
                'supplier_id' => $validatedData['supplier_id'],
                'total_amount' => $validatedData['total_amount'],
                'delivery_date' => $validatedData['delivery_date'],
                'notes' => $validatedData['notes'],
                'delivery_status' => $validatedData['delivery_status'],
                'file' => $request->file('file') 
                    ? $request->file('file')->store('orders', 'public') 
                    : $order->file, // Mantém o arquivo existente se não for atualizado
            ]);
    
            // Manter o controle dos itens que devem ser mantidos
            $existingItemIds = [];
            
            foreach ($validatedData['items'] as $itemData) {
                if (isset($itemData['id'])) {
                    // Se o item já existe, atualizá-lo
                    $orderItem = OrderItem::find($itemData['id']);
                    if ($orderItem) {
                        $orderItem->update([
                            'product_id' => $itemData['product_id'],
                            'quantity' => $itemData['quantity'],
                            'unit_price' => $itemData['unit_price'],
                            'total_price' => $itemData['total_price'],
                        ]);
                        $existingItemIds[] = $orderItem->id;
                    }
                } else {
                    // Se o item é novo, adicioná-lo
                    $newItem = OrderItem::create([
                        'order_id' => $order->id,
                        'product_id' => $itemData['product_id'],
                        'quantity' => $itemData['quantity'],
                        'unit_price' => $itemData['unit_price'],
                        'total_price' => $itemData['total_price'],
                    ]);
                    $existingItemIds[] = $newItem->id;
                }
            }
    
            // Remover itens que não estão mais presentes na requisição
            OrderItem::where('order_id', $order->id)
                ->whereNotIn('id', $existingItemIds)
                ->delete();
        });
    
        return redirect()->route('inventory.dashboard')->with('success', 'Pedido atualizado com sucesso!');
    }
    

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Order $order)
    {
        //
    }
}
