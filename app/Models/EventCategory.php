<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EventCategory extends Model
{
    use HasFactory;

    // Define o nome da tabela explicitamente
    protected $table = 'events_categories';

    // Define os campos que podem ser preenchidos
    protected $fillable = ['nome_categoria'];

    /**
     * Relacionamento com o modelo Event (1 categoria pode ter vários eventos)
     */
    public function events()
    {
        return $this->hasMany(Event::class, 'categoria_id', 'id');
    }
}
