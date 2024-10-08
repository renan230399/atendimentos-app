<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CashFlow extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<string>
     */
    protected $fillable = [
        'account_id',
        'transaction_id',
        'company_id', // Adiciona company_id como fillable
        'balance_before',
        'balance_after',
    ];

    /**
     * Relacionamento com a conta.
     * O fluxo de caixa está associado a uma conta específica.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function account()
    {
        return $this->belongsTo(Account::class);
    }

    /**
     * Relacionamento com a transação.
     * O fluxo de caixa está relacionado a uma transação específica.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function transaction()
    {
        return $this->belongsTo(Transaction::class);
    }
    
    /**
     * Relacionamento com a tabela Empresa.
     * Cada fluxo de caixa pertence a uma empresa.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function company()
    {
        return $this->belongsTo(Company::class); // Ajustado para Company em vez de Empresa
    }
}
