"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"
import { useAccount } from "../../application/hooks/useAccount"
import { authClient } from "@/lib/auth-client"

export function EmailForm() {
    const { data: session } = authClient.useSession()
    const { updateEmail, isUpdatingEmail } = useAccount()

    const currentEmail = session?.user?.email || ""
    const [newEmail, setNewEmail] = useState("")
    const [password, setPassword] = useState("")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (newEmail.trim() && password.trim()) {
            await updateEmail({ email: newEmail.trim(), password: password.trim() })
            setNewEmail("")
            setPassword("")
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Email Address</CardTitle>
                <CardDescription>
                    Update your email address. You'll need to verify the new email.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="current-email">Current Email</Label>
                        <Input
                            id="current-email"
                            value={currentEmail}
                            disabled
                            className="bg-muted"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="new-email">New Email</Label>
                        <Input
                            id="new-email"
                            type="email"
                            value={newEmail}
                            onChange={(e) => setNewEmail(e.target.value)}
                            placeholder="Enter new email address"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email-password">Current Password</Label>
                        <Input
                            id="email-password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your current password"
                            required
                        />
                        <p className="text-xs text-muted-foreground">
                            Required for verification
                        </p>
                    </div>

                    <Button type="submit" disabled={isUpdatingEmail} className="w-full">
                        {isUpdatingEmail && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Update Email
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}
