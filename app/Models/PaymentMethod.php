<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PaymentMethod extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'company_id',
        'account_id',
        'name',
        'type',
    ];

    /**
     * Relacionamento com o modelo Company.
     * Cada método de pagamento pertence a uma empresa.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function company()
    {
        return $this->belongsTo(Company::class);
    }

    /**
     * Relacionamento com o modelo Account.
     * Cada método de pagamento está vinculado a uma conta específica.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function account()
    {
        return $this->belongsTo(Account::class);
    }

    /**
     * Relacionamento com o modelo PaymentMethodFee.
     * Um método de pagamento pode ter várias taxas associadas.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function fees()
    {
        return $this->hasMany(PaymentMethodFee::class);
    }
}
