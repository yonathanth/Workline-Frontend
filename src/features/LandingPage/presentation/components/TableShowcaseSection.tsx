'use client'

import React, { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Image from 'next/image'

const TableShowcaseSection = () => {
    const containerRef = useRef<HTMLDivElement>(null)

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    })

    // Transform values for 3D perspective effect
    const rotateX = useTransform(scrollYProgress, [0, 0.5, 1], [25, 0, -10])
    const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.95])
    const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0.8])
    const y = useTransform(scrollYProgress, [0, 0.5, 1], [100, 0, -50])

    return (
        <section
            ref={containerRef}
            className="relative min-h-screen flex items-center justify-center py-20 md:py-32 px-4 md:px-6 overflow-hidden"
        >
            <div className="max-w-7xl mx-auto w-full">
                {/* Text Content */}
                <motion.div
                    className="text-center mb-16 px-4"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                        Powerful Outline Management
                    </h2>
                    <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                        Organize your team's work with our intuitive table interface.
                        Create, edit, assign reviewers, track status, and manage outlines with drag-and-drop ease.
                    </p>
                </motion.div>

                {/* 3D Animated Image */}
                <motion.div
                    style={{
                        rotateX,
                        scale,
                        opacity,
                        y,
                        transformPerspective: 1200,
                    }}
                    className="relative w-full max-w-6xl mx-auto"
                >
                    <div className="glassmorphic relative rounded-2xl overflow-hidden p-2">
                        <div className="relative rounded-xl overflow-hidden">
                            <Image
                                src="https://res.cloudinary.com/dr2h8zmll/image/upload/v1764316473/Workline_Screenshot_gqpwbf.png"
                                alt="Workline Table Interface"
                                width={1920}
                                height={1080}
                                className="w-full h-auto"
                                priority
                            />
                            {/* Overlay gradient for depth */}
                            <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent pointer-events-none" />
                        </div>
                    </div>

                    {/* Glow effect */}
                    <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 blur-3xl -z-10 opacity-50" />
                </motion.div>
            </div>
        </section>
    )
}

export default TableShowcaseSection
