import { Button } from "@/components/ui/button"
import { Building2, Plus } from "lucide-react"
import { CreateOrganizationDialog } from "./CreateOrganizationDialog"

export function EmptyOrgState() {
    return (
        <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                <Building2 className="h-10 w-10 text-muted-foreground" />
            </div>
            <div className="max-w-md space-y-2">
                <h2 className="text-2xl font-bold tracking-tight">No Organization Selected</h2>
                <p className="text-muted-foreground">
                    You don't have any organizations yet. Create one to start managing your outlines and team.
                </p>
            </div>
            <CreateOrganizationDialog
                trigger={
                    <Button className="mt-4 gap-2">
                        <Plus className="h-4 w-4" />
                        Create Organization
                    </Button>
                }
            />
        </div>
    )
}
