"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
    X,
    Sparkles,
    Building2,
    ShieldCheck,
    LayoutDashboard,
    Users,
    Mail,
    User
} from "lucide-react"

interface TourStep {
    targetId?: string
    title: string
    description: string
    position?: "right" | "bottom" | "center"
    xOffset?: number
    yOffset?: number
    icon?: React.ElementType
}

const steps: TourStep[] = [
    {
        title: "Welcome to Workline! 👋",
        description: "Let's take a quick tour to help you get the most out of your dashboard.",
        position: "center",
        icon: Sparkles
    },
    {
        targetId: "org-switcher",
        title: "Workspace Switcher",
        description: "Easily switch between your different organizations or create new ones right here.",
        position: "right",
        yOffset: 60,
        icon: Building2
    },
    {
        targetId: "role-badge",
        title: "Your Role",
        description: "See your current role in this organization (Owner, Admin, or Member).",
        position: "bottom",
        xOffset: -150,
        yOffset: 10,
        icon: ShieldCheck
    },
    {
        targetId: "nav-outlines",
        title: "Manage Outlines",
        description: "Create, edit, and track your project outlines. This is your main workspace.",
        position: "right",
        icon: LayoutDashboard
    },
    {
        targetId: "nav-members",
        title: "Team Members",
        description: "View your team, manage roles, and collaborate effectively if you are an admin or owner.",
        position: "right",
        icon: Users
    },
    {
        targetId: "nav-invitations",
        title: "Invitations",
        description: "Track sent invites and manage incoming requests to join other workspaces.",
        position: "right",
        icon: Mail
    },
    {
        targetId: "nav-account",
        title: "Your Account",
        description: "Update your profile, change your password, and manage personal settings.",
        position: "right",
        icon: User
    }
]

export function DashboardTour() {
    const [currentStep, setCurrentStep] = useState(0)
    const [isVisible, setIsVisible] = useState(false)
    const [targetRect, setTargetRect] = useState<DOMRect | null>(null)

    useEffect(() => {
        const hasSeenTour = localStorage.getItem("hasSeenDashboardTour")
        if (!hasSeenTour) {
            // Small delay to ensure UI is ready
            const timer = setTimeout(() => setIsVisible(true), 1000)
            return () => clearTimeout(timer)
        }
    }, [])

    useEffect(() => {
        if (!isVisible) return

        const updatePosition = () => {
            const step = steps[currentStep]
            if (step.position === "center") {
                setTargetRect(null)
                return
            }

            if (step.targetId) {
                const element = document.getElementById(step.targetId)
                if (element) {
                    element.scrollIntoView({ behavior: "smooth", block: "center" })
                    setTargetRect(element.getBoundingClientRect())
                } else {
                    // If element not found, we might want to skip or just show center
                    // For now, let's just not set a rect (show dimmed background)
                    setTargetRect(null)
                }
            }
        }

        updatePosition()
        window.addEventListener("resize", updatePosition)
        return () => window.removeEventListener("resize", updatePosition)
    }, [currentStep, isVisible])

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(prev => prev + 1)
        } else {
            handleFinish()
        }
    }

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1)
        }
    }

    const handleFinish = () => {
        setIsVisible(false)
        localStorage.setItem("hasSeenDashboardTour", "true")
    }

    if (!isVisible) return null

    const step = steps[currentStep]
    const isLastStep = currentStep === steps.length - 1
    const Icon = step.icon

    // Calculate tooltip position
    let tooltipStyle: any = {}
    if (step.position === "center" || !targetRect) {
        tooltipStyle = {
            top: "50%",
            left: "50%",
            x: "-50%",
            y: "-50%"
        }
    } else if (step.position === "right") {
        const topPosition = targetRect.top + (targetRect.height / 2) + (step.yOffset || 0);
        const leftPosition = targetRect.right + 20;

        tooltipStyle = {
            top: Math.max(20, Math.min(topPosition, window.innerHeight - 400)),
            left: Math.min(leftPosition, window.innerWidth - 370),
            y: "-50%"
        }
    } else if (step.position === "bottom") {
        const topPosition = targetRect.bottom + 20 + (step.yOffset || 0);
        const leftPosition = targetRect.left + (targetRect.width / 2) + (step.xOffset || 0);

        tooltipStyle = {
            top: Math.max(20, Math.min(topPosition, window.innerHeight - 300)),
            left: Math.max(20, Math.min(leftPosition, window.innerWidth - 370)),
            x: "-50%"
        }
    }

    return (
        <AnimatePresence>
            {isVisible && (
                <>
                    {/* Spotlight Overlay */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[99] overflow-hidden pointer-events-none"
                    >
                        {/* If we have a target, draw the spotlight using box-shadow */}
                        {targetRect && (
                            <motion.div
                                className="absolute rounded-lg"
                                initial={false}
                                animate={{
                                    top: targetRect.top - 4,
                                    left: targetRect.left - 4,
                                    width: targetRect.width + 8,
                                    height: targetRect.height + 8,
                                    boxShadow: "0 0 0 9999px rgba(0, 0, 0, 0.75)"
                                }}
                                transition={{ type: "spring", stiffness: 100, damping: 20 }}
                            />
                        )}
                        {/* If no target (center), just dim background */}
                        {!targetRect && (
                            <div className="absolute inset-0 bg-black/75" />
                        )}
                    </motion.div>

                    {/* Tooltip Card */}
                    <motion.div
                        className="fixed z-[100] w-[350px] max-w-[90vw]"
                        style={tooltipStyle}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.3 }}
                    >
                        <Card className="border-primary/20 shadow-2xl">
                            <CardHeader className="pb-2">
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-2">
                                        {Icon && <Icon className="h-5 w-5 text-primary" />}
                                        <CardTitle className="text-lg">{step.title}</CardTitle>
                                    </div>
                                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={handleFinish}>
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="pb-4">
                                <p className="text-sm text-muted-foreground">
                                    {step.description}
                                </p>
                            </CardContent>
                            <CardFooter className="flex justify-between pt-0">
                                <div className="flex gap-1">
                                    {steps.map((_, idx) => (
                                        <div
                                            key={idx}
                                            className={`h-1.5 w-1.5 rounded-full transition-colors ${idx === currentStep ? "bg-primary" : "bg-muted"
                                                }`}
                                        />
                                    ))}
                                </div>
                                <div className="flex gap-2">
                                    {currentStep > 0 && (
                                        <Button variant="outline" size="sm" onClick={handleBack}>
                                            Back
                                        </Button>
                                    )}
                                    <Button size="sm" onClick={handleNext}>
                                        {isLastStep ? "Finish" : "Next"}
                                    </Button>
                                </div>
                            </CardFooter>
                        </Card>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}
