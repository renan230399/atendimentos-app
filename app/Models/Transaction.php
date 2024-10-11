<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<string>
     */
    protected $fillable = [
        'account_id',
        'category_id',
        'company_id',
        'type',
        'amount',
        'description',
        'transaction_date',
        'expected_date',
        'related_id',
        'related_type',
        'status',
    ];

    /**
     * Relacionamento com a tabela Account.
     * Cada transação pertence a uma conta específica.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function account()
    {
        return $this->belongsTo(Account::class);
    }

    /**
     * Relacionamento com a tabela TransactionCategory.
     * Cada transação pertence a uma categoria específica.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function category()
    {
        return $this->belongsTo(TransactionCategory::class, 'category_id');
    }

    /**
     * Relacionamento com a tabela Company.
     * Cada transação pertence a uma empresa.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function company()
    {
        return $this->belongsTo(Company::class);
    }

    /**
     * Relacionamento polimórfico dinâmico.
     * Isso permite que uma transação se relacione com diferentes tipos de entidades.
     *
     * @return \Illuminate\Database\Eloquent\Relations\MorphTo
     */
    public function related()
    {
        return $this->morphTo();
    }
}
