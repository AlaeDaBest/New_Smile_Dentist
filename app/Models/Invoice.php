<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Patient;
use App\Models\InvoiceItem;
use App\Models\Payment;

class Invoice extends Model
{
    use HasFactory;
    public function patient()
    {
        return $this->belongsTo(Patient::class);
    }
    public function items()
    {
        return $this->hasMany(InvoiceItem::class);
    }
    public function payments()
    {
        return $this->hasMany(Payment::class);
    }
}
