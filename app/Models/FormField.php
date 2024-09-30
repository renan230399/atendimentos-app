<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FormField extends Model
{
    use HasFactory;

    protected $fillable = ['form_id', 'label', 'type', 'required', 'options', 'class', 'order', 'step'];

    // Casts to ensure 'options' is treated as an array when accessed in PHP
    protected $casts = [
        'options' => 'array',
    ];

    // Relacionamento com o formulário ao qual o campo pertence
    public function form()
    {
        return $this->belongsTo(Form::class);
    }
}
