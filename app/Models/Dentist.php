<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;
use App\Models\Appointment;

class Dentist extends Model
{
    use HasFactory;
    public function user()
    {
        return $this->morphOne(User::class,'roleable');
    }
    public function appointments()
    {
        return $this->hasMany(Appointment::class);
    }
}
