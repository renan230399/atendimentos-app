<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Form extends Model
{
    use HasFactory;

    protected $fillable = ['category','name', 'description', 'active','icon','is_wizard','wizard_structure', 'company_id']; // Incluímos company_id para ser atribuído

    protected $casts = [
        'wizard_structure' => 'array',
    ];
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

    // Relacionamento com a empresa
    public function company()
    {
        return $this->belongsTo(Company::class);
    }
}
