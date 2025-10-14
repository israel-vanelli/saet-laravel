<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Address extends Model
{
    use HasFactory;

    protected $fillable = [
        'addressable_id',
        'addressable_type',
        'name',
        'state',
        'city',
        'district',
        'street',
        'number',
        'complement',
        'zip_code'
    ];

    #region Relationships
    public function addressable()
    {
        return $this->morphTo();
    }
}
