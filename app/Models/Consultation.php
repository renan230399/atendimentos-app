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
        'company_id',          // Ajustado de 'empresa_id' para 'company_id'
        'patient_id',          // Ajustado de 'pacient_id' para 'patient_id'
        'date',                // Ajustado de 'data' para 'date'
        'start_time',          // Ajustado de 'hora_inicio' para 'start_time'
        'end_time',            // Ajustado de 'hora_fim' para 'end_time'
        'professional',        // Profissional responsável pela consulta
        'notes',               // Ajustado de 'observacoes' para 'notes'
        'status',  
        'price',              // Status da consulta: 'pending', 'completed', ou 'cancelled'
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
        return $this->belongsTo(Patient::class); // Ajustado de 'Pacient' para 'Patient'
    }
}
