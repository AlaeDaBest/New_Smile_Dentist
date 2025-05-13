<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;
use App\Models\Appointment;
use App\Models\Estimate;
use App\Models\Invoice;

class Patient extends Model
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
    public function estimates()
    {
        return $this->hasMany(Estimate::class);
    }
    public function invoices()
    {
        return $this->hasMany(Invoice::class);
    }
}
