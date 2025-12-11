
"use client"

import { useState, useEffect, useMemo } from "react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { Loader2, TrendingUp } from "lucide-react"
import { Outline } from "../../domain/entities/Outline"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import { useOrganization } from "@/features/Organizations/application/hooks/useOrganization"
import { useOrganizationMembers } from "@/features/Organizations/presentation/hooks/useOrganizationMembers"

const chartConfig = {
    completed: {
        label: "Completed",
        color: "hsl(var(--chart-2))", // Green-ish usually chart-2 based on previous edits or standard
    },
    in_progress: {
        label: "In Progress",
        color: "hsl(var(--chart-4))", // Yellow-ish usually
    },
} satisfies ChartConfig

interface EditOutlineSidebarProps {
    outline: Outline | null
    isOpen: boolean
    onClose: () => void
    onUpdate: (updatedOutline: Outline) => Promise<any>
}

export function EditOutlineSidebar({ outline, isOpen, onClose, onUpdate }: EditOutlineSidebarProps) {
    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState({
        header: "",
        type: "",
        status: "",
        target: "",
        limit: "",
        reviewer: ""
    })

    const { activeOrganizationId } = useOrganization()
    const { data: members } = useOrganizationMembers(activeOrganizationId)

    // Filter members for reviewers (Owner or Admin)
    const reviewers = members?.filter(member =>
        member.role === 'owner' || member.role === 'admin'
    ) || []

    useEffect(() => {
        if (outline) {
            setFormData({
                header: outline.header || "",
                type: "article", // Mock default
                status: outline.status?.toLowerCase() || "pending",
                target: outline.target?.toString() || "18", // Mock default
                limit: outline.limit?.toString() || "5", // Mock default
                reviewer: outline.reviewerId || ""
            })
        }
    }, [outline])

    // Generate chart data based on status (showing percentages 0-100)
    const chartData = useMemo(() => {
        const status = formData.status
        const months = ["January", "February", "March", "April", "May", "June"]

        return months.map((month, index) => {
            let completedPercentage = 0
            let inProgressPercentage = 0

            if (status === 'completed') {
                // Completed percentage grows from 60% to 100%
                completedPercentage = Math.floor(60 + (index / 5) * 40)
                inProgressPercentage = 0
            } else if (status === 'in_progress') {
                // In Progress percentage grows from 30% to 80%
                inProgressPercentage = Math.floor(30 + (index / 5) * 50)
                completedPercentage = 0
            } else {
                // Pending - minimal activity (10%)
                inProgressPercentage = 10
                completedPercentage = 0
            }

            return {
                month,
                completed: completedPercentage,
                in_progress: inProgressPercentage
            }
        })
    }, [formData.status])

    // Calculate trending percentage
    const trendingPercentage = useMemo(() => {
        if (chartData.length < 2) return 0
        const lastMonth = chartData[chartData.length - 1].completed + chartData[chartData.length - 1].in_progress
        const prevMonth = chartData[chartData.length - 2].completed + chartData[chartData.length - 2].in_progress
        if (prevMonth === 0) return 100
        return ((lastMonth - prevMonth) / prevMonth * 100).toFixed(1)
    }, [chartData])

    const handleSubmit = async () => {
        if (!outline) return

        setIsLoading(true)
        try {
            // Simulate API call with AI response
            await new Promise(resolve => setTimeout(resolve, 2000))

            // Call the update function passed from parent
            await onUpdate({
                ...outline,
                header: formData.header,
                status: formData.status.toUpperCase() as any,
                target: parseInt(formData.target) || 0,
                limit: parseInt(formData.limit) || 0,
                reviewerId: formData.reviewer
            })

            toast.success("AI Response: Outline updated successfully based on your changes.")
            onClose()
        } catch (error) {
            toast.error("Failed to update outline")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <SheetContent className="w-full sm:w-[540px] overflow-y-auto px-4">
                <SheetHeader className="mb-4">
                    <div className="space-y-1">
                        <h2 className="text-lg font-semibold leading-none tracking-tight">{formData.header || "Cover page"}</h2>
                        <p className="text-sm text-muted-foreground">
                            Showing total visitors for the last 6 months
                        </p>
                    </div>
                </SheetHeader>

                <div className="mb-4">
                    <ChartContainer config={chartConfig} className="h-[200px] w-full">
                        <AreaChart
                            accessibilityLayer
                            data={chartData}
                            margin={{
                                left: 12,
                                right: 12,
                            }}
                        >
                            <CartesianGrid vertical={false} />
                            <XAxis
                                dataKey="month"
                                tickLine={false}
                                axisLine={false}
                                tickMargin={8}
                                tickFormatter={(value) => value.slice(0, 3)}
                                hide
                            />
                            <ChartTooltip
                                cursor={false}
                                content={<ChartTooltipContent indicator="dot" />}
                            />
                            <Area
                                dataKey="in_progress"
                                type="natural"
                                fill="var(--color-in_progress)"
                                fillOpacity={0.4}
                                stroke="var(--color-in_progress)"
                                stackId="a"
                            />
                            <Area
                                dataKey="completed"
                                type="natural"
                                fill="var(--color-completed)"
                                fillOpacity={0.4}
                                stroke="var(--color-completed)"
                                stackId="a"
                            />
                        </AreaChart>
                    </ChartContainer>
                    <div className="mt-2">
                        <div className="flex items-center gap-2 font-medium leading-none">
                            Trending {Number(trendingPercentage) > 0 ? "up" : "down"} by {Math.abs(Number(trendingPercentage))}% this month <TrendingUp className={`h - 4 w - 4 ${Number(trendingPercentage) < 0 ? "rotate-180" : ""} `} />
                        </div>
                        <div className="leading-none text-muted-foreground mt-2 text-sm">
                            Showing total visitors for the last 6 months based on target {formData.target}.
                        </div>
                    </div>
                </div>

                <div className="grid gap-4 py-4 border-t">
                    <div className="grid gap-2">
                        <Label htmlFor="header">Header</Label>
                        <Input
                            id="header"
                            value={formData.header}
                            onChange={(e) => setFormData({ ...formData, header: e.target.value })}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="type">Type</Label>
                            <Select
                                value={formData.type}
                                onValueChange={(value) => setFormData({ ...formData, type: value })}
                            >
                                <SelectTrigger id="type">
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="article">Article</SelectItem>
                                    <SelectItem value="blog">Blog Post</SelectItem>
                                    <SelectItem value="news">News</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="status">Status</Label>
                            <Select
                                value={formData.status}
                                onValueChange={(value) => setFormData({ ...formData, status: value })}
                            >
                                <SelectTrigger id="status">
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="in_progress">In Progress</SelectItem>
                                    <SelectItem value="completed">Completed</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="target">Target</Label>
                            <Input
                                id="target"
                                type="number"
                                value={formData.target}
                                onChange={(e) => setFormData({ ...formData, target: e.target.value })}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="limit">Limit</Label>
                            <Input
                                id="limit"
                                type="number"
                                value={formData.limit}
                                onChange={(e) => setFormData({ ...formData, limit: e.target.value })}
                            />
                        </div>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="reviewer">Reviewer</Label>
                        <Select
                            value={formData.reviewer}
                            onValueChange={(value) => setFormData({ ...formData, reviewer: value })}
                        >
                            <SelectTrigger id="reviewer">
                                <SelectValue placeholder="Select reviewer" />
                            </SelectTrigger>
                            <SelectContent>
                                {reviewers.map((reviewer) => (
                                    <SelectItem key={reviewer.id} value={reviewer.user.id}>
                                        {reviewer.user.name} ({reviewer.user.email})
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <SheetFooter className="mt-4 flex-col sm:flex-row gap-2">
                    <Button variant="outline" onClick={onClose} className="w-full sm:w-auto">
                        Done
                    </Button>
                    <Button onClick={handleSubmit} disabled={isLoading} className="w-full sm:w-auto">
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Submit
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}
