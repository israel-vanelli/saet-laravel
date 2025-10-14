<?php

namespace App\Traits;

use App\Models\Address;
use App\Models\Store;

trait HasAddresses
{
    /**
     * @return \Illuminate\Database\Eloquent\Relations\MorphMany
     */
    public function addresses()
    {
        return $this->morphMany(Address::class, 'addressable');
    }

    public function address(){
        return $this->morphOne(Address::class, 'addressable');
    }

    public function setAddress($zip_code, $state, $city, $district, $street, $number = '', $complement = ''){
        $address = $this->address()->updateOrCreate([], compact('zip_code', 'state', 'city', 'district', 'street', 'number', 'complement'));

        return $address;
    }
}
