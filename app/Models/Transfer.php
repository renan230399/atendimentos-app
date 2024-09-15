<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Transfer extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<string>
     */
    protected $fillable = [
        'from_account_id',
        'to_account_id',
        'empresa_id',
        'amount',
        'description',
        'transfer_date',
    ];

    /**
     * Relacionamento com a conta de origem.
     * A transferência pertence a uma conta de onde o valor foi retirado.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function fromAccount()
    {
        return $this->belongsTo(Account::class, 'from_account_id');
    }

    /**
     * Relacionamento com a conta de destino.
     * A transferência pertence a uma conta para onde o valor foi enviado.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function toAccount()
    {
        return $this->belongsTo(Account::class, 'to_account_id');
    }

    /**
     * Relacionamento com a tabela Empresa.
     * Cada transferência pertence a uma empresa.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function empresa()
    {
        return $this->belongsTo(Empresa::class);
    }
}
