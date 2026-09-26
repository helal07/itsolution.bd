<?php

namespace Tests\Feature;

use App\Models\Client;
use App\Models\Employee;
use App\Models\Item;
use App\Models\Order;
use App\Models\OrderAttachment;
use App\Models\OrderRequirement;
use App\Models\Quote;
use App\Models\Task;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class OrderRequirementAndMultimediaTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_converting_quote_auto_creates_client_user_and_initial_requirement(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);

        $quote = Quote::create([
            'name' => 'Shakil Ahmed',
            'company_name' => 'Shakil Enterprises',
            'email' => 'shakil@testcorp.com',
            'phone' => '01711000000',
            'message' => 'We need an ecommerce website with mobile responsive design and bKash payment gateway.',
            'estimated_budget' => 45000,
            'status' => 'new',
        ]);

        $response = $this->actingAs($admin)->post(route('admin.quotes.convert', $quote->id));

        $response->assertRedirect(route('admin.orders.index'));

        // Client User created
        $this->assertDatabaseHas('users', [
            'email' => 'shakil@testcorp.com',
            'role' => 'client',
        ]);

        $createdUser = User::where('email', 'shakil@testcorp.com')->first();
        $this->assertNotNull($createdUser);

        // Order created
        $this->assertDatabaseHas('orders', [
            'user_id' => $createdUser->id,
            'amount' => 45000,
            'currency' => 'BDT',
        ]);

        $order = Order::where('user_id', $createdUser->id)->first();

        // Initial Requirement module created from quote message
        $this->assertDatabaseHas('order_requirements', [
            'order_id' => $order->id,
            'user_id' => $createdUser->id,
            'title' => 'Initial Quotation Scope & Details',
        ]);
    }

    public function test_client_can_view_order_requirements_and_create_module(): void
    {
        $clientUser = User::factory()->create(['role' => 'client']);
        $client = Client::create(['name' => 'Demo Client', 'email' => $clientUser->email]);
        $order = Order::create([
            'user_id' => $clientUser->id,
            'client_id' => $client->id,
            'project_name' => 'Custom ERP App',
            'amount' => 60000,
            'currency' => 'BDT',
            'status' => 'pending',
        ]);

        // Access Requirements Hub
        $response = $this->actingAs($clientUser)->get(route('orders.requirements.show', $order->id));
        $response->assertStatus(200);

        // Create a new requirement specification
        $storeResponse = $this->actingAs($clientUser)->post(route('orders.requirements.store', $order->id), [
            'title' => 'Mobile App UI/UX & Color Theme',
            'description' => 'Color palette should follow royal blue and neon accents. Dark mode is required.',
        ]);

        $storeResponse->assertRedirect();
        $this->assertDatabaseHas('order_requirements', [
            'order_id' => $order->id,
            'title' => 'Mobile App UI/UX & Color Theme',
        ]);
    }

    public function test_client_can_attach_media_and_voice_notes_to_requirement(): void
    {
        Storage::fake('public');

        $clientUser = User::factory()->create(['role' => 'client']);
        $client = Client::create(['name' => 'Demo Client', 'email' => $clientUser->email]);
        $order = Order::create([
            'user_id' => $clientUser->id,
            'client_id' => $client->id,
            'project_name' => 'Custom ERP App',
            'amount' => 60000,
            'currency' => 'BDT',
            'status' => 'pending',
        ]);

        $requirement = OrderRequirement::create([
            'order_id' => $order->id,
            'client_id' => $client->id,
            'user_id' => $clientUser->id,
            'title' => 'Homepage Layout',
            'description' => 'Layout specs',
            'status' => 'submitted',
        ]);

        // 1. Upload Image
        $imageFile = UploadedFile::fake()->image('mockup.png', 800, 600);
        $resImage = $this->actingAs($clientUser)->post(route('orders.requirements.attachments.store', [$order->id, $requirement->id]), [
            'file_type' => 'image',
            'file' => $imageFile,
            'original_name' => 'mockup.png',
        ]);
        $resImage->assertRedirect();
        $this->assertDatabaseHas('order_attachments', [
            'order_requirement_id' => $requirement->id,
            'file_type' => 'image',
            'original_name' => 'mockup.png',
        ]);

        // 2. Attach External Video Link
        $resLink = $this->actingAs($clientUser)->post(route('orders.requirements.attachments.store', [$order->id, $requirement->id]), [
            'file_type' => 'link',
            'external_url' => 'https://www.loom.com/share/test-briefing-video',
            'original_name' => 'Loom Walkthrough',
        ]);
        $resLink->assertRedirect();
        $this->assertDatabaseHas('order_attachments', [
            'order_requirement_id' => $requirement->id,
            'file_type' => 'link',
            'external_url' => 'https://www.loom.com/share/test-briefing-video',
        ]);
    }

    public function test_staff_can_view_assigned_task_requirements_and_media(): void
    {
        $staffUser = User::factory()->create(['role' => 'client']); // general user linked as employee
        $employee = Employee::create([
            'user_id' => $staffUser->id,
            'name' => 'Staff Developer',
            'email' => $staffUser->email,
            'designation' => 'Fullstack Developer',
            'status' => 'active',
        ]);

        $clientUser = User::factory()->create(['role' => 'client']);
        $client = Client::create(['name' => 'Acme Inc', 'email' => $clientUser->email]);
        $order = Order::create([
            'user_id' => $clientUser->id,
            'client_id' => $client->id,
            'project_name' => 'Corporate Website Redesign',
            'amount' => 50000,
            'currency' => 'BDT',
            'status' => 'pending',
        ]);

        $requirement = OrderRequirement::create([
            'order_id' => $order->id,
            'client_id' => $client->id,
            'user_id' => $clientUser->id,
            'title' => 'Client Voice Note Briefing',
            'description' => 'Detailed voice explanation attached.',
            'status' => 'submitted',
        ]);

        OrderAttachment::create([
            'order_requirement_id' => $requirement->id,
            'file_type' => 'audio',
            'original_name' => 'Client Voice Note.webm',
            'duration_seconds' => 45,
            'uploaded_by' => $clientUser->id,
        ]);

        // Task assigned to this staff member
        $task = Task::create([
            'title' => 'Design and Develop Website Redesign',
            'assigned_to' => $employee->id,
            'order_id' => $order->id,
            'client_id' => $client->id,
            'priority' => 'high',
            'status' => 'in_progress',
        ]);

        // Staff can access My Tasks
        $response = $this->actingAs($staffUser)->get(route('staff.tasks.index'));
        $response->assertStatus(200);

        // Staff can access the Order Requirements Hub
        $hubResponse = $this->actingAs($staffUser)->get(route('orders.requirements.show', $order->id));
        $hubResponse->assertStatus(200);
    }
}
