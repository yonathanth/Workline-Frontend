'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth-client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AcceptInvitationPage() {
    const params = useParams();
    const router = useRouter();
    const invitationId = params.id as string;
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [errorMessage, setErrorMessage] = useState<string>('');

    useEffect(() => {
        async function handleInvitation() {
            try {
                // First, check if user is authenticated
                const { data: sessionData } = await authClient.getSession();

                if (!sessionData?.user) {
                    // User is not authenticated - redirect to auth page with invitation ID
                    console.log('User not authenticated, redirecting to signup with invitation');
                    router.push(`/auth?invitationId=${invitationId}`);
                    return;
                }

                // User is authenticated - accept the invitation
                console.log('User authenticated, accepting invitation');
                const { error } = await authClient.organization.acceptInvitation({
                    invitationId: invitationId
                });

                if (error) {
                    setStatus('error');
                    setErrorMessage(error.message || 'Failed to accept invitation');
                    return;
                }

                setStatus('success');

                // Redirect to dashboard after 2 seconds
                setTimeout(() => {
                    router.push('/dashboard');
                }, 2000);
            } catch (error) {
                console.error('Failed to handle invitation:', error);
                setStatus('error');
                setErrorMessage(error instanceof Error ? error.message : 'An unexpected error occurred');
            }
        }

        if (invitationId) {
            handleInvitation();
        }
    }, [invitationId, router]);

    return (
        <div className="flex min-h-screen items-center justify-center p-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-center">
                        {status === 'loading' && 'Accepting Invitation...'}
                        {status === 'success' && 'Invitation Accepted!'}
                        {status === 'error' && 'Failed to Accept Invitation'}
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center gap-4">
                    {status === 'loading' && (
                        <>
                            <Loader2 className="h-12 w-12 animate-spin text-primary" />
                            <p className="text-sm text-muted-foreground text-center">
                                Please wait while we process your invitation...
                            </p>
                        </>
                    )}

                    {status === 'success' && (
                        <>
                            <CheckCircle className="h-12 w-12 text-green-500" />
                            <p className="text-sm text-muted-foreground text-center">
                                You have successfully joined the organization!
                            </p>
                            <p className="text-xs text-muted-foreground text-center">
                                Redirecting to dashboard...
                            </p>
                        </>
                    )}

                    {status === 'error' && (
                        <>
                            <XCircle className="h-12 w-12 text-destructive" />
                            <p className="text-sm text-muted-foreground text-center">
                                {errorMessage}
                            </p>
                            <Button
                                variant="outline"
                                onClick={() => router.push('/dashboard')}
                                className="mt-4"
                            >
                                Go to Dashboard
                            </Button>
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
