'use client'

import React from 'react'
import { Formik, Form, Field as FormikField, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import { authClient } from '@/lib/auth-client'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
    FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { useSearchParams } from "next/navigation"

const loginSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Required'),
    password: Yup.string().required('Required'),
})

interface LoginFormProps {
    onSubmit: (values: { email: string; password: string }) => Promise<void>
    onToggle: () => void
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSubmit, onToggle }) => {
    const [isGoogleLoading, setIsGoogleLoading] = React.useState(false)
    const searchParams = useSearchParams()

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <Card>
                <CardHeader className="text-center">
                    <CardTitle className="text-xl">Welcome back</CardTitle>
                    <CardDescription>
                        Login with your Google account or email
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Formik
                        initialValues={{ email: '', password: '' }}
                        validationSchema={loginSchema}
                        onSubmit={async (values, { setSubmitting }) => {
                            await onSubmit(values)
                            setSubmitting(false)
                        }}
                    >
                        {({ isSubmitting, errors, touched }) => (
                            <Form>
                                <FieldGroup>
                                    <Field>
                                        <Button
                                            variant="outline"
                                            type="button"
                                            className="w-full"
                                            disabled={isSubmitting || isGoogleLoading}
                                            onClick={async () => {
                                                setIsGoogleLoading(true)
                                                try {
                                                    // Store invitation ID before OAuth redirect
                                                    const invitationId = searchParams.get('invitationId')
                                                    if (invitationId) {
                                                        sessionStorage.setItem('pending_invitation_id', invitationId)
                                                    }

                                                    await authClient.signIn.social({
                                                        provider: 'google',
                                                        callbackURL: "https://workline-frontend.vercel.app/dashboard",
                                                    })
                                                } catch (error) {
                                                    setIsGoogleLoading(false)
                                                }
                                            }}
                                        >
                                            {isGoogleLoading ? (
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            ) : (
                                                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                                </svg>
                                            )}
                                            Login with Google
                                        </Button>
                                    </Field>
                                    <FieldSeparator>
                                        Or continue with
                                    </FieldSeparator>
                                    <Field>
                                        <FieldLabel htmlFor="email">Email</FieldLabel>
                                        <FormikField
                                            as={Input}
                                            id="email"
                                            name="email"
                                            type="email"
                                            placeholder="m@example.com"
                                            className={cn(errors.email && touched.email && "border-red-500 focus-visible:ring-red-500")}
                                        />
                                        <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1" />
                                    </Field>
                                    <Field>
                                        <div className="flex items-center">
                                            <FieldLabel htmlFor="password">Password</FieldLabel>
                                            <Link
                                                href="/forgot-password"
                                                className="ml-auto text-sm underline-offset-4 hover:underline"
                                            >
                                                Forgot your password?
                                            </Link>
                                        </div>
                                        <FormikField
                                            as={Input}
                                            id="password"
                                            name="password"
                                            type="password"
                                            className={cn(errors.password && touched.password && "border-red-500 focus-visible:ring-red-500")}
                                        />
                                        <ErrorMessage name="password" component="div" className="text-red-500 text-sm mt-1" />
                                    </Field>
                                    <Field>
                                        <Button type="submit" className="w-full" disabled={isSubmitting}>
                                            {isSubmitting ? (
                                                <>
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                    Logging in...
                                                </>
                                            ) : (
                                                'Login'
                                            )}
                                        </Button>
                                        <FieldDescription className="text-center">
                                            Don&apos;t have an account?{" "}
                                            <button
                                                type="button"
                                                onClick={onToggle}
                                                className="text-primary underline underline-offset-4 hover:opacity-80"
                                            >
                                                Sign up
                                            </button>
                                        </FieldDescription>
                                    </Field>
                                </FieldGroup>
                            </Form>
                        )}
                    </Formik>
                </CardContent>
            </Card>
            <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary mt-6">
                By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
                and <a href="#">Privacy Policy</a>.
            </div>
        </motion.div>
    )
}
