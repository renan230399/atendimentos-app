<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Company extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'companies';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<string>
     */
    protected $fillable = [
        'company_name',  // Renamed to company_name
        'company_logo',  // Renamed to company_logo
    ];

    /**
     * Define a relationship with the User model.
     * A company can have many users (employees).
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function users()
    {
        return $this->hasMany(User::class);
    }

    /**
     * Define a relationship with the Account model.
     * A company can have many accounts.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function accounts()
    {
        return $this->hasMany(Account::class);
    }

    /**
     * Define a relationship with the Consultation model.
     * A company can have many consultations.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function consultations()
    {
        return $this->hasMany(Consultation::class);
    }

    /**
     * Define a relationship with the Transaction model.
     * A company can have many transactions.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function transactions()
    {
        return $this->hasMany(Transaction::class);
    }

    /**
     * Define a relationship with the Transfer model.
     * A company can perform transfers between accounts.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function transfers()
    {
        return $this->hasMany(Transfer::class);
    }

    /**
     * Define a relationship with the CashFlow model.
     * A company can have many cash flow records.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function cashFlows()
    {
        return $this->hasMany(CashFlow::class);
    }

    /**
     * Define a relationship with the TransactionCategory model.
     * A company can have many transaction categories.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function categories()
    {
        return $this->hasMany(TransactionCategory::class);
    }

    /**
     * Define a relationship with the Form model.
     * A company can have many forms.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function forms()
    {
        return $this->hasMany(Form::class);
    }

    /**
     * Define a relationship with the FormResponse model.
     * A company can have many form responses.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function formResponses()
    {
        return $this->hasMany(FormResponse::class);
    }

    /**
     * Define a relationship with the CategoryProduct model.
     * A company can have many product categories.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function productCategories()
    {
        return $this->hasMany(CategoryProduct::class);
    }

    /**
     * Define a relationship with the Product model.
     * A company can have many products.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function products()
    {
        return $this->hasMany(Product::class);
    }

    /**
     * Define a relationship with the Stock model.
     * A company can have many stock entries.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function stocks()
    {
        return $this->hasMany(Stock::class);
    }
}
