<?php

namespace App\Http\Controllers;

use App\Models\Board;
use Illuminate\Http\Request;

class BoardController extends Controller
{
    public function index()
    {
        return Board::orderBy('created_at')->get();
    }

    public function store(Request $request)
    {
        $data = $request->validate(['name' => 'required|string|max:120']);
        return Board::create($data);
    }

    public function destroy(Board $board)
    {
        $board->delete();
        return response()->noContent();
    }
}
