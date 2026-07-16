<?php

namespace App\Http\Controllers;

use App\Models\Board;
use App\Models\Card;
use Illuminate\Http\Request;

class CardController extends Controller
{
    public function index(Board $board)
    {
        return $board->cards()->with('tags', 'comments')->get();
    }

    public function store(Request $request, Board $board)
    {
        $data = $request->validate([
            'list_id' => 'required|uuid|exists:board_lists,id',
            'title' => 'required|string|max:200',
        ]);

        $order = Card::where('list_id', $data['list_id'])->count();

        return $board->cards()->create([
            'list_id' => $data['list_id'],
            'title' => $data['title'],
            'order' => $order,
        ]);
    }

    public function update(Request $request, Card $card)
    {
        $data = $request->validate([
            'title' => 'sometimes|string|max:200',
            'description' => 'sometimes|nullable|string',
            'member_id' => 'sometimes|nullable|uuid|exists:members,id',
            'due_date' => 'sometimes|nullable|date',
            'tag_ids' => 'sometimes|array',
            'tag_ids.*' => 'uuid|exists:tags,id',
        ]);

        if (isset($data['tag_ids'])) {
            $card->tags()->sync($data['tag_ids']);
            unset($data['tag_ids']);
        }

        $card->update($data);
        return $card->load('tags', 'comments');
    }

    public function move(Request $request, Card $card)
    {
        $data = $request->validate([
            'list_id' => 'required|uuid|exists:board_lists,id',
            'order' => 'required|integer',
        ]);
        $card->update($data);
        return $card;
    }

    public function destroy(Card $card)
    {
        $card->delete();
        return response()->noContent();
    }

    public function addComment(Request $request, Card $card)
    {
        $data = $request->validate([
            'text' => 'required|string',
            'member_id' => 'nullable|uuid|exists:members,id',
        ]);

        return $card->comments()->create($data);
    }
}
