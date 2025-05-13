<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Type;
use App\Models\Patient;
use App\Models\Dentist;

class Appointment extends Model
{
    use HasFactory;
    public function type()
    {
        return $this->belongsTo(Type::class,'type_id');
    }

    public function patient()
    {
        return $this->belongsTo(Patient::class);
    }
    public function dentist()
    {
        return $this->belongsTo(Dentist::class);
    }
}
