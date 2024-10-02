<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FormResponse extends Model
{
    use HasFactory;

    // Definir os atributos que podem ser preenchidos em massa
    protected $fillable = [
        'form_id',
        'company_id',
        'patient_id',
        'status', // Novo campo para status
        'completed_at', // Novo campo para a data de conclusão
    ];

    // Relacionamento: uma resposta de formulário pertence a um formulário
    public function form()
    {
        return $this->belongsTo(Form::class);
    }

    // Relacionamento: uma resposta de formulário pode ter muitos detalhes de respostas (campos)
    public function formResponseDetails()  // Alterado de 'details' para 'formResponseDetails'
    {
        return $this->hasMany(FormResponseDetail::class);
    }

    // Relacionamento: uma resposta de formulário pertence a uma empresa
    public function company()
    {
        return $this->belongsTo(Company::class);
    }

    // Relacionamento: uma resposta de formulário pertence a um paciente
    public function patient()
    {
        return $this->belongsTo(Patient::class);
    }

    // Função para verificar se a resposta foi concluída
    public function isCompleted()
    {
        return $this->status === 'completed';
    }
    
    // Função para definir a resposta como concluída
    public function complete()
    {
        $this->status = 'completed';
        $this->completed_at = now();
        $this->save();
    }
}
