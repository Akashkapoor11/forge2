<?php

namespace Tests\Feature;

use App\Models\Board;
use App\Models\BoardList;
use App\Models\Tag;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class KanbanFlowTest extends TestCase
{
    use RefreshDatabase;

    public function test_full_kanban_flow(): void
    {
        $board = Board::create(['name' => 'Test Board']);

        $todo = $board->lists()->create(['name' => 'To Do', 'order' => 0]);
        $done = $board->lists()->create(['name' => 'Done', 'order' => 1]);

        $card = $board->cards()->create([
            'list_id' => $todo->id,
            'title' => 'Write feature test',
            'order' => 0,
        ]);

        $this->assertDatabaseHas('cards', ['id' => $card->id, 'list_id' => $todo->id]);

        // Move the card to Done.
        $response = $this->patchJson("/api/cards/{$card->id}/move", [
            'list_id' => $done->id,
            'order' => 0,
        ]);
        $response->assertOk();
        $this->assertDatabaseHas('cards', ['id' => $card->id, 'list_id' => $done->id]);

        // Tag it.
        $tag = Tag::create(['name' => 'bug', 'color' => '#C1443C']);
        $response = $this->patchJson("/api/cards/{$card->id}", [
            'tag_ids' => [$tag->id],
        ]);
        $response->assertOk();
        $this->assertTrue($card->fresh()->tags->contains($tag->id));
    }

    public function test_card_flagged_overdue_unless_in_done_list(): void
    {
        $board = Board::create(['name' => 'Overdue Board']);
        $doing = $board->lists()->create(['name' => 'Doing', 'order' => 0]);
        $done = $board->lists()->create(['name' => 'Done', 'order' => 1]);

        $overdueCard = $board->cards()->create([
            'list_id' => $doing->id,
            'title' => 'Late task',
            'due_date' => now()->subDay(),
            'order' => 0,
        ]);

        $safeCard = $board->cards()->create([
            'list_id' => $done->id,
            'title' => 'Finished late but done',
            'due_date' => now()->subDay(),
            'order' => 0,
        ]);

        $this->assertTrue($overdueCard->is_overdue);
        $this->assertFalse($safeCard->is_overdue);
    }
}
