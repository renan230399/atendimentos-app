<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Form extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'description', 'active'];

    // Relacionamento com os campos do formulário
    public function fields()
    {
        return $this->hasMany(FormField::class);
    }

    // Relacionamento com as respostas do formulário
    public function responses()
    {
        return $this->hasMany(FormResponse::class);
    }
}
