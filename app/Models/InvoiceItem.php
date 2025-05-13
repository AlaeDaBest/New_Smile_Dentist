<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Invoice;

class InvoiceItem extends Model
{
    use HasFactory;
    public function estimate()
    {
        return $this->belongsTo(Invoice::class);
    }
    public function itemable()
    {
        return $this->morphTo();
    }
}
