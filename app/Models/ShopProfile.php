<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ShopProfile extends Model
{
    protected $fillable = [
        'user_id',
        'shop_name',
        'shop_address',
        'shop_city',
        'shop_phone',
        'shop_license',
        'notes',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
