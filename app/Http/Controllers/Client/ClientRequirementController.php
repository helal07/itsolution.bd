<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderAttachment;
use App\Models\OrderRequirement;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ClientRequirementController extends Controller
{
    /**
     * Ensure current user has permission to view/manage this order's requirements.
     */
    protected function authorizeOrderAccess(Request $request, Order $order): void
    {
        $user = $request->user();
        if ($user->isAdmin()) {
            return;
        }

        // Check if user owns this order directly
        if ($order->user_id === $user->id) {
            return;
        }

        // Check if user is linked to the client record
        if ($order->client && ($order->client->email === $user->email || $order->client->phone === $user->phone)) {
            return;
        }

        // Check if user is an employee/staff assigned to this order or task
        $employeeId = $user->employee?->id;
        if ($employeeId && $order->tasks()->where('assigned_to', $employeeId)->exists()) {
            return;
        }

        abort(403, 'Unauthorized access to order requirements.');
    }

    /**
     * Show the Requirements & Workspace page for an Order.
     */
    public function show(Request $request, Order $order): Response
    {
        $this->authorizeOrderAccess($request, $order);

        $order->load([
            'item:id,name,slug,thumbnail,price',
            'client:id,name,email,phone,contact_person',
            'requirements' => function ($q) {
                $q->with([
                    'attachments.uploader:id,name,role',
                    'user:id,name,role',
                ])->orderBy('id', 'desc');
            },
            'tasks' => function ($q) {
                $q->with(['assignee:id,name,designation,avatar', 'steps.assignee:id,name'])
                  ->orderBy('id', 'desc');
            }
        ]);

        return Inertia::render('Client/OrderRequirements', [
            'order' => $order,
            'isStaffOrAdmin' => $request->user()->isAdmin() || $request->user()->isStaff(),
        ]);
    }

    /**
     * Create a new requirement specification block under an Order.
     */
    public function store(Request $request, Order $order): RedirectResponse
    {
        $this->authorizeOrderAccess($request, $order);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $requirement = OrderRequirement::create([
            'order_id' => $order->id,
            'client_id' => $order->client_id,
            'user_id' => $request->user()->id,
            'title' => $validated['title'],
            'description' => $validated['description'] ?? null,
            'status' => 'submitted',
        ]);

        // Dispatch alert notification to assigned team members and admin
        \App\Services\MailConfigService::sendClientDirectiveNotification(
            order: $order,
            requirement: $requirement,
            attachment: null,
            uploader: $request->user(),
            type: 'New Client Directive / Requirement'
        );

        return back()->with('success', 'Directive added successfully and assigned team members notified.');
    }

    /**
     * Upload an attachment (Image, Voice Note Audio, Video, Document or External Link).
     */
    public function storeAttachment(Request $request, Order $order, OrderRequirement $requirement): RedirectResponse
    {
        $this->authorizeOrderAccess($request, $order);

        if ($requirement->order_id !== $order->id) {
            abort(404);
        }

        $validated = $request->validate([
            'file_type' => 'required|in:image,audio,video,document,link',
            'file' => 'nullable|file|max:61440', // 60MB max
            'external_url' => 'nullable|url|max:500',
            'original_name' => 'nullable|string|max:255',
            'duration_seconds' => 'nullable|integer|min:0',
        ]);

        $filePath = null;
        $sizeKb = null;
        $originalName = $validated['original_name'] ?? 'Attachment';

        if ($request->hasFile('file')) {
            $file = $request->file('file');
            $originalName = $validated['original_name'] ?: $file->getClientOriginalName();
            $sizeKb = (int) round($file->getSize() / 1024);

            $folder = 'order-requirements/' . $order->id;
            $filePath = $file->store($folder, 'public');
        } elseif ($validated['file_type'] === 'link') {
            if (empty($validated['external_url'])) {
                return back()->withErrors(['external_url' => 'Please provide a valid URL link.']);
            }
            $originalName = $originalName ?: 'External Resource / Video Link';
        }

        $attachment = OrderAttachment::create([
            'order_requirement_id' => $requirement->id,
            'file_type' => $validated['file_type'],
            'file_path' => $filePath,
            'external_url' => $validated['external_url'] ?? null,
            'original_name' => $originalName,
            'file_size_kb' => $sizeKb,
            'duration_seconds' => $validated['duration_seconds'] ?? null,
            'uploaded_by' => $request->user()->id,
        ]);

        // Dispatch alert notification to assigned team members and admin
        \App\Services\MailConfigService::sendClientDirectiveNotification(
            order: $order,
            requirement: $requirement,
            attachment: $attachment,
            uploader: $request->user(),
            type: 'New Media / Attachment Uploaded (' . ucfirst($validated['file_type']) . ')'
        );

        return back()->with('success', ucfirst($validated['file_type']) . ' uploaded successfully and assigned team notified!');
    }

    /**
     * Delete an attachment.
     */
    public function destroyAttachment(Request $request, OrderAttachment $attachment): RedirectResponse
    {
        $user = $request->user();
        if (!$user->isAdmin() && $attachment->uploaded_by !== $user->id) {
            abort(403, 'You do not have permission to delete this file.');
        }

        if ($attachment->file_path && Storage::disk('public')->exists($attachment->file_path)) {
            Storage::disk('public')->delete($attachment->file_path);
        }

        $attachment->delete();

        return back()->with('success', 'Attachment removed successfully.');
    }
}
