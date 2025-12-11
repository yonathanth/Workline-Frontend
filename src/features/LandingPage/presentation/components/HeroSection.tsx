'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { CheckCircle2, Users, Layout, Table, Shield, UserPlus } from 'lucide-react'
import { motion } from 'framer-motion'

const HeroSection = () => {
    const features = [
        { icon: Shield, text: 'Authentication (Sign-in / Sign-up)' },
        { icon: UserPlus, text: 'Create & Join Organization' },
        { icon: Layout, text: 'Sidebar + Dashboard Layout' },
        { icon: Table, text: 'Outline Table (CRUD via Sheet)' },
        { icon: Users, text: 'Team Management (Invite & Remove)' },
    ]

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.2
            }
        }
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6
            }
        }
    }

    return (
        <motion.div
            className="relative z-10 flex flex-col items-center justify-center text-center px-4 md:px-6 max-w-5xl mx-auto pt-24 md:pt-32"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {/* Icon */}
            <motion.div className="mb-8 relative" variants={itemVariants}>
                <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-primary/20 to-primary/5 backdrop-blur-xl border border-white/30 flex items-center justify-center shadow-2xl">
                    <div className="w-12 h-12 text-foreground">
                        <img
                            src="https://res.cloudinary.com/dr2h8zmll/image/upload/v1764316308/logo-workline_xievif.svg"
                            alt="Workline Logo"
                            className="w-full h-full"
                        />
                    </div>
                </div>
            </motion.div>

            {/* Main Heading */}
            <motion.h1
                className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent leading-tight"
                variants={itemVariants}
            >
                Streamline Your Content<br />Creation Workflow
            </motion.h1>

            {/* Description */}
            <motion.p
                className="text-base md:text-lg lg:text-xl text-muted-foreground max-w-3xl mb-12 leading-relaxed px-4"
                variants={itemVariants}
            >
                Workline helps teams create, organize, and manage content outlines collaboratively.
                Track progress, assign reviewers, and maintain quality with our intuitive outline management platform.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
                className="flex flex-col sm:flex-row gap-4 mb-16"
                variants={itemVariants}
            >
                <Link href="/auth?mode=signup">
                    <Button
                        size="lg"
                        className="bg-foreground hover:bg-foreground/90 text-background rounded-full px-8 py-6 text-base md:text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
                    >
                        Start Free  →
                    </Button>
                </Link>
                <Link href="/auth?mode=signup">
                    <Button
                        size="lg"
                        className="glassmorphic rounded-full px-8 py-6 text-base md:text-lg hover:bg-white/20 transition-all duration-300 hover:scale-105 text-foreground"
                    >
                        <Users className="mr-2 h-5 w-5" />
                        Join Organization
                    </Button>
                </Link>
            </motion.div>
        </motion.div>
    )
}

export default HeroSection
