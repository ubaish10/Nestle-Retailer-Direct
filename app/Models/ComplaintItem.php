<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ComplaintItem extends Model
{
    protected $fillable = [
        'complaint_id',
        'product_id',
        'product_name',
        'product_image',
        'quantity',
        'proof_image_path',
    ];

    protected $casts = [
        'quantity' => 'integer',
    ];

    public function complaint(): BelongsTo
    {
        return $this->belongsTo(Complaint::class);
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }
}
