<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    // Define a tabela associada
    protected $table = 'products';

    // Indica os campos que podem ser preenchidos
    protected $fillable = [
        'company_id',
        'category_id', // Relaciona com a categoria
        'name',
        'description',
        'measuring_unit',
    ];

    /**
     * Relacionamento com a empresa (Company)
     * Um produto pertence a uma empresa.
     */
    public function company()
    {
        return $this->belongsTo(Company::class);
    }

    /**
     * Relacionamento com a categoria
     * Um produto pertence a uma categoria.
     */
    public function category()
    {
        return $this->belongsTo(CategoryProduct::class, 'category_id');
    }

    /**
     * Relacionamento com o estoque (Stock)
     * Um produto pode ter vários registros de estoque.
     */
    public function stocks()
    {
        return $this->hasMany(Stock::class);
    }

}
