<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FormField extends Model
{
    use HasFactory;

    protected $fillable = ['form_id', 'label', 'type', 'required', 'options', 'order'];

    // Relacionamento com o formulário ao qual pertence
    public function form()
    {
        return $this->belongsTo(Form::class);
    }
}
