<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Patient;
use App\Models\TypeAnalyse;

class Analyse extends Model
{
    use HasFactory;
    
    public function patient()
    {
        return $this->belongsTo(Patient::class);
    }
    public function type()
    {
        return $this->belongsTo(TypeAnalyse::class,'type_id');
    }
}
