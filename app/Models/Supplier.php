<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Supplier extends Model
{
    use HasFactory;

    /**
     * Atributos que podem ser atribuídos em massa.
     *
     * @var array<string>
     */
    protected $fillable = [
        'company_id',
        'name',
        'category',
        'contacts',
        'address',
        'state',
        'notes',
        'status',
    ];

    /**
     * Os atributos que devem ser convertidos para tipos nativos.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'contacts' => 'array', // Converte automaticamente o campo JSON para array
        'status' => 'boolean', // Converte automaticamente o campo status para booleano
    ];

    /**
     * Definir relacionamento com o modelo `Company`.
     * Um fornecedor pertence a uma empresa.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function company()
    {
        return $this->belongsTo(Company::class);
    }

    /**
     * Definir relacionamento com o modelo `Order`.
     * Um fornecedor pode ter muitos pedidos.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function orders()
    {
        return $this->hasMany(Order::class);
    }
}
