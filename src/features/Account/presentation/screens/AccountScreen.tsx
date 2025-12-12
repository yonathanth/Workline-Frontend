"use client"

import { SiteHeader } from "@/components/site-header"
import { SidebarInset } from "@/components/ui/sidebar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AvatarSelector } from "../components/AvatarSelector"
import { ProfileForm } from "../components/ProfileForm"
import { PasswordForm } from "../components/PasswordForm"
import { authClient } from "@/lib/auth-client"

export function AccountScreen() {
    const { data: session } = authClient.useSession()

    return (
        <SidebarInset>
            <SiteHeader title="Account Settings" />
            <div className="flex flex-1 flex-col gap-4 p-4 md:p-6">
                <Tabs defaultValue="profile" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="profile">Profile</TabsTrigger>
                        <TabsTrigger value="password">Password</TabsTrigger>
                    </TabsList>

                    <TabsContent value="profile" className="space-y-4 mt-4">
                        <AvatarSelector currentImage={session?.user?.image || undefined} />
                        <ProfileForm />
                    </TabsContent>

                    <TabsContent value="password" className="mt-4">
                        <PasswordForm />
                    </TabsContent>
                </Tabs>
            </div>
        </SidebarInset>
    )
}
