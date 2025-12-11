'use client'

import React, { useState } from 'react'
import { GridBackground } from '../components/GridBackground'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, ArrowLeft } from 'lucide-react'
import { authClient } from '@/lib/auth-client'
import { useToast } from '@/features/Core/application/hooks/useToast'
import { ToastContainer } from '@/features/Core/shared/components/ToastContainer'


function ResendButton({ onResend, initialCountdown = false }: { onResend: () => Promise<void> | void, initialCountdown?: boolean }) {
    const [countdown, setCountdown] = React.useState(initialCountdown ? 120 : 0)
    const [isResending, setIsResending] = React.useState(false)

    React.useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
            return () => clearTimeout(timer)
        }
    }, [countdown])

    const handleResend = async () => {
        setIsResending(true)
        try {
            await onResend()
            setCountdown(120) // 2 minutes
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
                'Resend Reset Link'
            )}
        </Button>
    )
}

const ForgotPasswordScreen = () => {
    const [email, setEmail] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [emailSent, setEmailSent] = useState(false)
    const { toasts, success, error, removeToast } = useToast()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            await authClient.requestPasswordReset({
                email,
                redirectTo: `${window.location.origin}/reset-password`,
            })
            setEmailSent(true)
            success('Password reset link sent! Check your email.')
        } catch (err: any) {
            error(err.message || 'Failed to send reset link. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <GridBackground>
            <div className="absolute inset-0 z-0 bg-white/50 dark:bg-transparent" />
            <div className="relative z-10 flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
                <div className="flex w-full max-w-sm flex-col gap-6">
                    <Link href="/auth" className="flex items-center gap-2 self-center font-medium">
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
                    </Link>

                    {emailSent ? (
                        <Card>
                            <CardHeader className="text-center">
                                <CardTitle>Check your email</CardTitle>
                                <CardDescription>
                                    We've sent a password reset link to <strong>{email}</strong>
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ResendButton onResend={() => handleSubmit({ preventDefault: () => { } } as React.FormEvent)} initialCountdown={true} />
                                <Link href="/auth">
                                    <Button variant="outline" className="w-full mt-2">
                                        <ArrowLeft className="mr-2 h-4 w-4" />
                                        Back to Login
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    ) : (
                        <Card>
                            <CardHeader className="text-center">
                                <CardTitle>Forgot password?</CardTitle>
                                <CardDescription>
                                    Enter your email address and we'll send you a reset link
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="m@example.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                            disabled={isLoading}
                                        />
                                    </div>
                                    <Button type="submit" className="w-full" disabled={isLoading}>
                                        {isLoading ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Sending...
                                            </>
                                        ) : (
                                            'Send Reset Link'
                                        )}
                                    </Button>
                                    <Link href="/auth">
                                        <Button variant="ghost" className="w-full" type="button">
                                            <ArrowLeft className="mr-2 h-4 w-4" />
                                            Back to Login
                                        </Button>
                                    </Link>
                                </form>
                            </CardContent>
                        </Card>
                    )}
                </div>
                <ToastContainer toasts={toasts} onClose={removeToast} />
            </div>
        </GridBackground>
    )
}

export default ForgotPasswordScreen
