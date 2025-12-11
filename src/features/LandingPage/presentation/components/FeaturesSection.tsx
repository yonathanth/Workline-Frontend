'use client'

import React, { useId, useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

const FeaturesSection = () => {
    const containerRef = useRef<HTMLDivElement>(null)

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    })

    // Transform values for dramatic 3D entrance
    const rotateX = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [15, 0, 0, -5])
    const scale = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.85, 1, 1, 0.95])
    const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0.7])
    const y = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [120, 0, 0, -40])

    return (
        <section
            ref={containerRef}
            className="relative min-h-screen flex items-center justify-center py-20 md:py-32 px-4 md:px-6 lg:px-10 overflow-hidden"
        >
            <motion.div
                style={{
                    rotateX,
                    scale,
                    opacity,
                    y,
                    transformPerspective: 1200,
                }}
                className="w-full"
            >
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                    className="max-w-7xl mx-auto mb-20 text-center"
                >
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                        Everything you need to manage content
                    </h2>
                    <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto px-4">
                        Powerful features designed for teams who create content collaboratively. Manage outlines, track progress, and ensure quality at scale.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 max-w-7xl mx-auto">
                    {grid.map((feature, index) => (
                        <motion.div
                            key={feature.title}
                            initial={{ opacity: 0, y: 30, rotateY: -10 }}
                            whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
                            viewport={{ once: true }}
                            transition={{
                                duration: 0.6,
                                delay: index * 0.08,
                                ease: [0.25, 0.4, 0.25, 1]
                            }}
                            whileHover={{
                                scale: 1.05,
                                rotateY: 5,
                                z: 50,
                                transition: { duration: 0.3, ease: "easeOut" }
                            }}
                            style={{ transformStyle: "preserve-3d" }}
                            className="glassmorphic relative p-6 rounded-3xl overflow-hidden min-h-[280px] flex flex-col justify-between group hover:shadow-2xl transition-all duration-300"
                        >
                            <div className="absolute inset-0 opacity-30 group-hover:opacity-50 transition-opacity duration-500">
                                <Grid size={20} />
                            </div>
                            <div className="relative z-20 mt-auto">
                                <p className="text-lg font-semibold text-foreground mb-3 group-hover:text-primary transition-colors duration-300">
                                    {feature.title}
                                </p>
                                <p className="text-muted-foreground text-sm leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </section>
    )
}

const grid = [
    {
        title: "Outline Management",
        description:
            "Create, edit, and organize content outlines with an intuitive interface. Structure your content workflow from concept to completion.",
    },
    {
        title: "Real-time Collaboration",
        description:
            "Work together in real-time with your team. See changes as they happen and collaborate seamlessly on outlines and content.",
    },
    {
        title: "Status Tracking",
        description:
            "Track outline progress with visual status indicators. Move work through Pending, In Progress, and Completed stages effortlessly.",
    },
    {
        title: "Reviewer Assignment",
        description:
            "Assign team members as reviewers for quality control. Ensure every outline gets the attention and expertise it needs.",
    },
    {
        title: "Organization Management",
        description:
            "Create and manage multiple organizations. Switch contexts easily and maintain separate workspaces for different teams or projects.",
    },
    {
        title: "Team Collaboration",
        description:
            "Invite team members, assign roles, and collaborate effectively. Role-based access ensures security while enabling teamwork.",
    },
    {
        title: "Secure Authentication",
        description:
            "Built on Better Auth for enterprise-grade security. Protect your content and team data with modern authentication standards.",
    },
    {
        title: "Intuitive Dashboard",
        description:
            "Navigate your work with a clean, organized dashboard. Access outlines, manage teams, and track progress from one central location.",
    },
];

export const Grid = ({
    pattern,
    size,
}: {
    pattern?: number[][];
    size?: number;
}) => {
    const p = pattern ?? [
        [Math.floor(Math.random() * 4) + 7, Math.floor(Math.random() * 6) + 1],
        [Math.floor(Math.random() * 4) + 7, Math.floor(Math.random() * 6) + 1],
        [Math.floor(Math.random() * 4) + 7, Math.floor(Math.random() * 6) + 1],
        [Math.floor(Math.random() * 4) + 7, Math.floor(Math.random() * 6) + 1],
        [Math.floor(Math.random() * 4) + 7, Math.floor(Math.random() * 6) + 1],
    ];
    return (
        <div className="pointer-events-none absolute inset-0 h-full w-full">
            <GridPattern
                width={size ?? 20}
                height={size ?? 20}
                x="-12"
                y="4"
                squares={p}
                className="absolute inset-0 h-full w-full mix-blend-overlay stroke-black/5 fill-black/5 dark:fill-white/5 dark:stroke-white/5"
            />
        </div>
    );
};

export function GridPattern({ width, height, x, y, squares, ...props }: any) {
    const patternId = useId();

    return (
        <svg aria-hidden="true" {...props}>
            <defs>
                <pattern
                    id={patternId}
                    width={width}
                    height={height}
                    patternUnits="userSpaceOnUse"
                    x={x}
                    y={y}
                >
                    <path d={`M.5 ${height}V.5H${width}`} fill="none" />
                </pattern>
            </defs>
            <rect
                width="100%"
                height="100%"
                strokeWidth={0}
                fill={`url(#${patternId})`}
            />
            {squares && (
                <svg x={x} y={y} className="overflow-visible">
                    {squares.map(([x, y]: any) => (
                        <rect
                            strokeWidth="0"
                            key={`${x}-${y}`}
                            width={width + 1}
                            height={height + 1}
                            x={x * width}
                            y={y * height}
                        />
                    ))}
                </svg>
            )}
        </svg>
    );
}

export default FeaturesSection
