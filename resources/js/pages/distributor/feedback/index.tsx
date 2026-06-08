import { Head, Link, router, usePage } from '@inertiajs/react';
import { MessageSquare, Plus, Send, X, Reply } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

interface FeedbackItem {
    id: number;
    message: string;
    admin_reply: string | null;
    replied_at: string | null;
    created_at: string;
}

interface Props {
    feedbacks: FeedbackItem[];
}

export default function DistributorFeedback({ feedbacks }: Props) {
    const { toast } = useToast();
    const page = usePage();
    const [showForm, setShowForm] = useState(false);
    const [message, setMessage] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim()) return;

        setSubmitting(true);
        try {
            const csrfToken = (page.props.csrf_token as string) ||
                ((document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '');

            const response = await fetch('/api/feedback', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                    'X-Requested-With': 'XMLHttpRequest',
                },
                body: JSON.stringify({ message }),
            });

            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                if (response.redirected || response.status === 401 || response.status === 403) {
                    toast({
                        title: 'Authentication Error',
                        description: 'Please log in again to submit your feedback.',
                        variant: 'destructive',
                    });
                    router.visit('/');
                    return;
                }
                toast({
                    title: 'Error',
                    description: 'Server returned an invalid response. Please try again.',
                    variant: 'destructive',
                });
                return;
            }

            const data = await response.json();

            if (response.ok && data.success) {
                toast({
                    title: 'Success!',
                    description: data.message || 'Thank you for your feedback!',
                });
                setShowForm(false);
                setMessage('');
                router.reload({ only: ['feedbacks'] });
            } else {
                toast({
                    title: 'Error',
                    description: data.message || 'Something went wrong. Please try again.',
                    variant: 'destructive',
                });
            }
        } catch (error) {
            let errorMessage = 'Failed to submit. Please try again.';
            if (error instanceof TypeError && error.message.includes('fetch')) {
                errorMessage = 'Network error. Please check your internet connection.';
            }
            toast({
                title: 'Error',
                description: errorMessage,
                variant: 'destructive',
            });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="flex min-h-screen items-start justify-center bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100 px-3 py-4 md:py-8">
            <Head title="Feedback" />

            <div className="pointer-events-none fixed inset-0 overflow-hidden">
                <div className="absolute top-0 left-1/4 h-64 w-64 rounded-full bg-[#00447C]/5 blur-3xl md:h-96 md:w-96"></div>
                <div className="absolute right-1/4 bottom-0 h-64 w-64 rounded-full bg-blue-400/5 blur-3xl md:h-80 md:w-80"></div>
            </div>

            <div className="relative mx-auto w-full max-w-3xl">
                <header className="relative rounded-t-2xl border border-slate-200/50 bg-white/80 backdrop-blur-xl">
                    <div className="px-4 py-4 md:px-6">
                        <div className="flex items-center justify-between">
                            <Link
                                href="/distributor/home"
                                className="flex items-center gap-2 text-slate-600 transition-colors hover:text-[#00447C]"
                            >
                                <svg
                                    className="h-4 w-4 rotate-180"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 5l7 7-7 7"
                                    />
                                </svg>
                                <span className="text-sm font-medium">
                                    Back to Home
                                </span>
                            </Link>
                        </div>
                        <div className="mt-3 flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#00447C]/10">
                                    <MessageSquare className="h-5 w-5 text-[#00447C]" />
                                </div>
                                <div>
                                    <h1 className="text-lg font-bold tracking-tight text-slate-900 md:text-xl">
                                        Feedback
                                    </h1>
                                    <p className="mt-0.5 text-xs font-medium text-slate-500">
                                        {feedbacks.length} feedback{feedbacks.length !== 1 ? 's' : ''} submitted
                                    </p>
                                </div>
                            </div>
                            {!showForm && (
                                <button
                                    onClick={() => setShowForm(true)}
                                    className="flex items-center gap-2 rounded-xl bg-[#00447C] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#00447C]/90"
                                >
                                    <Plus className="h-4 w-4" />
                                    Add New Feedback
                                </button>
                            )}
                        </div>
                    </div>
                </header>

                <div className="rounded-b-2xl border border-slate-200/50 bg-white/60 p-4 backdrop-blur-sm md:p-6">
                    {showForm && (
                        <div className="mb-6 rounded-xl border border-slate-200 bg-white p-4">
                            <div className="mb-3 flex items-center justify-between">
                                <h3 className="text-sm font-semibold text-slate-900">New Feedback</h3>
                                <button
                                    onClick={() => setShowForm(false)}
                                    className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                            <form onSubmit={handleSubmit} className="space-y-3">
                                <textarea
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="Tell us what you think about our products, services, or anything else..."
                                    rows={4}
                                    className="w-full resize-none rounded-xl border border-slate-300 bg-white p-3 text-sm focus:border-[#00447C] focus:ring-2 focus:ring-[#00447C]"
                                />
                                <button
                                    type="submit"
                                    disabled={submitting || !message.trim()}
                                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#00447C] px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#00447C]/90 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {submitting ? (
                                        'Sending...'
                                    ) : (
                                        <>
                                            <Send className="h-4 w-4" />
                                            Submit Feedback
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    )}

                    {feedbacks.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <MessageSquare className="mb-3 h-12 w-12 text-slate-300" />
                            <p className="text-sm font-medium text-slate-500">No feedback submitted yet</p>
                            <p className="mt-1 text-xs text-slate-400">Click "Add New Feedback" to share your thoughts</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {feedbacks.map((feedback) => (
                                <div
                                    key={feedback.id}
                                    className="rounded-xl border border-slate-200 bg-white p-4"
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <p className="flex-1 whitespace-pre-wrap text-sm text-slate-700">
                                            {feedback.message}
                                        </p>
                                    </div>
                                    {feedback.admin_reply && (
                                        <div className="mt-3 rounded-lg border border-blue-200 bg-blue-50/50 p-3">
                                            <div className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-blue-700">
                                                <Reply className="h-3 w-3" />
                                                Admin Response
                                                <span className="text-[10px] font-normal text-blue-500">{feedback.replied_at}</span>
                                            </div>
                                            <p className="whitespace-pre-wrap text-sm text-blue-900">{feedback.admin_reply}</p>
                                        </div>
                                    )}
                                    <p className="mt-2 text-xs text-slate-400">{feedback.created_at}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <p className="mt-6 text-center text-sm text-slate-500">
                    Thank you for helping us improve our products and services.
                </p>
            </div>
        </div>
    );
}
