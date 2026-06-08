<?php

namespace App\Http\Controllers;

use App\Models\Feedback;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class FeedbackController extends Controller
{
    public function index()
    {
        $feedbacks = Feedback::where('user_id', Auth::id())
            ->latest()
            ->get()
            ->map(function ($feedback) {
                return [
                    'id' => $feedback->id,
                    'message' => $feedback->message,
                    'admin_reply' => $feedback->admin_reply,
                    'replied_at' => $feedback->replied_at?->format('M d, Y h:i A'),
                    'created_at' => $feedback->created_at->format('M d, Y h:i A'),
                ];
            });

        return inertia('retailer/feedback/index', [
            'feedbacks' => $feedbacks,
        ]);
    }

    public function adminIndex()
    {
        $feedbacks = Feedback::with('user')
            ->latest()
            ->get()
            ->map(function ($feedback) {
                return [
                    'id' => $feedback->id,
                    'message' => $feedback->message,
                    'has_reply' => !is_null($feedback->admin_reply),
                    'retailer_name' => $feedback->user->name ?? 'Unknown',
                    'retailer_email' => $feedback->user->email ?? '',
                    'created_at' => $feedback->created_at->format('M d, Y h:i A'),
                ];
            });

        return inertia('admin/feedback/index', [
            'feedbacks' => $feedbacks,
        ]);
    }

    public function adminShow(Feedback $feedback)
    {
        $feedback->load('user');

        return inertia('admin/feedback/show', [
            'feedback' => [
                'id' => $feedback->id,
                'message' => $feedback->message,
                'admin_reply' => $feedback->admin_reply,
                'replied_at' => $feedback->replied_at?->format('M d, Y h:i A'),
                'retailer_name' => $feedback->user->name ?? 'Unknown',
                'retailer_email' => $feedback->user->email ?? '',
                'created_at' => $feedback->created_at->format('M d, Y h:i A'),
            ],
        ]);
    }

    public function adminReply(Request $request, Feedback $feedback)
    {
        $validated = $request->validate([
            'admin_reply' => 'required|string|max:2000',
        ]);

        $feedback->update([
            'admin_reply' => $validated['admin_reply'],
            'replied_at' => now(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Reply sent successfully.',
        ]);
    }

    public function distributorIndex()
    {
        $feedbacks = Feedback::where('user_id', Auth::id())
            ->latest()
            ->get()
            ->map(function ($feedback) {
                return [
                    'id' => $feedback->id,
                    'message' => $feedback->message,
                    'admin_reply' => $feedback->admin_reply,
                    'replied_at' => $feedback->replied_at?->format('M d, Y h:i A'),
                    'created_at' => $feedback->created_at->format('M d, Y h:i A'),
                ];
            });

        return inertia('distributor/feedback/index', [
            'feedbacks' => $feedbacks,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'message' => 'required|string|max:2000',
        ]);

        $feedback = Feedback::create([
            'user_id' => Auth::id(),
            'message' => $validated['message'],
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Thank you for your feedback!',
        ]);
    }
}
