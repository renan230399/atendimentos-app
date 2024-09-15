<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    use HasFactory;

    // Define o nome da tabela explicitamente
    protected $table = 'events';

    // Define os campos que podem ser preenchidos
    protected $fillable = ['categoria_id', 'title', 'descricao', 'status', 'start', 'end', 'user_id'];

    /**
     * Relacionamento com o modelo EventCategory (1 evento pertence a 1 categoria)
     */
    public function category()
    {
        return $this->belongsTo(EventCategory::class, 'categoria_id', 'id');
    }

    /**
     * Relacionamento com o modelo User (1 evento pertence a 1 usuário)
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }
}
