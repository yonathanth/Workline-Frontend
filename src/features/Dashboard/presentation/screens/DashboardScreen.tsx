'use client'

import { SiteHeader } from "@/components/site-header"
import { useOrganization } from "@/features/Organizations/application/hooks/useOrganization"
import { useOutlines } from "@/features/Dashboard/presentation/components/Outlines/application/hooks/useOutlines"
import { OutlinesTable } from "@/features/Dashboard/presentation/components/Outlines/presentation/components/OutlinesTable"
import { EmptyOrgState } from "@/features/Organizations/presentation/components/EmptyOrgState"
import { authClient } from "@/lib/auth-client"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { ChartAreaInteractive } from "@/features/Dashboard/presentation/components/Outlines/presentation/components/ChartAreaInteractive"
import { EditOutlineSidebar } from "@/features/Dashboard/presentation/components/Outlines/presentation/components/EditOutlineSidebar"
import { Outline } from "@/features/Dashboard/presentation/components/Outlines/domain/entities/Outline"
import { SidebarInset } from "@/components/ui/sidebar"
import { useGlobalLoader } from "@/context/GlobalLoaderContext"
import { DashboardSkeleton } from "@/features/Dashboard/presentation/components/DashboardSkeleton"

export function DashboardScreen() {
    const router = useRouter()
    const { data: session } = authClient.useSession()
    const { activeOrganizationId, isLoading: isOrgLoading } = useOrganization()
    const { outlines, isLoading: isOutlinesLoading, updateOutline, deleteOutline } = useOutlines(activeOrganizationId || undefined)

    const [selectedOutline, setSelectedOutline] = useState<Outline | null>(null)
    const [isEditSidebarOpen, setIsEditSidebarOpen] = useState(false)



    // Redirect to verify-email if user's email is not verified
    // Skip this check for social sign-in users (their emails are auto-verified)
    useEffect(() => {
        if (session?.user && !session.user.emailVerified) {
            // Give social sign-in some time to update emailVerified status
            // If still not verified after 1 second, redirect
            const timer = setTimeout(() => {
                if (session?.user && !session.user.emailVerified) {
                    console.log('⚠️ Email not verified, redirecting to verify-email')
                    router.push('/verify-email')
                }
            }, 1000)

            return () => clearTimeout(timer)
        }
    }, [session, router])

    // Check for pending invitation after OAuth redirect
    useEffect(() => {
        const pendingInvitation = sessionStorage.getItem('pending_invitation_id')
        if (pendingInvitation && session?.user) {
            sessionStorage.removeItem('pending_invitation_id')
            router.push(`/accept-invitation/${pendingInvitation}`)
        }
    }, [session, router])

    const handleRowClick = (outline: Outline) => {
        setSelectedOutline(outline)
        setIsEditSidebarOpen(true)
    }

    const handleUpdateOutline = async (updatedOutline: Outline) => {
        if (activeOrganizationId) {
            await updateOutline(updatedOutline)
        }
    }

    return (
        <SidebarInset>
            {isOrgLoading ? (
                <DashboardSkeleton />
            ) : !activeOrganizationId ? (
                <>
                    <SiteHeader title="Outlines" />
                    <div className="flex flex-1 flex-col gap-4 p-4 md:p-6">
                        <EmptyOrgState />
                    </div>
                </>
            ) : (
                <>
                    <SiteHeader title="Outlines" />
                    <div className="flex flex-1 flex-col gap-4 p-4 md:p-6">
                        <OutlinesTable
                            outlines={outlines}
                            isLoading={isOutlinesLoading}
                            onRowClick={handleRowClick}
                            onDelete={deleteOutline}
                        />
                    </div>
                </>
            )}

<EditOutlineSidebar
                outline={selectedOutline}
                isOpen={isEditSidebarOpen}
                onClose={() => setIsEditSidebarOpen(false)}
                onUpdate={handleUpdateOutline}
            />
        </SidebarInset>
    )
}