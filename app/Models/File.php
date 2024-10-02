<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class File extends Model
{
    use HasFactory;

    // Definir os atributos que podem ser preenchidos em massa
    protected $fillable = [
        'user_id',
        'form_response_detail_id',
        'filename',
        'path',
        'type',
        'size',
    ];

    // Relacionamento: um arquivo pertence a um detalhe de resposta de formulário
    public function formResponseDetail()
    {
        return $this->belongsTo(FormResponseDetail::class);
    }

    // Relacionamento: um arquivo pertence a um usuário (quem fez o upload)
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
