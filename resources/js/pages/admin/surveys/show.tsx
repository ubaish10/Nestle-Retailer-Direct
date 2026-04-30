import { Head, Link, usePage, router } from '@inertiajs/react';
import {
    ClipboardList,
    User,
    Calendar,
    MessageSquare,
    Pencil,
    Trash2,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';
import { useToast } from '@/hooks/use-toast';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';

interface SurveyAnswer {
    question: string;
    answer_text: string;
}

interface SurveyResponse {
    id: number;
    retailer: {
        id: number;
        name: string;
        email: string;
    };
    submitted_at: string | null;
    additional_comments: string | null;
    answers: SurveyAnswer[];
}

interface Survey {
    id: number;
    title: string;
    description: string | null;
    status: string;
    is_active: boolean;
    start_date: string | null;
    expiry_date: string | null;
    distributor: {
        id: number;
        name: string;
    } | null;
    questions: Array<{
        id: number;
        question_text: string;
        question_type: string;
        order: number;
        is_required: boolean;
    }>;
    created_at: string;
}

interface Props {
    survey: Survey;
    responses: SurveyResponse[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
    },
    {
        title: 'Surveys',
        href: '/surveys',
    },
];

export default function AdminSurveysShow({ survey, responses }: Props) {
    const [deleting, setDeleting] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const page = usePage();
    const flash = page.props?.flash;
    const { toast } = useToast();

    // Show success/error messages
    useEffect(() => {
        if (flash?.success) {
            toast({
                title: 'Success',
                description: flash.success,
            });
        }
        if (flash?.error) {
            toast({
                title: 'Error',
                description: flash.error,
                variant: 'destructive',
            });
        }
    }, [flash, toast]);

    const handleDeleteClick = () => {
        setDeleteDialogOpen(true);
    };

    const handleConfirmDelete = () => {
        setDeleting(true);

        try {
            router.delete(`/surveys/${survey.id}`, {
                preserveScroll: true,
                onSuccess: () => {
                    toast({
                        title: 'Survey deleted',
                        description:
                            'The survey and all responses have been deleted.',
                    });
                },
                onError: () => {
                    toast({
                        title: 'Error',
                        description: 'Failed to delete survey.',
                        variant: 'destructive',
                    });
                    setDeleting(false);
                },
            });
        } catch (error) {
            console.error('Error:', error);
            toast({
                title: 'Error',
                description: 'An unexpected error occurred.',
                variant: 'destructive',
            });
            setDeleting(false);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={survey.title} />
            <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                <Card className="mx-auto w-full max-w-5xl">
                    <CardHeader>
                        <div className="flex items-start justify-between">
                            <div>
                                <div className="mb-1 flex items-center gap-2">
                                    <Link
                                        href="/surveys"
                                        className="text-sm text-muted-foreground hover:underline"
                                    >
                                        Surveys
                                    </Link>
                                    <span className="text-sm text-muted-foreground">
                                        /
                                    </span>
                                    <span className="text-sm text-muted-foreground">
                                        Details
                                    </span>
                                </div>
                                <CardTitle className="text-2xl">
                                    {survey.title}
                                </CardTitle>
                                {survey.description && (
                                    <p className="mt-2 text-sm text-muted-foreground">
                                        {survey.description}
                                    </p>
                                )}
                                <div className="mt-3 flex items-center gap-4 text-sm text-muted-foreground">
                                    <span>Created: {survey.created_at}</span>
                                    {survey.start_date && (
                                        <span>
                                            • Starts: {survey.start_date}
                                        </span>
                                    )}
                                    {survey.expiry_date && (
                                        <span>
                                            • Expires: {survey.expiry_date}
                                        </span>
                                    )}
                                    <span>
                                        • {responses.length} response(s)
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button asChild variant="outline">
                                    <Link href={`/surveys/${survey.id}/edit`}>
                                        <Pencil className="mr-2 h-4 w-4" />
                                        Edit
                                    </Link>
                                </Button>
                                <Button
                                    variant="destructive"
                                    onClick={handleDeleteClick}
                                >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete
                                </Button>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Questions */}
                        <div>
                            <h3 className="mb-4 text-lg font-semibold text-slate-900">
                                Questions
                            </h3>
                            <div className="space-y-3">
                                {survey.questions
                                    .sort((a, b) => a.order - b.order)
                                    .map((question, index) => (
                                        <div
                                            key={question.id}
                                            className="flex items-start gap-3 rounded-xl bg-slate-50 p-3"
                                        >
                                            <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#00447C]/10 text-xs font-medium text-[#00447C]">
                                                {index + 1}
                                            </span>
                                            <div>
                                                <p className="text-sm text-slate-900">
                                                    {question.question_text}
                                                </p>
                                                <p className="mt-0.5 text-xs text-slate-500">
                                                    Type:{' '}
                                                    {question.question_type}{' '}
                                                    {question.is_required &&
                                                        '(Required)'}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        </div>

                        {/* Responses */}
                        <div>
                            <h3 className="mb-4 text-lg font-semibold text-slate-900">
                                Responses ({responses.length})
                            </h3>

                            {responses.length === 0 ? (
                                <div className="rounded-xl bg-slate-50 py-12 text-center">
                                    <ClipboardList className="mx-auto mb-4 h-12 w-12 text-slate-300" />
                                    <p className="text-sm text-slate-500">
                                        No responses yet.
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {responses.map((response) => (
                                        <div
                                            key={response.id}
                                            className="rounded-xl border border-slate-200 bg-white p-4"
                                        >
                                            <div className="mb-4 flex items-center gap-4 border-b border-slate-100 pb-4">
                                                <div className="flex items-center gap-2">
                                                    <User className="h-4 w-4 text-slate-500" />
                                                    <span className="font-medium text-slate-900">
                                                        {response.retailer.name}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2 text-xs text-slate-500">
                                                    <Calendar className="h-4 w-4" />
                                                    {response.submitted_at}
                                                </div>
                                            </div>

                                            <div className="space-y-3">
                                                {response.answers.map(
                                                    (answer, idx) => (
                                                        <div
                                                            key={idx}
                                                            className="flex gap-3"
                                                        >
                                                            <span className="w-1/3 text-sm text-slate-500">
                                                                {
                                                                    answer.question
                                                                }
                                                            </span>
                                                            <span className="flex-1 text-sm text-slate-900">
                                                                {
                                                                    answer.answer_text
                                                                }
                                                            </span>
                                                        </div>
                                                    ),
                                                )}
                                                {response.additional_comments && (
                                                    <div className="mt-4 border-t border-slate-100 pt-4">
                                                        <div className="mb-2 flex items-center gap-2">
                                                            <MessageSquare className="h-4 w-4 text-slate-500" />
                                                            <span className="text-sm font-medium text-slate-900">
                                                                Additional
                                                                Comments
                                                            </span>
                                                        </div>
                                                        <p className="rounded-lg bg-slate-50 p-3 text-sm text-slate-600">
                                                            {
                                                                response.additional_comments
                                                            }
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Survey</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete the survey "
                            {survey.title}"? This action cannot be undone and
                            all associated responses will be permanently
                            removed.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setDeleteDialogOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleConfirmDelete}
                            disabled={deleting}
                        >
                            {deleting ? 'Deleting...' : 'Delete'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
