<?php

namespace App\Http\Controllers;

use App\Models\Board;
use App\Models\BoardList;
use Illuminate\Http\Request;

class BoardListController extends Controller
{
    public function index(Board $board)
    {
        return $board->lists;
    }

    public function store(Request $request, Board $board)
    {
        $data = $request->validate(['name' => 'required|string|max:120']);
        $order = $board->lists()->count();

        return $board->lists()->create([
            'name' => $data['name'],
            'order' => $order,
        ]);
    }

    public function update(Request $request, BoardList $list)
    {
        $data = $request->validate([
            'name' => 'sometimes|string|max:120',
            'order' => 'sometimes|integer',
        ]);
        $list->update($data);
        return $list;
    }

    public function destroy(BoardList $list)
    {
        $list->delete();
        return response()->noContent();
    }
}
