<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Infermier extends Model
{
    use HasFactory;
    public function user()
    {
        return $this->morphOne(User::class,'roleable');
    }
}
