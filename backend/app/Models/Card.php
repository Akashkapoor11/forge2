<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Card extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'board_id', 'list_id', 'member_id', 'title', 'description', 'due_date', 'order',
    ];

    protected $casts = [
        'due_date' => 'datetime',
    ];

    public function board()
    {
        return $this->belongsTo(Board::class);
    }

    public function list()
    {
        return $this->belongsTo(BoardList::class, 'list_id');
    }

    public function member()
    {
        return $this->belongsTo(Member::class);
    }

    public function tags()
    {
        return $this->belongsToMany(Tag::class);
    }

    public function comments()
    {
        return $this->hasMany(CardComment::class)->orderBy('created_at');
    }

    public function getIsOverdueAttribute(): bool
    {
        return $this->due_date !== null
            && $this->due_date->isPast()
            && ! str_contains(strtolower($this->list?->name ?? ''), 'done');
    }
}
