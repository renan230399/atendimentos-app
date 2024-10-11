<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StockLocal extends Model
{
    use HasFactory;

    // Definindo os campos que podem ser preenchidos em massa
    protected $fillable = [
        'company_id',
        'parent_id',
        'name',
        'description',
    ];

    /**
     * Relacionamento com a empresa.
     * Um StockLocal pertence a uma empresa.
     */
    public function company()
    {
        return $this->belongsTo(Company::class, 'company_id');
    }

    /**
     * Relacionamento de autorreferência para o local de estoque pai.
     * Um StockLocal pode ter um local pai.
     */
    public function parent()
    {
        return $this->belongsTo(StockLocal::class, 'parent_id');
    }

    /**
     * Relacionamento de autorreferência para os locais de estoque filhos.
     * Um StockLocal pode ter vários locais filhos.
     */
    public function children()
    {
        return $this->hasMany(StockLocal::class, 'parent_id');
    }

    /**
     * Relacionamento com o estoque (Stock).
     * Um StockLocal pode ter vários estoques.
     */
    public function stocks()
    {
        return $this->hasMany(Stock::class, 'local_id');
    }
}
