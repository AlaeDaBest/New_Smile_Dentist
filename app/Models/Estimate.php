<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Patient;
use App\Models\EstimateItem;

class Estimate extends Model
{
    use HasFactory;
    public function patient()
    {
        return $this->belongsTo(Patient::class);
    }
    public function items()
    {
        return $this->hasMany(EstimateItem::class);
    }
}
