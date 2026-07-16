<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->json([
        'status'  => 'ok',
        'app'     => 'Docket — Forge 2 Qualifier',
        'version' => '1.0.0',
    ]);
});
