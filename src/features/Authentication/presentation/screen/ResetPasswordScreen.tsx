'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { GridBackground } from '../components/GridBackground'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'
import { authClient } from '@/lib/auth-client'
import { useToast } from '@/features/Core/application/hooks/useToast'
import { ToastContainer } from '@/features/Core/shared/components/ToastContainer'
import { Suspense } from 'react'

function ResetPasswordContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const token = searchParams.get('token')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const { toasts, success, error, removeToast } = useToast()

    useEffect(() => {
        if (!token) {
            error('Invalid or missing reset token')
        }
    }, [token, error])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!token) {
            error('Invalid reset token')
            return
        }

        if (password !== confirmPassword) {
            error('Passwords do not match')
            return
        }

        if (password.length < 8) {
            error('Password must be at least 8 characters')
            return
        }

        setIsLoading(true)

        try {
            await authClient.resetPassword({
                newPassword: password,
                token,
            })
            success('Password reset successfully! Redirecting to login...')
            setTimeout(() => {
                router.push('/auth')
            }, 2000)
        } catch (err: any) {
            error(err.message || 'Failed to reset password. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    if (!token) {
        return (
            <Card>
                <CardHeader className="text-center">
                    <CardTitle>Invalid Reset Link</CardTitle>
                    <CardDescription>
                        The password reset link is invalid or has expired
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Link href="/forgot-password">
                        <Button variant="outline" className="w-full">
                            Request New Link
                        </Button>
                    </Link>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader className="text-center">
                <CardTitle>Reset Password</CardTitle>
                <CardDescription>
                    Enter your new password below
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="password">New Password</Label>
                        <Input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            disabled={isLoading}
                            minLength={8}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm Password</Label>
                        <Input
                            id="confirmPassword"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            disabled={isLoading}
                            minLength={8}
                        />
                    </div>
                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Resetting...
                            </>
                        ) : (
                            'Reset Password'
                        )}
                    </Button>
                    <Link href="/auth">
                        <Button variant="ghost" className="w-full" type="button">
                            Back to Login
                        </Button>
                    </Link>
                </form>
            </CardContent>
        </Card>
    )
}

const ResetPasswordScreen = () => {
    const { toasts, removeToast } = useToast()

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

                    <Suspense fallback={<div>Loading...</div>}>
                        <ResetPasswordContent />
                    </Suspense>
                </div>
                <ToastContainer toasts={toasts} onClose={removeToast} />
            </div>
        </GridBackground>
    )
}

export default ResetPasswordScreen
