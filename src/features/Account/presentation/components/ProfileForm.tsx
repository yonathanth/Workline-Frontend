"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"
import { useAccount } from "../../application/hooks/useAccount"
import { authClient } from "@/lib/auth-client"

export function ProfileForm() {
    const { data: session } = authClient.useSession()
    const { updateName, isUpdatingName } = useAccount()

    const currentName = session?.user?.name || ""
    const [name, setName] = useState(currentName)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (name.trim()) {
            await updateName(name.trim())
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                    Update your personal information
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter your full name"
                            required
                        />
                    </div>
                    <div className="w-full flex justify-end pt-6">
                        <Button type="submit" disabled={isUpdatingName || name === currentName} className="w-full sm:w-auto sm:min-w-36">
                            {isUpdatingName && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Update Profile
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    )
}
