<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StockMovimentation extends Model
{
    use HasFactory;

    // Define a tabela associada
    protected $table = 'stock_movimentations';

    // Indica os campos que podem ser preenchidos em massa
    protected $fillable = [
        'stock_id',
        'company_id',
        'product_id',
        'name',
        'movement_type',
        'quantity',
        'movement_date',
        'notes',
    ];

    /**
     * Relacionamento com o estoque (Stock)
     * Uma movimentação pertence a um estoque específico.
     */
    public function stock()
    {
        return $this->belongsTo(Stock::class);
    }

    /**
     * Relacionamento com a empresa (Company)
     * Uma movimentação de estoque pertence a uma empresa.
     */
    public function company()
    {
        return $this->belongsTo(Company::class);
    }

    /**
     * Relacionamento com o produto (Product)
     * Uma movimentação de estoque está associada a um produto.
     */
    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
