<?php

namespace Tests\Feature\Admin;

use App\Models\ChatQuestion;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminChatQuestionTest extends TestCase
{
    use RefreshDatabase;

    protected User $admin;
    protected User $client;

    protected function setUp(): void
    {
        parent::setUp();

        $this->admin = User::factory()->create([
            'role' => 'admin',
        ]);

        $this->client = User::factory()->create([
            'role' => 'client',
        ]);
    }

    public function test_admin_can_view_chat_questions_list(): void
    {
        ChatQuestion::create([
            'question' => 'How does license activation work?',
            'answer' => 'License keys are activated automatically.',
            'category' => 'Licenses',
            'is_quick_option' => true,
            'is_active' => true,
        ]);

        $response = $this->actingAs($this->admin)->get(route('admin.chat-questions.index'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Admin/ChatQuestions/Index')
            ->has('questions')
            ->has('stats')
            ->has('chatSettings')
        );
    }

    public function test_non_admin_cannot_access_chat_questions_management(): void
    {
        $response = $this->actingAs($this->client)->get(route('admin.chat-questions.index'));
        $response->assertStatus(403);
    }

    public function test_admin_can_create_new_chat_question_with_options(): void
    {
        $response = $this->actingAs($this->admin)->post(route('admin.chat-questions.store'), [
            'question' => 'What is the SLA response time?',
            'answer' => 'Our SLA guarantee is < 15 minutes for critical incidents.',
            'keywords' => 'sla, uptime, incident, guarantee',
            'category' => 'Support',
            'action_label' => 'View SLA Specs',
            'action_url' => '/services',
            'suggested_options' => ['Connect to Live Support', 'Request Quote'],
            'is_quick_option' => true,
            'is_active' => true,
            'sort_order' => 10,
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('chat_questions', [
            'question' => 'What is the SLA response time?',
            'category' => 'Support',
            'is_quick_option' => 1,
        ]);
    }

    public function test_admin_can_update_chat_question(): void
    {
        $question = ChatQuestion::create([
            'question' => 'Original Question?',
            'answer' => 'Original answer text.',
            'category' => 'General',
            'is_quick_option' => false,
            'is_active' => true,
        ]);

        $response = $this->actingAs($this->admin)->put(route('admin.chat-questions.update', $question->id), [
            'question' => 'Updated Question?',
            'answer' => 'Updated answer text with new details.',
            'keywords' => 'updated, test',
            'category' => 'Updated Category',
            'action_label' => 'Explore',
            'action_url' => '/services',
            'suggested_options' => ['Next Step'],
            'is_quick_option' => true,
            'is_active' => true,
            'sort_order' => 2,
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('chat_questions', [
            'id' => $question->id,
            'question' => 'Updated Question?',
            'answer' => 'Updated answer text with new details.',
            'is_quick_option' => 1,
        ]);
    }

    public function test_admin_can_toggle_quick_option_status(): void
    {
        $question = ChatQuestion::create([
            'question' => 'Quick toggle test',
            'answer' => 'Test answer',
            'is_quick_option' => false,
            'is_active' => true,
        ]);

        $response = $this->actingAs($this->admin)->post(route('admin.chat-questions.toggle-quick', $question->id));
        $response->assertRedirect();

        $this->assertTrue($question->fresh()->is_quick_option);
    }

    public function test_admin_can_toggle_active_status(): void
    {
        $question = ChatQuestion::create([
            'question' => 'Active toggle test',
            'answer' => 'Test answer',
            'is_quick_option' => true,
            'is_active' => true,
        ]);

        $response = $this->actingAs($this->admin)->post(route('admin.chat-questions.toggle-active', $question->id));
        $response->assertRedirect();

        $this->assertFalse($question->fresh()->is_active);
    }

    public function test_admin_can_delete_chat_question(): void
    {
        $question = ChatQuestion::create([
            'question' => 'To be deleted',
            'answer' => 'Delete me',
            'is_active' => true,
        ]);

        $response = $this->actingAs($this->admin)->delete(route('admin.chat-questions.destroy', $question->id));
        $response->assertRedirect();

        $this->assertDatabaseMissing('chat_questions', [
            'id' => $question->id,
        ]);
    }

    public function test_admin_can_update_chatbot_settings(): void
    {
        $response = $this->actingAs($this->admin)->post(route('admin.chat-questions.settings'), [
            'chat_is_enabled' => '1',
            'chat_bot_name' => 'IT Support Bot Pro',
            'chat_welcome_message' => 'Welcome to IT Solutions Support!',
            'chat_agent_name' => 'Lead Engineer Alex',
            'chat_support_phone' => '+880 1700-999888',
            'chat_support_email' => 'tech@itsolutions.com',
        ]);

        $response->assertRedirect();
        $this->assertEquals('IT Support Bot Pro', \App\Models\SiteSetting::get('chat_bot_name'));
        $this->assertEquals('Welcome to IT Solutions Support!', \App\Models\SiteSetting::get('chat_welcome_message'));
    }
}
