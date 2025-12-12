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
    const sessionResult = authClient.useSession()
    const session = sessionResult?.data
    const { activeOrganizationId, isLoading: isOrgLoading } = useOrganization()
    const { outlines, isLoading: isOutlinesLoading, updateOutline, deleteOutline } = useOutlines(activeOrganizationId || undefined)

    // Ensure session is refetched when dashboard loads
    useEffect(() => {
        const refetchSession = async () => {
            console.log('🔄 [DashboardScreen] Refetching session on mount...')
            try {
                const { data, error } = await authClient.getSession()
                if (error) {
                    console.error('❌ [DashboardScreen] Session error:', error)
                } else {
                    console.log('✅ [DashboardScreen] Session refetched:', data)
                }
            } catch (error) {
                console.error('❌ [DashboardScreen] Error refetching session:', error)
            }
        }
        
        // Refetch session on mount to ensure it's up to date
        refetchSession()
    }, []) // Only run on mount

    const [selectedOutline, setSelectedOutline] = useState<Outline | null>(null)
    const [isEditSidebarOpen, setIsEditSidebarOpen] = useState(false)



    // Redirect to verify-email if user's email is not verified
    useEffect(() => {
        if (session?.user && !session.user.emailVerified) {
            router.push('/verify-email')
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
