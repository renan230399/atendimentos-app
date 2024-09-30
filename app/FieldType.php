<?php

namespace App;

enum FieldType: string
{
    case TEXT = 'text';
    case EMAIL = 'email';
    case NUMBER = 'number';
    case DATE = 'date';
    case SELECT = 'select';
    case RADIO = 'radio';
    case CHECKBOX = 'checkbox';
    case IMAGE = 'image'; // Para uploads de imagens
    case FILE = 'file'; // Para uploads de arquivos
    case PASSWORD = 'password'; // Para senhas
    case TEXTAREA = 'textarea'; // Para campos de texto longos
    case MULTI_SELECT = 'multi_select'; // Para seleção múltipla (arrays)
    case PHONE = 'phone'; // Para campos de telefone
    case URL = 'url'; // Para campos de URL
    case TIME = 'time'; // Para campos de hora
    case COLOR = 'color'; // Para seleção de cor
}
