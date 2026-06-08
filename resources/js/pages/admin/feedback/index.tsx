import { Head, Link } from '@inertiajs/react';
import { MessageSquare, Mail, User, Reply, ChevronRight, Clock } from 'lucide-react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';

interface FeedbackItem {
    id: number;
    message: string;
    has_reply: boolean;
    retailer_name: string;
    retailer_email: string;
    created_at: string;
}

interface Props {
    feedbacks: FeedbackItem[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard() },
    { title: 'Feedback', href: '/admin/feedback' },
];

type Tab = 'pending' | 'answered';

export default function AdminFeedbackIndex({ feedbacks = [] }: Props) {
    const [activeTab, setActiveTab] = useState<Tab>('pending');

    const pending = feedbacks.filter((f) => !f.has_reply);
    const answered = feedbacks.filter((f) => f.has_reply);

    const renderList = (items: FeedbackItem[], emptyMessage: string) => {
        if (items.length === 0) {
            return (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <MessageSquare className="mb-3 h-12 w-12 text-muted-foreground" />
                        <p className="text-sm font-medium text-muted-foreground">{emptyMessage}</p>
                    </CardContent>
                </Card>
            );
        }

        return (
            <div className="space-y-3">
                {items.map((feedback) => (
                    <Link key={feedback.id} href={`/admin/feedback/${feedback.id}`}>
                        <Card className="cursor-pointer transition-colors hover:border-[#00447C]/50 hover:bg-[#00447C]/5">
                            <CardContent className="p-4">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <p className="line-clamp-2 flex-1 whitespace-pre-wrap text-sm">
                                                {feedback.message}
                                            </p>
                                            {feedback.has_reply && (
                                                <Badge className="flex items-center gap-1 bg-blue-100 text-blue-700 hover:bg-blue-100">
                                                    <Reply className="h-3 w-3" />
                                                    Replied
                                                </Badge>
                                            )}
                                        </div>
                                        <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
                                            <span className="flex items-center gap-1">
                                                <User className="h-3 w-3" />
                                                {feedback.retailer_name}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Mail className="h-3 w-3" />
                                                {feedback.retailer_email}
                                            </span>
                                            <span>{feedback.created_at}</span>
                                        </div>
                                    </div>
                                    <ChevronRight className="mt-1 h-4 w-4 flex-shrink-0 text-muted-foreground" />
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Feedback" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold tracking-tight">Feedback</h1>
                </div>

                <div className="flex gap-2 border-b">
                    <button
                        onClick={() => setActiveTab('pending')}
                        className={`flex items-center gap-2 border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
                            activeTab === 'pending'
                                ? 'border-[#00447C] text-[#00447C]'
                                : 'border-transparent text-muted-foreground hover:text-foreground'
                        }`}
                    >
                        <Clock className="h-4 w-4" />
                        Pending ({pending.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('answered')}
                        className={`flex items-center gap-2 border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
                            activeTab === 'answered'
                                ? 'border-[#00447C] text-[#00447C]'
                                : 'border-transparent text-muted-foreground hover:text-foreground'
                        }`}
                    >
                        <Reply className="h-4 w-4" />
                        Answered ({answered.length})
                    </button>
                </div>

                {activeTab === 'pending'
                    ? renderList(pending, 'No pending feedback')
                    : renderList(answered, 'No answered feedback')}
            </div>
        </AppLayout>
    );
}
