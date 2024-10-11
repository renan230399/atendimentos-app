<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CategoryProduct extends Model
{
    use HasFactory;

    // Define a tabela associada
    protected $table = 'category_products';

    // Indica os campos que podem ser preenchidos
    protected $fillable = [
        'company_id',
        'parent_id',
        'name',
    ];

    /**
     * Relacionamento com a empresa (Company)
     * Uma categoria pertence a uma empresa.
     */
    public function company()
    {
        return $this->belongsTo(Company::class);
    }

    /**
     * Relacionamento com os produtos
     * Uma categoria pode ter muitos produtos.
     */
    public function products()
    {
        return $this->hasMany(Product::class, 'category_id');
    }

    /**
     * Relacionamento com a categoria pai
     * Uma categoria pode ter uma categoria pai.
     */
    public function parentCategory()
    {
        return $this->belongsTo(CategoryProduct::class, 'parent_id');
    }

    /**
     * Relacionamento com as subcategorias (filhas)
     * Uma categoria pode ter muitas subcategorias.
     */
    public function subcategories()
    {
        return $this->hasMany(CategoryProduct::class, 'parent_id');
    }
}
