"use client"

import { useEffect, useState } from "react"
import { InvitationsList } from "../components/InvitationsList"
import { SentInvitationsList } from "../components/SentInvitationsList"
import { InvitationsListSkeleton } from "../components/InvitationsListSkeleton"
import { InvitationsRepositoryImpl } from "../../data/repositories/InvitationsRepositoryImpl"
import { Invitation } from "../../domain/entities/Invitation"
import { SiteHeader } from "@/components/site-header"
import { Skeleton } from "@/components/ui/skeleton"
import { authClient } from "@/lib/auth-client"
import { useOrganization } from "@/features/Organizations/application/hooks/useOrganization"
import { PermissionChecks } from "@/lib/permissions"
import { toast } from "sonner"

import { useQueryClient } from "@tanstack/react-query"

// Initialize repository
const invitationsRepository = new InvitationsRepositoryImpl()

export default function InvitationsScreen() {
    const queryClient = useQueryClient()
    const [receivedInvitations, setReceivedInvitations] = useState<Invitation[]>([])
    const [sentInvitations, setSentInvitations] = useState<Invitation[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const { data: session } = authClient.useSession()
    const organizationId = session?.session.activeOrganizationId
    const { currentUserRole } = useOrganization()

    // Check if user can manage invitations (admins and owners only)
    const canManageInvitations = PermissionChecks.canManageInvitations(currentUserRole)

    const fetchInvitations = async () => {
        try {
            // Fetch invitations received by the user
            const received = await invitationsRepository.getReceivedInvitations()
            setReceivedInvitations(received)

            // Fetch invitations sent by the organization (only if user has permission)
            if (organizationId && canManageInvitations) {
                const sent = await invitationsRepository.getSentInvitations(organizationId)
                setSentInvitations(sent)
            }
        } catch (error) {
            console.error("Failed to fetch invitations:", error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchInvitations()
    }, [organizationId, canManageInvitations])

    const handleAccept = async (invitationId: string) => {
        try {
            await invitationsRepository.acceptInvitation(invitationId)
            toast.success("Invitation accepted successfully")
            await queryClient.invalidateQueries({ queryKey: ['organizations'] })
            fetchInvitations() // Refresh list
        } catch (error: any) {
            toast.error(error.message || "Failed to accept invitation")
        }
    }

    const handleReject = async (invitationId: string) => {
        try {
            await invitationsRepository.rejectInvitation(invitationId)
            toast.success("Invitation declined")
            fetchInvitations() // Refresh list
        } catch (error: any) {
            toast.error(error.message || "Failed to decline invitation")
        }
    }

    if (isLoading) {
        return (
            <>
                <SiteHeader title="Invitations" />
                <div className="flex flex-col gap-8 p-8">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Invitations</h1>
                        <p className="text-muted-foreground">
                            Manage your organization invitations.
                        </p>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <h2 className="mb-4 text-xl font-semibold">Received Invitations</h2>
                            <InvitationsListSkeleton />
                        </div>

                        {canManageInvitations && (
                            <div>
                                <h2 className="mb-4 text-xl font-semibold">Sent Invitations</h2>
                                <InvitationsListSkeleton />
                            </div>
                        )}
                    </div>
                </div>
            </>
        )
    }

    return (
        <>
            <SiteHeader title="Invitations" />
            <div className="flex flex-col gap-8 p-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Invitations</h1>
                    <p className="text-muted-foreground">
                        Manage your organization invitations.
                    </p>
                </div>

                <div className="space-y-8">
                    <div>
                        <h2 className="mb-4 text-xl font-semibold">Received Invitations</h2>
                        <p className="text-muted-foreground mb-4 text-sm">
                            Invitations from other organizations for you to join.
                        </p>
                        <InvitationsList
                            invitations={receivedInvitations}
                            onAccept={handleAccept}
                            onReject={handleReject}
                        />
                    </div>

                    {canManageInvitations && (
                        <div>
                            <h2 className="mb-4 text-xl font-semibold">Sent Invitations</h2>
                            <p className="text-muted-foreground mb-4 text-sm">
                                Invitations sent by your organization to others.
                            </p>
                            <SentInvitationsList invitations={sentInvitations} />
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}
