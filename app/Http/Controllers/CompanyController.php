<?php

namespace App\Http\Controllers;

use App\Models\Company;
use App\Models\User;
use App\Models\PaymentMethod;
use App\Models\PaymentMethodFee;
use App\Models\Account;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class CompanyController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $companies = Company::all();

        return Inertia::render('Companies/Index', [
            'companies' => $companies,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Companies/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // Validate the input data
        $validatedData = $request->validate([
            'company_name' => 'required|string|max:255',
            'company_logo' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048', // Validate the company logo image
        ]);

        // Check if a logo was uploaded
        if ($request->hasFile('company_logo')) {
            // Upload the logo to S3
            $path = $request->file('company_logo')->store('company_logos', 's3');
            
            // Store the full logo URL in the database
            $validatedData['company_logo'] = Storage::disk('s3')->url($path);
        }

        // Create the company with the validated data
        Company::create($validatedData);

        return redirect()->route('companies.index')->with('success', 'Company successfully created!');
    }

    /**
     * Display the specified resource.
     */
    public function show(Company $company)
    {
        return Inertia::render('Companies/Show', [
            'company' => $company,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Company $company)
    {
        return Inertia::render('Companies/Edit', [
            'company' => $company,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Company $company)
    {
        // Validar os dados
        $validatedData = $request->validate([
            'company_name' => 'required|string|max:255',
            'company_logo' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);
    
        // Verificar se um novo logo foi enviado
        if ($request->hasFile('company_logo')) {
            // Apagar o logo antigo se existir
            if ($company->company_logo) {
                // Remover apenas a parte final da URL para obter o caminho no S3
                $oldPath = parse_url($company->company_logo, PHP_URL_PATH);
                $oldPath = ltrim($oldPath, '/'); // Remove a barra inicial do caminho
    
                // Verificar se o caminho não está vazio e se é uma chave válida no S3
                if (!empty($oldPath) && Storage::disk('s3')->exists($oldPath)) {
                    Storage::disk('s3')->delete($oldPath);
                }
            }
    
            // Fazer upload do novo logo
            $path = $request->file('company_logo')->store('logos_empresas', 's3');
            $validatedData['company_logo'] = Storage::disk('s3')->url($path);
        }
    
        // Atualizar a empresa com os novos dados
        $company->update($validatedData);
    
        return redirect()->route('profile.edit')->with('success', 'Company successfully updated!');
    }
    
    
    

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Company $company)
    {
        // Remove the logo from S3 if it exists
        if ($company->company_logo) {
            $path = str_replace(Storage::disk('s3')->url(''), '', $company->company_logo);
            Storage::disk('s3')->delete($path);
        }

        // Delete the company
        $company->delete();

        return redirect()->route('companies.index')->with('success', 'Company successfully deleted!');
    }

    /**
     * Display a list of employees for the authenticated user's company.
     */
    public function employeesIndex(Request $request)
    {
        $company = $request->user()->company;
        $employees = $company ? $company->users : [];


        return Inertia::render('Companies/Employees', [
            'employees' => $employees,
            'auth' => [
                'user' => $request->user(),
            ],
        ]);
    }
    public function companyDashboard(Request $request)
    {
        $company = auth()->user()->company;
        $companyId = auth()->user()->company_id;
    
        // Obtendo os funcionários da empresa
        $employees = $company ? $company->users : [];
    
        // Obtendo os métodos de pagamento da empresa
        $paymentMethods = PaymentMethod::where('company_id', $companyId)->get();
        $accounts = Account::where('company_id', $companyId)->get();

        // Obtendo as taxas dos métodos de pagamento associados à empresa
        $paymentMethodsFees = PaymentMethodFee::whereIn('payment_method_id', $paymentMethods->pluck('id'))->get();
    
        return Inertia::render('Companies/CompanyDashboard', [
            'employees' => $employees,
            'auth' => [
                'user' => $request->user(),
            ],
        ]);
    }
    
    /**
     * Add a new employee to the authenticated user's company.
     */
    public function addEmployee(Request $request)
    {
        // Get the company from the authenticated user
        $company = $request->user()->company;
    
        // Validate the employee data
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8|confirmed',
            'role' => 'required|integer', // Assuming 'role' is an integer field
        ]);
    
        // Create the employee associated with the company
        $company->users()->create([
            'name' => $validatedData['name'],
            'email' => $validatedData['email'],
            'password' => Hash::make($validatedData['password']),
            'role' => $validatedData['role'], // Add the employee's role
        ]);
        \Log::info($request->all()); // Isso vai registrar todos os dados da requisição

        // Redireciona para a rota de listagem de funcionários com uma mensagem de sucesso
        return redirect()->route('employees.index')->with('success', 'Funcionário adicionado com sucesso!');
    }
    

    /**
     * Remove the specified employee from the authenticated user's company.
     */
    public function removeEmployee(User $employee, Request $request)
    {
        // Get the company from the authenticated user
        $company = $request->user()->company;

        // Ensure the employee belongs to the same company
        if ($employee->company_id !== $company->id) {
            return redirect()->route('employees.index')->with('error', 'Employee does not belong to your company.');
        }

        $employee->delete(); // Remove the employee

        return redirect()->route('employees.index')->with('success', 'Employee successfully removed!');
    }
    /**
 * Show the form for editing the specified employee.
 */
public function editEmployee(User $employee, Request $request)
{
    // Verifica se o funcionário pertence à empresa autenticada
    $company = $request->user()->company;
    
    if ($employee->company_id !== $company->id) {
        return redirect()->route('employees.index')->with('error', 'Funcionário não pertence à sua empresa.');
    }

    return Inertia::render('Companies/EditEmployee', [
        'employee' => $employee,
    ]);
}

/**
 * Update the specified employee's information in storage.
 */
public function updateEmployee(Request $request, User $employee)
{
    // Verifica se o funcionário pertence à empresa autenticada
    $company = $request->user()->company;
    
    if ($employee->company_id !== $company->id) {
        return redirect()->route('employees.index')->with('error', 'Funcionário não pertence à sua empresa.');
    }

    // Valida os dados do funcionário
    $validatedData = $request->validate([
        'name' => 'required|string|max:255',
        'email' => 'required|email|unique:users,email,' . $employee->id,
        'password' => 'nullable|string|min:8|confirmed', // A senha é opcional
        'role' => 'required|integer', // Supondo que 'role' seja um campo inteiro
    ]);

    // Atualiza as informações do funcionário
    $employee->update([
        'name' => $validatedData['name'],
        'email' => $validatedData['email'],
        'role' => $validatedData['role'], // Atualiza o cargo
        'password' => $validatedData['password'] ? Hash::make($validatedData['password']) : $employee->password, // Atualiza a senha apenas se fornecida
    ]);

    return redirect()->route('employees.index')->with('success', 'Funcionário atualizado com sucesso!');
}

}
