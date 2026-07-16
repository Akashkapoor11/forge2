<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class CardComment extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = ['card_id', 'member_id', 'text'];

    public function member()
    {
        return $this->belongsTo(Member::class);
    }
}
