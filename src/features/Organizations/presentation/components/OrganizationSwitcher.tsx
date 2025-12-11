import * as React from "react"
import { ChevronsUpDown, Plus } from "lucide-react"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar"
import { useOrganization } from "../../application/hooks/useOrganization"
import { Skeleton } from "@/components/ui/skeleton"
import { CreateOrganizationDialog } from "./CreateOrganizationDialog"

export function OrganizationSwitcher() {
    const { isMobile } = useSidebar()
    const { organizations, activeOrganizationId, setActiveOrganization, isLoading } = useOrganization()
    const [showCreateDialog, setShowCreateDialog] = React.useState(false)

    const activeOrganization = organizations?.find(org => org?.id === activeOrganizationId) || organizations?.[0]

    if (isLoading) {
        return (
            <SidebarMenu>
                <SidebarMenuItem>
                    <SidebarMenuButton size="lg">
                        <Skeleton className="h-8 w-8 rounded-lg" />
                        <div className="grid flex-1 text-left text-sm leading-tight">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-3 w-16" />
                        </div>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
        )
    }

    // If no organizations, show "Add Organization" button
    if (!organizations || organizations.length === 0) {
        return (
            <SidebarMenu>
                <SidebarMenuItem>
                    <CreateOrganizationDialog
                        trigger={
                            <SidebarMenuButton
                                size="lg"
                                className="justify-center gap-2 bg-primary text-primary-foreground hover:bg-foreground hover:text-background transition-colors"
                            >
                                <Plus className="size-4" />
                                <span className="font-semibold">Add Organization</span>
                            </SidebarMenuButton>
                        }
                    />
                </SidebarMenuItem>
            </SidebarMenu>
        )
    }

    return (
        <>
            <SidebarMenu>
                <SidebarMenuItem>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <SidebarMenuButton
                                size="lg"
                                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                            >
                                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                                    {/* Use logo if available, else first letter */}
                                    {activeOrganization?.logo ? (
                                        <img src={activeOrganization.logo} alt={activeOrganization.name} className="size-4" />
                                    ) : (
                                        <span className="font-bold">{activeOrganization?.name?.charAt(0) || 'O'}</span>
                                    )}
                                </div>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-semibold">
                                        {activeOrganization?.name || 'Select Organization'}
                                    </span>
                                    <span className="truncate text-xs">
                                        {activeOrganization?.slug || 'No organization selected'}
                                    </span>
                                </div>
                                <ChevronsUpDown className="ml-auto" />
                            </SidebarMenuButton>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                            align="start"
                            side={isMobile ? "bottom" : "right"}
                            sideOffset={4}
                        >
                            <DropdownMenuLabel className="text-xs text-muted-foreground">
                                Organizations
                            </DropdownMenuLabel>
                            {organizations
                                .filter(org => org != null) // Filter out null/undefined
                                .map((org) => (
                                    <DropdownMenuItem
                                        key={org.id}
                                        onClick={() => setActiveOrganization(org.id)}
                                        className="gap-2 p-2"
                                    >
                                        <div className="flex size-6 items-center justify-center rounded-sm border">
                                            {org.logo ? (
                                                <img src={org.logo} alt={org.name} className="size-4" />
                                            ) : (
                                                <span className="font-bold text-xs">{org.name?.charAt(0) || '?'}</span>
                                            )}
                                        </div>
                                        {org.name}
                                        <DropdownMenuShortcut>⌘{organizations.indexOf(org) + 1}</DropdownMenuShortcut>
                                    </DropdownMenuItem>
                                ))}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="gap-2 p-2" onClick={() => setShowCreateDialog(true)}>
                                <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                                    <Plus className="size-4" />
                                </div>
                                <div className="font-medium text-muted-foreground">Add organization</div>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </SidebarMenuItem>
            </SidebarMenu>
            <CreateOrganizationDialog open={showCreateDialog} onOpenChange={setShowCreateDialog} />
        </>
    )
}
