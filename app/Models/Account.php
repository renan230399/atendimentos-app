<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Account extends Model
{
    use HasFactory;

    /**
     * O nome da tabela associada ao modelo.
     *
     * @var string
     */
    protected $table = 'accounts';

    /**
     * Os atributos que são atribuíveis em massa.
     *
     * @var array
     */
    protected $fillable = [
        'empresa_id',
        'name',
        'type',
        'balance',
    ];

    /**
     * Os atributos que devem ser convertidos para tipos nativos.
     *
     * @var array
     */
    protected $casts = [
        'balance' => 'decimal:2', // Converte o campo de saldo em decimal com 2 casas decimais
    ];

    /**
     * Define a relação com o modelo Empresa.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function empresa()
    {
        return $this->belongsTo(Empresa::class);
    }

    /**
     * Verifica se a conta é do tipo banco.
     *
     * @return bool
     */
    public function isBankAccount()
    {
        return $this->type === 'bank';
    }

    /**
     * Verifica se a conta é do tipo caixa.
     *
     * @return bool
     */
    public function isCashAccount()
    {
        return $this->type === 'cash';
    }
}
