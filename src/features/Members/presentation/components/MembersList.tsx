import { useState } from "react"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { IconCopy, IconDotsVertical, IconTrash } from "@tabler/icons-react"
import { Loader2 } from "lucide-react"
import { Member } from "../../domain/entities/Member"
import { MemberRole } from "@/features/Organizations/domain/entities/Organization"
import { toast } from "sonner"
import { PermissionChecks } from "@/lib/permissions"

interface MembersListProps {
    members: Member[]
    currentUserId: string
    currentUserRole?: string | null
    onRemoveMember: (userId: string) => Promise<void>
    onUpdateRole: (userId: string, role: MemberRole) => Promise<void>
}

export function MembersList({ members, currentUserId, currentUserRole, onRemoveMember, onUpdateRole }: MembersListProps) {
    const [deletingUserId, setDeletingUserId] = useState<string | null>(null)
    const [updatingUserId, setUpdatingUserId] = useState<string | null>(null)

    const handleCopyEmail = (email: string) => {
        navigator.clipboard.writeText(email)
        toast.success("Email copied to clipboard")
    }

    const handleDelete = async (userId: string) => {
        setDeletingUserId(userId)
        try {
            await onRemoveMember(userId)
            toast.success("Member removed successfully")
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Failed to remove member")
        } finally {
            setDeletingUserId(null)
        }
    }

    const handleRoleChange = async (userId: string, newRole: MemberRole) => {
        setUpdatingUserId(userId)
        try {
            await onUpdateRole(userId, newRole)
            toast.success("Member role updated successfully")
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Failed to update member role")
        } finally {
            setUpdatingUserId(null)
        }
    }

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Member</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Joined</TableHead>
                        <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {members.map((member) => {
                        const isCurrentUser = member.userId === currentUserId
                        const canDelete = PermissionChecks.canDeleteMember(currentUserRole) && !isCurrentUser
                        const canEditRole = PermissionChecks.canUpdateMemberRole(currentUserRole) && !isCurrentUser
                        const isLoading = updatingUserId === member.userId

                        return (
                            <TableRow key={member.id}>
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-9 w-9">
                                            <AvatarImage src={member.user.image} alt={member.user.name} />
                                            <AvatarFallback>{member.user.name.charAt(0).toUpperCase()}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex flex-col">
                                            <span className="font-medium">{member.user.name}</span>
                                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                                {member.user.email}
                                                <button
                                                    onClick={() => handleCopyEmail(member.user.email)}
                                                    className="ml-1 hover:text-foreground"
                                                >
                                                    <IconCopy className="h-3 w-3" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    {canEditRole ? (
                                        <Select
                                            value={member.role}
                                            onValueChange={(value) => handleRoleChange(member.userId, value as MemberRole)}
                                            disabled={isLoading}
                                        >
                                            <SelectTrigger className="w-[120px]">
                                                {isLoading ? (
                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                ) : (
                                                    <SelectValue />
                                                )}
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value={MemberRole.ADMIN}>Admin</SelectItem>
                                                <SelectItem value={MemberRole.MEMBER}>Member</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    ) : (
                                        <Badge variant={member.role === MemberRole.OWNER ? "default" : "secondary"}>
                                            {member.role}
                                        </Badge>
                                    )}
                                </TableCell>
                                <TableCell className="text-muted-foreground">
                                    {new Date(member.createdAt).toLocaleDateString()}
                                </TableCell>
                                <TableCell>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                                <IconDotsVertical className="h-4 w-4" />
                                                <span className="sr-only">Open menu</span>
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={() => handleCopyEmail(member.user.email)}>
                                                <IconCopy className="mr-2 h-4 w-4" />
                                                Copy Email
                                            </DropdownMenuItem>
                                            {canDelete && (
                                                <>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem
                                                        className="text-destructive focus:text-destructive"
                                                        onClick={() => handleDelete(member.userId)}
                                                        disabled={deletingUserId === member.userId}
                                                    >
                                                        {deletingUserId === member.userId ? (
                                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                        ) : (
                                                            <IconTrash className="mr-2 h-4 w-4" />
                                                        )}
                                                        Remove Member
                                                    </DropdownMenuItem>
                                                </>
                                            )}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        )
                    })}
                </TableBody>
            </Table>
        </div>
    )
}
