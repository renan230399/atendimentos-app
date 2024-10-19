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
        'quantities_per_unit',
        'measuring_unit_of_unit',
        'status'
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

    /**
     * Acessor para obter as fotos do produto.
     * Converte a coluna JSON para um array.
     */
    public function getPhotoAttribute($value)
    {
        return json_decode($value, true);
    }

    /**
     * Mutator para definir as fotos do produto.
     * Converte o valor para JSON antes de salvar.
     */
    public function setPhotoAttribute($value)
    {
        $this->attributes['photo'] = json_encode($value);
    }
    public function scopeActive($query)
{
    return $query->where('status', true);
}
}
