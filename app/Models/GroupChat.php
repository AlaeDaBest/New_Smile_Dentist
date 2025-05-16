<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;
use App\Models\GroupMessage;

class GroupChat extends Model
{
    use HasFactory;
    public function users()
    {
        return $this->belongsToMany(User::class, 'group_chat_members');
    }
    public function messages() {
        return $this->hasMany(GroupMessage::class);
    }
}
