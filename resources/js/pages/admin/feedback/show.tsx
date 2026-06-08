import { Head, router, usePage } from '@inertiajs/react';
import { MessageSquare, ArrowLeft, User, Mail, Reply } from 'lucide-react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { admin } from '@/routes';
import type { BreadcrumbItem } from '@/types';
import { useToast } from '@/hooks/use-toast';

interface FeedbackItem {
    id: number;
    message: string;
    admin_reply: string | null;
    replied_at: string | null;
    retailer_name: string;
    retailer_email: string;
    created_at: string;
}

interface Props {
    feedback: FeedbackItem;
}

export default function AdminFeedbackShow({ feedback }: Props) {
    const { toast } = useToast();
    const page = usePage();
    const [reply, setReply] = useState(feedback.admin_reply || '');
    const [submitting, setSubmitting] = useState(false);

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Feedback', href: '/admin/feedback' },
        { title: `Feedback #${feedback.id}`, href: `/admin/feedback/${feedback.id}` },
    ];

    const handleReply = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!reply.trim()) return;

        setSubmitting(true);
        try {
            const csrfToken = (page.props.csrf_token as string) ||
                ((document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '');

            const response = await fetch(`/admin/feedback/${feedback.id}/reply`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                    'X-Requested-With': 'XMLHttpRequest',
                },
                body: JSON.stringify({ admin_reply: reply }),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                toast({ title: 'Success!', description: data.message || 'Reply sent.' });
                router.reload({ only: ['feedback'] });
            } else {
                toast({
                    title: 'Error',
                    description: data.message || 'Something went wrong.',
                    variant: 'destructive',
                });
            }
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to send reply.',
                variant: 'destructive',
            });
        } finally {
            setSubmitting(false);
        }
    };

    const hasReply = !!feedback.admin_reply;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Feedback #${feedback.id}`} />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center gap-4">
                    <a
                        href="/admin/feedback"
                        className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back
                    </a>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <MessageSquare className="h-5 w-5" />
                            Feedback from {feedback.retailer_name}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                                <User className="h-3.5 w-3.5" />
                                {feedback.retailer_name}
                            </span>
                            <span className="flex items-center gap-1">
                                <Mail className="h-3.5 w-3.5" />
                                {feedback.retailer_email}
                            </span>
                            <span>{feedback.created_at}</span>
                        </div>

                        <div className="rounded-lg bg-muted/50 p-4">
                            <p className="whitespace-pre-wrap text-sm">{feedback.message}</p>
                        </div>

                        {hasReply && (
                            <div className="rounded-lg border border-blue-200 bg-blue-50/50 p-4">
                                <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-blue-700">
                                    <Reply className="h-4 w-4" />
                                    Your Reply
                                    <span className="text-xs font-normal text-blue-500">{feedback.replied_at}</span>
                                </div>
                                <p className="whitespace-pre-wrap text-sm text-blue-900">{feedback.admin_reply}</p>
                            </div>
                        )}

                        <form onSubmit={handleReply} className="space-y-3">
                            <label className="block text-sm font-medium">
                                {hasReply ? 'Update Reply' : 'Write a Reply'}
                            </label>
                            <textarea
                                value={reply}
                                onChange={(e) => setReply(e.target.value)}
                                placeholder="Type your reply to this feedback..."
                                rows={4}
                                className="w-full resize-none rounded-xl border p-3 text-sm focus:border-[#00447C] focus:ring-2 focus:ring-[#00447C]"
                            />
                            <Button
                                type="submit"
                                disabled={submitting || !reply.trim()}
                                className="bg-[#00447C] hover:bg-[#00447C]/90"
                            >
                                {submitting ? 'Sending...' : hasReply ? 'Update Reply' : 'Send Reply'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
