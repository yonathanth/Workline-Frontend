'use client'

import React, { useState } from 'react'
import { GridBackground } from '../components/GridBackground'
import Image from 'next/image'
import { Mail, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { authClient } from '@/lib/auth-client'
import { useToast } from '@/features/Core/application/hooks/useToast'
import { ToastContainer } from '@/features/Core/shared/components/ToastContainer'

function ResendButton({ email }: { email: string }) {
    const [countdown, setCountdown] = React.useState(120) // Start with 2 minutes
    const [isResending, setIsResending] = React.useState(false)
    const { success, error, toasts, removeToast } = useToast()

    React.useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
            return () => clearTimeout(timer)
        }
    }, [countdown])

    const handleResend = async () => {
        setIsResending(true)
        try {
            await authClient.sendVerificationEmail({
                email,
                callbackURL: `${window.location.origin}/dashboard`
            })
            setCountdown(120) // 2 minutes
            success('Verification email sent! Check your inbox.')
        } catch (err: any) {
            error(err.message || 'Failed to resend verification email.')
        } finally {
            setIsResending(false)
        }
    }

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins}:${secs.toString().padStart(2, '0')}`
    }

    return (
        <>
            <Button
                variant="ghost"
                className="w-full"
                onClick={handleResend}
                disabled={countdown > 0 || isResending}
            >
                {isResending ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Resending...
                    </>
                ) : countdown > 0 ? (
                    `Resend in ${formatTime(countdown)}`
                ) : (
                    'Resend Verification Email'
                )}
            </Button>
            <ToastContainer toasts={toasts} onClose={removeToast} />
        </>
    )
}

const VerifyEmailScreen = () => {
    const [email] = useState(() => {
        if (typeof window !== 'undefined') {
            return sessionStorage.getItem('signup_email') || ''
        }
        return ''
    })

    const [pendingInvitation] = useState(() => {
        if (typeof window !== 'undefined') {
            return sessionStorage.getItem('pending_invitation_id') || null
        }
        return null
    })

    return (
        <GridBackground>
            <div className="absolute inset-0 z-0 bg-white/50 dark:bg-transparent" />
            <div className="relative z-10 flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
                <div className="flex w-full max-w-sm flex-col items-center gap-6 text-center">
                    <a href="#" className="flex items-center gap-2 self-center font-medium">
                        <div className="flex items-center gap-3">
                            <div className="bg-black/10 dark:bg-white/95 rounded-xl p-2 shadow-sm">
                                <Image
                                    src="https://res.cloudinary.com/dr2h8zmll/image/upload/v1764316308/logo-workline_xievif.svg"
                                    alt="Workline Logo"
                                    width={32}
                                    height={32}
                                    className="h-8 w-8"
                                />
                            </div>
                            <span className="text-xl font-bold text-foreground">Workline</span>
                        </div>
                    </a>

                    <div className="flex flex-col items-center gap-4 rounded-xl border bg-card p-8 shadow-sm w-full">
                        <div className="rounded-full bg-primary/10 p-4">
                            <Mail className="h-8 w-8 text-primary" />
                        </div>
                        <div className="space-y-2">
                            <h1 className="text-2xl font-bold">Check your email</h1>
                            <p className="text-muted-foreground text-sm">
                                We've sent a verification link to your email address. Please click the link to verify your account.
                            </p>
                            {pendingInvitation && (
                                <div className="mt-4 p-3 rounded-lg bg-primary/10 border border-primary/20">
                                    <p className="text-sm text-primary font-medium">
                                        🎫 You have a pending organization invitation!
                                    </p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        After verifying your email, you can accept the invitation.
                                    </p>
                                </div>
                            )}
                        </div>
                        <div className="w-full pt-4 space-y-2">
                            {email && <ResendButton email={email} />}
                            {pendingInvitation && (
                                <Link href={`/accept-invitation/${pendingInvitation}`}>
                                    <Button variant="default" className="w-full">
                                        Accept Invitation
                                    </Button>
                                </Link>
                            )}
                            <Link href="/auth">
                                <Button variant="outline" className="w-full">
                                    Back to Login
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </GridBackground>
    )
}

export default VerifyEmailScreen
