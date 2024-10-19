<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Stock extends Model
{
    use HasFactory;

    // Define a tabela associada
    protected $table = 'stocks';

    // Indica os campos que podem ser preenchidos em massa
    protected $fillable = [
        'company_id',
        'product_id',
        'local_id', // Novo campo para a referência ao local de estoque
        'quantity',
        'entry_date',
        'expiration_date',
        'cost_price',
    ];

    /**
     * Relacionamento com a empresa (Company)
     * O estoque pertence a uma empresa.
     */
    public function company()
    {
        return $this->belongsTo(Company::class);
    }

    /**
     * Relacionamento com o produto (Product)
     * O estoque pertence a um produto.
     */
    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    /**
     * Relacionamento com o local de estoque (StockLocal)
     * O estoque pertence a um local específico.
     */
    public function stockLocal()
    {
        return $this->belongsTo(StockLocal::class, 'local_id');
    }

    
    public function scopeActive($query)
    {
        return $query->where('status', true);
    }
}
