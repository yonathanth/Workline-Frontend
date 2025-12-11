import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Invitation } from "../../domain/entities/Invitation"

interface SentInvitationsListProps {
    invitations: Invitation[]
}

export function SentInvitationsList({ invitations }: SentInvitationsListProps) {
    if (invitations.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
                <h3 className="text-lg font-semibold">No sent invitations</h3>
                <p className="text-muted-foreground text-sm">
                    You haven't sent any invitations yet.
                </p>
            </div>
        )
    }

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Sent</TableHead>
                        <TableHead>Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {invitations.map((invitation) => (
                        <TableRow key={invitation.id}>
                            <TableCell className="font-medium">{invitation.email}</TableCell>
                            <TableCell>
                                <Badge variant="secondary">{invitation.role}</Badge>
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                                {new Date(invitation.createdAt).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                                <Badge variant={invitation.status === 'pending' ? 'outline' : 'default'}>
                                    {invitation.status}
                                </Badge>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}
