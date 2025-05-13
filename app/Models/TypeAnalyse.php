<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TypeAnalyse extends Model
{
    use HasFactory;
    public function estimateItems()
    {
        return $this->morphMany(EstimateItem::class, 'itemable');
    }
}
