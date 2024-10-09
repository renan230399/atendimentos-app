<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Consultation extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'consultations';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<string>
     */
    protected $fillable = [
        'company_id',          // Empresa associada à consulta
        'patient_id',          // Paciente associado à consulta
        'date',                // Data da consulta
        'start_time',          // Hora de início da consulta
        'end_time',            // Hora de término da consulta
        'professional',        // Profissional responsável pela consulta
        'notes',               // Notas sobre a consulta
        'status',              // Status da consulta: 'pending', 'completed', ou 'cancelled'
        'price',               // Preço da consulta (em centavos)
    ];

    /**
     * Define a relação com o modelo Company.
     * Uma consulta pertence a uma empresa.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function company()
    {
        return $this->belongsTo(Company::class);
    }

    /**
     * Define a relação com o modelo Patient.
     * Uma consulta pertence a um paciente.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function patient()
    {
        return $this->belongsTo(Patient::class); // Paciente relacionado à consulta
    }

    /**
     * Relacionamento polimórfico inverso com transações.
     * Permite associar várias transações a uma consulta.
     *
     * @return \Illuminate\Database\Eloquent\Relations\MorphMany
     */
    public function transactions()
    {
        return $this->morphMany(Transaction::class, 'related');
    }

    /**
     * Relacionamento: uma consulta pode ter várias respostas de formulário associadas.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function formResponses()
    {
        return $this->hasMany(FormResponse::class);
    }


    
    /**
     * Setter para o campo 'price'.
     * Armazena o preço em centavos no banco de dados.
     *
     * @param float|int $value Valor em reais que será convertido para centavos.
     */
    public function setPriceAttribute($value)
    {
        // Multiplica o valor por 100 para armazenar em centavos
        $this->attributes['price'] = (int) ($value * 100);
    }

    /**
     * Getter para o campo 'price'.
     * Retorna o valor do preço em reais.
     *
     * @param int $value Valor em centavos armazenado no banco de dados.
     * @return float Retorna o valor convertido em reais.
     */
    public function getPriceAttribute($value)
    {
        // Divide o valor por 100 para retornar em reais
        return $value / 100;
    }

    /**
     * Verifica se a consulta está completa.
     *
     * @return bool
     */
    public function isCompleted()
    {
        return $this->status === 'completed';
    }

    /**
     * Define a consulta como concluída.
     *
     * @return void
     */
    public function complete()
    {
        $this->status = 'completed';
        $this->save();
    }

    /**
     * Define a consulta como cancelada.
     *
     * @return void
     */
    public function cancel()
    {
        $this->status = 'cancelled';
        $this->save();
    }
}
