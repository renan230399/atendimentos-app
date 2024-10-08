<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Patient extends Model
{
    use HasFactory;

    /**
     * The name of the table associated with the model.
     *
     * @var string
     */
    protected $table = 'patients';  // Adjusted the table name to 'patients'

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'company_id',    // Renamed to 'company_id'
        'patient_name',  // Renamed to 'patient_name'
        'phone',         // Renamed to 'phone'
        'birth_date',    // Renamed to 'birth_date'
        'gender',    // Renamed to 'birth_date'
        'neighborhood',  // Renamed to 'neighborhood'
        'street',        // Renamed to 'street'
        'house_number',  // Renamed to 'house_number'
        'address_complement',  // Renamed to 'address_complement'
        'city',          // Renamed to 'city'
        'state',         // Renamed to 'state'
        'cpf',
        'contacts',      // Renamed to 'contacts'
        'complaints',    // Renamed to 'complaints'
        'notes',         // Renamed to 'notes'
        'profile_picture',  // Renamed to 'profile_picture'
        'status',        // Status remains unchanged
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'contacts' => 'array',        // JSON to array for contacts
        'complaints' => 'array',      // JSON to array for complaints
        'birth_date' => 'date',       // Cast birth_date to a Carbon date object
        'status' => 'boolean',        // Cast status to boolean
    ];

    /**
     * Relationship with the Company model.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function company()
    {
        return $this->belongsTo(Company::class);
    }

    /**
     * Relationship with the Consultation model.
     * A patient can have many consultations.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function consultations()
    {
        return $this->hasMany(Consultation::class);
    }

    /**
     * Relationship with the FormResponse model.
     * A patient can have many form responses.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function formResponses()
    {
        return $this->hasMany(FormResponse::class);
    }

    /**
     * Accessor to get the full profile picture URL from S3.
     *
     * @return string|null
     */
    public function getProfilePictureUrlAttribute()
    {
        return $this->profile_picture ? Storage::disk('s3')->url($this->profile_picture) : null;
    }

    /**
     * Accessor to calculate the patient's age based on birth_date.
     *
     * @return int|null
     */
    public function getAgeAttribute()
    {
        return $this->birth_date ? $this->birth_date->age : null;
    }
}
