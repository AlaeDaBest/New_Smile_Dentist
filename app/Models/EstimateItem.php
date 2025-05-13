<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Estimate;

class EstimateItem extends Model
{
    use HasFactory;
    public function estimate()
    {
        return $this->belongsTo(Estimate::class);
    }
    public function itemable()
    {
        return $this->morphTo();
    }
}
