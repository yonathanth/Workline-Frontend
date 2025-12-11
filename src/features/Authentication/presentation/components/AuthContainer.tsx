'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { LoginForm } from './LoginForm'
import { SignupForm } from './SignupForm'
import Image from 'next/image'

interface AuthContainerProps {
    onLogin: (values: { email: string; password: string }) => Promise<void>
    onSignup: (values: { name: string; email: string; password: string }) => Promise<void>
}

export const AuthContainer: React.FC<AuthContainerProps> = ({ onLogin, onSignup }) => {
    const [isLogin, setIsLogin] = useState(true)

    const handleLogin = async (values: { email: string; password: string }) => {
        await onLogin(values)
    }

    const handleSignup = async (values: { name: string; email: string; password: string }) => {
        await onSignup(values)
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full min-w-[28rem] max-w-xl mx-auto px-6"
        >
            <div className="glassmorphic-auth rounded-4xl py-6 px-16 shadow-2xl relative overflow-hidden">
                {/* Extra blur layer */}
                <div className="absolute inset-0 bg-white/5 dark:bg-black/20 backdrop-blur-xl -z-10 rounded-3xl"></div>

                {/* Logo */}
                <div className="flex justify-center mb-6">
                    <div className="bg-white/90 dark:bg-white/95 rounded-xl p-3 shadow-sm">
                        <Image
                            src="https://res.cloudinary.com/dr2h8zmll/image/upload/v1764316308/logo-workline_xievif.svg"
                            alt="Workline Logo"
                            width={40}
                            height={40}
                            className="h-10 w-10"
                        />
                    </div>
                </div>

                {/* Title */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-foreground mb-2">
                        {isLogin ? 'Welcome Back' : 'Create Account'}
                    </h1>
                    <p className="text-muted-foreground">
                        {isLogin
                            ? 'Log in to continue to Workline'
                            : 'Sign up to get started with Workline'}
                    </p>
                </div>

                {/* Form Toggle Tabs */}
                <div className="mb-8 border-b border-white/20">
                    <div className="flex gap-8 justify-center">
                        <button
                            onClick={() => setIsLogin(true)}
                            className="relative pb-3 font-semibold transition-all duration-300"
                        >
                            <span className={`transition-colors duration-300 ${isLogin ? 'text-foreground' : 'text-muted-foreground'
                                }`}>
                                Log In
                            </span>
                            {isLogin && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-foreground"
                                    transition={{
                                        type: 'spring',
                                        stiffness: 380,
                                        damping: 30,
                                    }}
                                />
                            )}
                        </button>
                        <button
                            onClick={() => setIsLogin(false)}
                            className="relative pb-3 font-semibold transition-all duration-300"
                        >
                            <span className={`transition-colors duration-300 ${!isLogin ? 'text-foreground' : 'text-muted-foreground'
                                }`}>
                                Sign Up
                            </span>
                            {!isLogin && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-foreground"
                                    transition={{
                                        type: 'spring',
                                        stiffness: 380,
                                        damping: 30,
                                    }}
                                />
                            )}
                        </button>
                    </div>
                </div>

                {/* Forms */}
                <AnimatePresence mode="wait">
                    {isLogin ? (
                        <motion.div
                            key="login"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <LoginForm onSubmit={handleLogin} onToggle={() => setIsLogin(false)} />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="signup"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <SignupForm onSubmit={handleSignup} onToggle={() => setIsLogin(true)} />
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Footer */}
                <div className="mt-6 text-center text-sm text-muted-foreground">
                    <p>
                        By continuing, you agree to Workline's{' '}
                        <a href="#" className="text-foreground hover:underline">
                            Terms of Service
                        </a>{' '}
                        and{' '}
                        <a href="#" className="text-foreground hover:underline">
                            Privacy Policy
                        </a>
                    </p>
                </div>
            </div>
        </motion.div>
    )
}
