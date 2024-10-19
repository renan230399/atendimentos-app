<?php
namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class StockResource extends JsonResource
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
            'quantity' => $this->quantity,
            'entry_date' => $this->entry_date->format('d-m-Y'),
            'status' => $this->status,
            'expiration_date' => $this->expiration_date->format('d-m-Y'),
            // Adicione mais campos conforme necessário
        ];
    }
}
