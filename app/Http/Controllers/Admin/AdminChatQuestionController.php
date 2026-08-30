<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ChatQuestion;
use App\Models\SiteSetting;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminChatQuestionController extends Controller
{
    /**
     * Display a listing of the chat questions and options.
     */
    public function index(Request $request): Response
    {
        $search = $request->input('search');
        $category = $request->input('category');
        $tab = $request->input('tab', 'all');

        $query = ChatQuestion::query();

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('question', 'like', "%{$search}%")
                  ->orWhere('answer', 'like', "%{$search}%")
                  ->orWhere('keywords', 'like', "%{$search}%")
                  ->orWhere('category', 'like', "%{$search}%");
            });
        }

        if ($category && $category !== 'all') {
            $query->where('category', $category);
        }

        if ($tab === 'quick') {
            $query->where('is_quick_option', true);
        } elseif ($tab === 'active') {
            $query->where('is_active', true);
        } elseif ($tab === 'inactive') {
            $query->where('is_active', false);
        }

        $questions = $query->orderBy('sort_order', 'asc')
            ->orderBy('id', 'asc')
            ->get();

        $allCategories = ChatQuestion::select('category')
            ->distinct()
            ->whereNotNull('category')
            ->pluck('category')
            ->toArray();

        $stats = [
            'total' => ChatQuestion::count(),
            'quick_options' => ChatQuestion::where('is_quick_option', true)->count(),
            'active' => ChatQuestion::where('is_active', true)->count(),
            'inactive' => ChatQuestion::where('is_active', false)->count(),
            'categories_count' => count($allCategories),
        ];

        $chatSettings = [
            'chat_is_enabled' => SiteSetting::get('chat_is_enabled', '1'),
            'chat_bot_name' => SiteSetting::get('chat_bot_name', 'ITS AI Assistant'),
            'chat_welcome_message' => SiteSetting::get('chat_welcome_message', "Hello! 👋 I'm your AI Solutions Assistant. You can ask me any question about our ready apps, licenses, or connect directly to our 24/7 Human Support Team."),
            'chat_agent_name' => SiteSetting::get('chat_agent_name', 'Engr. Tanvir (Support Lead)'),
            'chat_support_phone' => SiteSetting::get('chat_support_phone', '+880 1800-000000'),
            'chat_support_email' => SiteSetting::get('chat_support_email', 'support@itsolutions.com'),
        ];

        return Inertia::render('Admin/ChatQuestions/Index', [
            'questions' => $questions,
            'categories' => $allCategories,
            'stats' => $stats,
            'chatSettings' => $chatSettings,
            'filters' => [
                'search' => $search,
                'category' => $category,
                'tab' => $tab,
            ],
        ]);
    }

    /**
     * Store a newly created chat question.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'question' => 'required|string|max:255',
            'answer' => 'required|string|max:5000',
            'keywords' => 'nullable|string|max:1000',
            'category' => 'nullable|string|max:100',
            'action_label' => 'nullable|string|max:100',
            'action_url' => 'nullable|string|max:500',
            'suggested_options' => 'nullable|array',
            'suggested_options.*' => 'string|max:255',
            'is_quick_option' => 'boolean',
            'is_active' => 'boolean',
            'sort_order' => 'integer|min:0',
        ]);

        $validated['category'] = $validated['category'] ?: 'General';
        $validated['suggested_options'] = array_values(array_filter($validated['suggested_options'] ?? []));

        ChatQuestion::create($validated);

        return back()->with('success', 'Live chat question & selection created successfully.');
    }

    /**
     * Update the specified chat question.
     */
    public function update(Request $request, ChatQuestion $chatQuestion): RedirectResponse
    {
        $validated = $request->validate([
            'question' => 'required|string|max:255',
            'answer' => 'required|string|max:5000',
            'keywords' => 'nullable|string|max:1000',
            'category' => 'nullable|string|max:100',
            'action_label' => 'nullable|string|max:100',
            'action_url' => 'nullable|string|max:500',
            'suggested_options' => 'nullable|array',
            'suggested_options.*' => 'string|max:255',
            'is_quick_option' => 'boolean',
            'is_active' => 'boolean',
            'sort_order' => 'integer|min:0',
        ]);

        $validated['category'] = $validated['category'] ?: 'General';
        $validated['suggested_options'] = array_values(array_filter($validated['suggested_options'] ?? []));

        $chatQuestion->update($validated);

        return back()->with('success', 'Live chat question updated successfully.');
    }

    /**
     * Remove the specified chat question.
     */
    public function destroy(ChatQuestion $chatQuestion): RedirectResponse
    {
        $chatQuestion->delete();

        return back()->with('success', 'Chat question deleted successfully.');
    }

    /**
     * Fast toggle active state.
     */
    public function toggleActive(ChatQuestion $chatQuestion): RedirectResponse
    {
        $chatQuestion->update([
            'is_active' => !$chatQuestion->is_active,
        ]);

        $status = $chatQuestion->is_active ? 'activated' : 'deactivated';
        return back()->with('success', "Chat question {$status} successfully.");
    }

    /**
     * Fast toggle quick starter option state.
     */
    public function toggleQuickOption(ChatQuestion $chatQuestion): RedirectResponse
    {
        $chatQuestion->update([
            'is_quick_option' => !$chatQuestion->is_quick_option,
        ]);

        $status = $chatQuestion->is_quick_option ? 'added to starter options' : 'removed from starter options';
        return back()->with('success', "Question {$status}.");
    }

    /**
     * Update global live chat configuration settings.
     */
    public function updateSettings(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'chat_is_enabled' => 'nullable|string|in:0,1',
            'chat_bot_name' => 'nullable|string|max:100',
            'chat_welcome_message' => 'nullable|string|max:1000',
            'chat_agent_name' => 'nullable|string|max:100',
            'chat_support_phone' => 'nullable|string|max:100',
            'chat_support_email' => 'nullable|email|max:150',
        ]);

        foreach ($validated as $key => $value) {
            SiteSetting::set($key, $value);
        }

        return back()->with('success', 'Live chat settings updated successfully.');
    }
}
