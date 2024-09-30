<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FormResponseDetail extends Model
{
    use HasFactory;

    // Definir os atributos que podem ser preenchidos em massa
    protected $fillable = [
        'form_response_id',
        'form_field_id',
        'response',
    ];

    // Relacionamento: um detalhe de resposta pertence a uma resposta de formulário
    public function formResponse()
    {
        return $this->belongsTo(FormResponse::class);
    }

    // Relacionamento: um detalhe de resposta pertence a um campo de formulário
    public function formField()
    {
        return $this->belongsTo(FormField::class);
    }
}
