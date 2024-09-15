<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Pacient extends Model
{
    use HasFactory;

    /**
     * O nome da tabela associada ao modelo.
     *
     * @var string
     */
    protected $table = 'pacients';  // O nome da tabela

    /**
     * Os atributos que são atribuíveis em massa.
     *
     * @var array
     */
    protected $fillable = [
        'empresa_id',     // ID da empresa
        'nome_paciente',
        'telefone',
        'data_nascimento',
        'bairro',
        'rua',
        'numero',
        'complemento',
        'cidade',
        'estado',
        'cpf',
        'responsaveis',
        'observacoes',
        'foto_perfil',     // Campo para a foto de perfil
        'status',          // Campo para o status do paciente
    ];

    /**
     * Os atributos que devem ser convertidos para tipos nativos.
     *
     * @var array
     */
    protected $casts = [
        'responsaveis' => 'array',        // Converte a coluna JSONB em um array PHP
        'data_nascimento' => 'date',      // Converte a coluna de data de nascimento em um objeto Carbon
        'status' => 'boolean',            // Converte o campo de status em boolean
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
     * Acessor para a URL completa da foto de perfil no S3.
     *
     * @return string|null
     */
    public function getFotoPerfilUrlAttribute()
    {
        // Verifica se o campo foto_perfil está definido e retorna a URL completa
        return $this->foto_perfil ? Storage::disk('s3')->url($this->foto_perfil) : null;
    }

    /**
     * Acessor para calcular a idade do paciente com base na data de nascimento.
     *
     * @return int|null
     */
    public function getIdadeAttribute()
    {
        return $this->data_nascimento ? $this->data_nascimento->age : null;
    }
}
