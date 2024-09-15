<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Empresa extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'empresas';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<string>
     */
    protected $fillable = [
        'nome_empresa',
        'logo_empresa',
    ];

    /**
     * Define a relação com o modelo User.
     * Uma empresa pode ter muitos usuários (funcionários).
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function users()
    {
        return $this->hasMany(User::class);
    }

    /**
     * Define uma relação com o modelo Account.
     * Uma empresa pode ter várias contas.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function accounts()
    {
        return $this->hasMany(Account::class);
    }

    /**
     * Define uma relação com o modelo Transaction.
     * Uma empresa pode ter várias transações associadas.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function transactions()
    {
        return $this->hasMany(Transaction::class);
    }

    /**
     * Define uma relação com o modelo Transfer.
     * Uma empresa pode realizar transferências entre contas.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function transfers()
    {
        return $this->hasMany(Transfer::class);
    }

    /**
     * Define uma relação com o modelo CashFlow.
     * Uma empresa pode ter registros de fluxo de caixa.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function cashFlows()
    {
        return $this->hasMany(CashFlow::class);
    }

    /**
     * Define uma relação com o modelo TransactionCategory.
     * Uma empresa pode ter várias categorias de transações.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function categories()
    {
        return $this->hasMany(TransactionCategory::class);
    }
}
