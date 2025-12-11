import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Badge } from "@/components/ui/badge"
import { useOrganization } from "@/features/Organizations/application/hooks/useOrganization"
import { Crown, Shield, User } from "lucide-react"

export function SiteHeader(
    { title }: { title: string }
) {
    const { currentUserRole } = useOrganization()

    const getRoleBadge = () => {
        if (!currentUserRole) return null

        const roleConfig = {
            owner: {
                label: "Owner",
                icon: Crown,
                className: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20 py-2 px-4"
            },
            admin: {
                label: "Admin",
                icon: Shield,
                className: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20 py-2 px-4"
            },
            member: {
                label: "Member",
                icon: User,
                className: "bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20 py-2 px-4"
            }
        }

        const config = roleConfig[currentUserRole as keyof typeof roleConfig]
        if (!config) return null

        const Icon = config.icon

        return (
            <Badge variant="outline" className={config.className}>
                <Icon className="h-3 w-3 mr-1" />
                {config.label}
            </Badge>
        )
    }

    return (
        <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
            <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6 py-4">
                <SidebarTrigger className="-ml-1" />
                <Separator
                    orientation="vertical"
                    className="mx-2 data-[orientation=vertical]:h-4"
                />
                <h1 className="text-base font-medium">{title}</h1>
                <div className="ml-auto" id="role-badge">
                    {getRoleBadge()}
                </div>
            </div>
        </header>
    )
}
