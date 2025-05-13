<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\EstimateItem;
use App\Models\Appointments;

class Type extends Model
{
    use HasFactory;
    public function appointments()
    {
        return $this->hasMany(Appointment::class);
    }
    public function estimateItems()
    {
        return $this->morphMany(EstimateItem::class, 'itemable');
    }
    
}
