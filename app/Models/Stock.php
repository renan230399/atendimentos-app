<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Stock extends Model
{
    use HasFactory;

    // Define a tabela associada
    protected $table = 'stocks';

    // Indica os campos que podem ser preenchidos
    protected $fillable = [
        'company_id',
        'product_id',
        'quantity',
        'entry_date',
        'expiration_date',
        'location',
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
}
