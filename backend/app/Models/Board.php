<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Board extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = ['name'];

    public function lists()
    {
        return $this->hasMany(BoardList::class)->orderBy('order');
    }

    public function cards()
    {
        return $this->hasMany(Card::class);
    }
}
