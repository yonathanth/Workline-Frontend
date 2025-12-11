"use client"

import { AppSidebar } from "@/components/app-sidebar"
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { useOrganization } from "@/features/Organizations/application/hooks/useOrganization"
import { DashboardTour } from "@/features/Dashboard/presentation/components/DashboardTour"


export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const { isSwitchingOrganization } = useOrganization()

    return (
        <SidebarProvider>

            <AppSidebar />
            <SidebarInset>

                <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                    {children}
                </div>
            </SidebarInset>
            <DashboardTour />
        </SidebarProvider>
    )
}
