<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Patient extends Model
{
    use HasFactory;

    /**
     * The name of the table associated with the model.
     *
     * @var string
     */
    protected $table = 'patients';  // Nome da tabela

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'company_id',           // Referência para a empresa associada
        'patient_name',         // Nome do paciente
        'phone',                // Telefone
        'birth_date',           // Data de nascimento
        'gender',               // Gênero
        'neighborhood',         // Bairro
        'street',               // Rua
        'house_number',         // Número da casa
        'address_complement',   // Complemento do endereço
        'city',                 // Cidade
        'state',                // Estado
        'cpf',                  // CPF
        'contacts',             // Contatos em formato JSON
        'complaints',           // Reclamações ou queixas (opcional)
        'notes',                // Notas adicionais
        'profile_picture',      // Caminho da foto de perfil
        'status',               // Status ativo/inativo
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'contacts' => 'array',         // Converte contatos JSON para array
        'complaints' => 'array',       // Converte reclamações JSON para array
        'birth_date' => 'date',        // Converte data de nascimento para objeto Carbon
        'status' => 'boolean',         // Converte status para booleano
    ];

    /**
     * Relationship with the Company model.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function company()
    {
        return $this->belongsTo(Company::class);  // Paciente pertence a uma empresa
    }

    /**
     * Relationship with the Consultation model.
     * A patient can have many consultations.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function consultations()
    {
        return $this->hasMany(Consultation::class);  // Um paciente pode ter várias consultas
    }

    /**
     * Relationship with the FormResponse model.
     * A patient can have many form responses.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function formResponses()
    {
        return $this->hasMany(FormResponse::class);  // Um paciente pode ter várias respostas de formulários
    }

    /**
     * Accessor to get the full profile picture URL from S3.
     *
     * @return string|null
     */
    public function getProfilePictureUrlAttribute()
    {
        return $this->profile_picture ? Storage::disk('s3')->url($this->profile_picture) : null;  // Retorna a URL completa da foto no S3
    }

    /**
     * Accessor to calculate the patient's age based on birth_date.
     *
     * @return int|null
     */
    public function getAgeAttribute()
    {
        return $this->birth_date ? $this->birth_date->age : null;  // Calcula a idade do paciente com base na data de nascimento
    }
}
