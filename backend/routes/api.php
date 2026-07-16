<?php

use App\Http\Controllers\BoardController;
use App\Http\Controllers\BoardListController;
use App\Http\Controllers\CardController;
use App\Http\Controllers\MemberController;
use App\Http\Controllers\TagController;
use Illuminate\Support\Facades\Route;

// Debug: test if routing works at all (no DB needed)
Route::get('/ping', fn () => response()->json(['status' => 'ok', 'time' => now()->toIso8601String()]));

Route::get('/boards', [BoardController::class, 'index']);
Route::post('/boards', [BoardController::class, 'store']);
Route::delete('/boards/{board}', [BoardController::class, 'destroy']);

Route::get('/boards/{board}/lists', [BoardListController::class, 'index']);
Route::post('/boards/{board}/lists', [BoardListController::class, 'store']);
Route::patch('/lists/{list}', [BoardListController::class, 'update']);
Route::delete('/lists/{list}', [BoardListController::class, 'destroy']);

Route::get('/boards/{board}/cards', [CardController::class, 'index']);
Route::post('/boards/{board}/cards', [CardController::class, 'store']);
Route::patch('/cards/{card}', [CardController::class, 'update']);
Route::patch('/cards/{card}/move', [CardController::class, 'move']);
Route::delete('/cards/{card}', [CardController::class, 'destroy']);
Route::post('/cards/{card}/comments', [CardController::class, 'addComment']);

Route::get('/members', [MemberController::class, 'index']);
Route::post('/members', [MemberController::class, 'store']);

Route::get('/tags', [TagController::class, 'index']);
Route::post('/tags', [TagController::class, 'store']);
