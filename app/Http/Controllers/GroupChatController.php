<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\GroupChat;
use App\Models\GroupMessage;

class GroupChatController extends Controller
{
    public function index()
    {
        $groupChats = GroupChat::with('users')->get();
        return response()->json($groupChats);
    }
    public function messages($id) {
        // dd($id);
        $messages = GroupMessage::with(['sender'])->where('group_chat_id', $id)->get();
        if (!$messages) {
            return response()->json(['error' => 'Group not found'], 404);
        }
        return $messages;
    }
    public function create(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'members' => 'required|array',
        ]);

        $groupChat = GroupChat::create([
            'name' => $validated['name'],
        ]);

        foreach ($validated['members'] as $userId) {
            GroupChatMember::create([
                'group_chat_id' => $groupChat->id,
                'user_id' => $userId,
            ]);
        }

        return response()->json($groupChat, 201);
    }
    public function storeMessage(Request $request, $id) {
        $request->validate(['content' => 'required|string']);
        $message = GroupMessage::create([
            'group_chat_id' => $id,
            'sender_id' => auth()->id(),
            'content' => $request->content,
        ]);
    
        event(new \App\Events\GroupMessageSent($message));
    
        return response()->json($message->load('sender'), 201);
    }
    public function sendMessage(Request $request)
    {
        $validated = $request->validate([
            'group_chat_id' => 'required|exists:group_chats,id',
            'content' => 'required|string',
        ]);

        $message = Message::create([
            'sender_id' => auth()->id(),
            'group_chat_id' => $validated['group_chat_id'],
            'content' => $validated['content'],
        ]);

        broadcast(new NewMessage($message)); 

        return response()->json($message, 201);
    }
}
