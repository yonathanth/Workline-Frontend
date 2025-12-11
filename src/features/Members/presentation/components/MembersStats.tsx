import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Member } from "../../domain/entities/Member"
import { Users, Crown, Shield, User } from "lucide-react"

interface MembersStatsProps {
    members: Member[]
}

export function MembersStats({ members }: MembersStatsProps) {
    const totalMembers = members.length
    const owners = members.filter(m => m.role === "owner").length
    const admins = members.filter(m => m.role === "admin").length
    const regularMembers = members.filter(m => m.role === "member").length

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Members</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{totalMembers}</div>
                    <p className="text-xs text-muted-foreground">
                        All organization members
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Owners</CardTitle>
                    <Crown className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{owners}</div>
                    <p className="text-xs text-muted-foreground">
                        Full organization access
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Admins</CardTitle>
                    <Shield className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{admins}</div>
                    <p className="text-xs text-muted-foreground">
                        Administrative privileges
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Members</CardTitle>
                    <User className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{regularMembers}</div>
                    <p className="text-xs text-muted-foreground">
                        Regular members
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}
