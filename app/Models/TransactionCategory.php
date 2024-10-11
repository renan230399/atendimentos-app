<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TransactionCategory extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<string>
     */
    protected $fillable = [
        'name',
        'type',
        'company_id',
        'parent_id', // Incluímos parent_id para suportar a hierarquia
    ];

    /**
     * Relacionamento com a tabela Empresa.
     * Cada categoria de transação pertence a uma empresa.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function company()
    {
        return $this->belongsTo(Company::class);
    }

    /**
     * Relacionamento com a tabela Transaction.
     * Uma categoria pode ter várias transações associadas.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function transactions()
    {
        return $this->hasMany(Transaction::class, 'category_id');
    }

    /**
     * Relacionamento para a categoria pai (autorreferência).
     * Uma categoria pode ter uma categoria pai.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function parentCategory()
    {
        return $this->belongsTo(TransactionCategory::class, 'parent_id');
    }

    /**
     * Relacionamento para as categorias filhas (autorreferência).
     * Uma categoria pode ter várias subcategorias.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function subcategories()
    {
        return $this->hasMany(TransactionCategory::class, 'parent_id');
    }
}
