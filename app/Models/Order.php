<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    /**
     * Atributos que podem ser atribuídos em massa.
     *
     * @var array<string>
     */
    protected $fillable = [
        'company_id',
        'order_number',
        'order_date',
        'supplier',
        'total_amount',
        'notes',
        'delivery_date',
    ];

    /**
     * Definir relacionamento com o modelo `Company`.
     * Um pedido pertence a uma empresa.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function company()
    {
        return $this->belongsTo(Company::class);
    }

    /**
     * Definir relacionamento com o modelo `OrderItem`.
     * Um pedido pode ter muitos itens.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }
}
