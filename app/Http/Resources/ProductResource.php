<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->description, // Incluindo descrição
            'measuring_unit' => $this->measuring_unit, // Unidade de medida
            'quantities_per_unit' => $this->quantities_per_unit, // Quantidade por unidade
            'measuring_unit_of_unit' => $this->measuring_unit_of_unit, // Unidade de medida por unidade
            'status' => $this->status, // Status do produto
            'category' => new CategoryResource($this->whenLoaded('category')), // Inclui categoria, se estiver carregada
            'stocks' => StockResource::collection($this->whenLoaded('stocks')), // Inclui os estoques ativos
            'created_at' => $this->created_at->format('d-m-Y'),
            'updated_at' => $this->updated_at->format('d-m-Y'),
        ];
    }
}
