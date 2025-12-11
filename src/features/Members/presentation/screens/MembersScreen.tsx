"use client"

import { useEffect, useState } from "react"
import { MembersStats } from "../components/MembersStats"
import { MembersList } from "../components/MembersList"
import { InviteMemberDialog } from "../components/InviteMemberDialog"
import { MembersRepositoryImpl } from "../../data/repositories/MembersRepositoryImpl"
import { Member } from "../../domain/entities/Member"
import { MemberRole } from "@/features/Organizations/domain/entities/Organization"
import { authClient } from "@/lib/auth-client"
import { Loader2 } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { Skeleton } from "@/components/ui/skeleton"
import { MembersListSkeleton } from "../components/MembersListSkeleton"

import { useOrganization } from "@/features/Organizations/application/hooks/useOrganization"
import { toast } from "sonner"

// Initialize repository
const membersRepository = new MembersRepositoryImpl()

export default function MembersScreen({ params }: { params: { organizationId: string } }) {
    const [members, setMembers] = useState<Member[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const { data: session } = authClient.useSession()
    const { currentUserRole } = useOrganization()
    // Use organizationId from params or session if available
    const organizationId = session?.session.activeOrganizationId

    const fetchMembers = async () => {
        if (!organizationId) return
        setIsLoading(true)
        try {
            const data = await membersRepository.getMembers(organizationId)
            setMembers(data)
        } catch (error) {
            console.error("Failed to fetch members:", error)
            toast.error("Failed to load members")
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchMembers()
    }, [organizationId])

    const handleInvite = async (email: string, role: MemberRole) => {
        if (!organizationId) return
        try {
            await membersRepository.inviteMember(email, role, organizationId)
            toast.success(`Invitation sent to ${email}`)
            fetchMembers() // Refresh to show pending invitations
        } catch (error: any) {
            const errorMessage = error?.message || "Failed to send invitation"
            toast.error(errorMessage)
        }
    }

    const handleRemove = async (userId: string) => {
        if (!organizationId) return
        try {
            await membersRepository.removeMember(organizationId, userId)
            toast.success("Member removed successfully")
            fetchMembers() // Refresh list
        } catch (error: any) {
            const errorMessage = error?.message || "Failed to remove member"
            toast.error(errorMessage)
        }
    }

    const handleUpdateRole = async (userId: string, role: MemberRole) => {
        if (!organizationId) return
        try {
            await membersRepository.updateRole(organizationId, userId, role)
            toast.success("Member role updated successfully")
            fetchMembers() // Refresh list
        } catch (error: any) {
            const errorMessage = error?.message || "Failed to update role"
            toast.error(errorMessage)
        }
    }

    if (isLoading) {
        return (
            <>
                <SiteHeader title="Members" />
                <div className="flex flex-col gap-8 p-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">Members</h1>
                            <p className="text-muted-foreground">
                                Manage your organization members and roles.
                            </p>
                        </div>
                        <Skeleton className="h-10 w-32" />
                    </div>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <Skeleton className="h-[120px] rounded-xl" />
                        <Skeleton className="h-[120px] rounded-xl" />
                        <Skeleton className="h-[120px] rounded-xl" />
                        <Skeleton className="h-[120px] rounded-xl" />
                    </div>
                    <MembersListSkeleton />
                </div>
            </>
        )
    }

    return (
        <>
            <SiteHeader title="Members" />
            <div className="flex flex-col gap-8 p-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Members</h1>
                        <p className="text-muted-foreground">
                            Manage your organization members and roles.
                        </p>
                    </div>
                    {(currentUserRole === MemberRole.ADMIN || currentUserRole === MemberRole.OWNER) && (
                        <InviteMemberDialog onInvite={handleInvite} />
                    )}
                </div>

                <MembersStats members={members} />

                <MembersList
                    members={members}
                    currentUserId={session?.user.id || ""}
                    currentUserRole={currentUserRole}
                    onRemoveMember={handleRemove}
                    onUpdateRole={handleUpdateRole}
                />
            </div>
        </>
    )
}
