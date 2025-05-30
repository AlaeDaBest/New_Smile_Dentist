<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GroupMessage extends Model
{
    use HasFactory;
    protected $fillable = ['group_chat_id', 'sender_id', 'content'];
    public function sender() {
        return $this->belongsTo(User::class, 'sender_id');
    }
}
