<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FormResponse extends Model
{
    use HasFactory;

    protected $fillable = ['form_id', 'responses'];

    // Relacionamento com o formulário ao qual pertence
    public function form()
    {
        return $this->belongsTo(Form::class);
    }
}
