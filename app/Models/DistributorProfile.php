<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DistributorProfile extends Model
{
    protected $fillable = [
        'user_id',
        'company_name',
        'company_address',
        'company_city',
        'company_phone',
        'company_license',
        'service_areas',
        'notes',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
