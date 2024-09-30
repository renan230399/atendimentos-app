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
}
