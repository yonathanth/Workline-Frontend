import { Skeleton } from "@/components/ui/skeleton"

export function DashboardSkeleton() {
    return (
        <>
            {/* Site Header Skeleton */}
            <header className="flex h-14 shrink-0 items-center gap-2 border-b">
                <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6 py-4">
                    {/* Sidebar Trigger */}
                    <Skeleton className="h-6 w-6" />
                    {/* Separator */}
                    <div className="mx-2 h-4 w-px bg-border" />
                    {/* Title */}
                    <Skeleton className="h-5 w-24" />
                    {/* Role Badge */}
                    <div className="ml-auto">
                        <Skeleton className="h-8 w-24" />
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className="flex flex-1 flex-col gap-4 p-4 md:p-6">
                {/* Table Controls */}
                <div className="flex items-center justify-between px-4 lg:px-6">
                    <div className="flex items-center justify-end gap-2 w-full">
                        <Skeleton className="h-9 w-36" />
                        <Skeleton className="h-9 w-28" />
                    </div>
                </div>

                {/* Table Container */}
                <div className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6">
                    <div className="rounded-lg border">
                        {/* Table Header */}
                        <div className="bg-muted border-b px-4 py-3">
                            <div className="flex items-center gap-4">
                                <Skeleton className="h-4 w-4" /> {/* Checkbox */}
                                <Skeleton className="h-4 w-32" /> {/* Header */}
                                <Skeleton className="h-4 w-24" /> {/* Section Type */}
                                <Skeleton className="h-4 w-20" /> {/* Status */}
                                <Skeleton className="h-4 w-16" /> {/* Target */}
                                <Skeleton className="h-4 w-16" /> {/* Limit */}
                                <Skeleton className="h-4 w-24" /> {/* Reviewer */}
                                <Skeleton className="h-4 w-8 ml-auto" /> {/* Actions */}
                            </div>
                        </div>

                        {/* Table Rows */}
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="border-b last:border-0 px-4 py-4">
                                <div className="flex items-center gap-4">
                                    <Skeleton className="h-4 w-4" /> {/* Checkbox */}
                                    <Skeleton className="h-4 w-40" /> {/* Header */}
                                    <Skeleton className="h-6 w-28" /> {/* Badge */}
                                    <Skeleton className="h-6 w-24" /> {/* Status Badge */}
                                    <Skeleton className="h-8 w-16" /> {/* Target Input */}
                                    <Skeleton className="h-8 w-16" /> {/* Limit Input */}
                                    <Skeleton className="h-4 w-24" /> {/* Reviewer */}
                                    <Skeleton className="h-8 w-8 ml-auto" /> {/* Actions Menu */}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    <div className="flex items-center justify-between px-4">
                        <Skeleton className="h-5 w-32" />
                        <div className="flex items-center gap-8">
                            <div className="flex items-center gap-2">
                                <Skeleton className="h-5 w-24" />
                                <Skeleton className="h-8 w-20" />
                            </div>
                            <div className="flex items-center gap-2">
                                <Skeleton className="h-5 w-16" />
                            </div>
                            <div className="flex items-center gap-2">
                                <Skeleton className="h-8 w-8" />
                                <Skeleton className="h-8 w-8" />
                                <Skeleton className="h-8 w-8" />
                                <Skeleton className="h-8 w-8" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
