"use client"

import { useState } from "react"
import Avatar from "boring-avatars"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"
import { useAccount } from "../../application/hooks/useAccount"
import { authClient } from "@/lib/auth-client"
import { useQueryClient } from "@tanstack/react-query"

const AVATAR_VARIANTS = ["beam", "marble", "pixel", "ring", "bauhaus"] as const
const AVATAR_COLORS = [
    ["#92A1C6", "#146A7C", "#F0AB3D", "#C271B4", "#C20D90"],
    ["#FF6B6B", "#4ECDC4", "#45B7D1", "#FFA07A", "#98D8C8"],
    ["#6C5CE7", "#A29BFE", "#FD79A8", "#FDCB6E", "#00B894"],
    ["#E17055", "#FDCB6E", "#00B894", "#00CEC9", "#0984E3"],
]

interface AvatarSelectorProps {
    currentImage?: string
}

export function AvatarSelector({ currentImage }: AvatarSelectorProps) {
    const { data: session } = authClient.useSession()
    const { updateImage, isUpdatingImage } = useAccount()
    const queryClient = useQueryClient()
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

    const userName = session?.user?.name || "User"

    // Generate unique avatars (20 total = 2 rows of 10)
    const avatarOptions = AVATAR_VARIANTS.flatMap((variant, variantIndex) =>
        AVATAR_COLORS.map((colors, colorIndex) => ({
            variant,
            colors,
            index: variantIndex * AVATAR_COLORS.length + colorIndex
        }))
    )

    const handleSave = async () => {
        if (selectedIndex === null) return

        const selected = avatarOptions[selectedIndex]
        const svg = document.getElementById(`avatar-${selectedIndex}`)?.innerHTML
        if (svg) {
            const dataUrl = `data:image/svg+xml;base64,${btoa(svg)}`
            await updateImage(dataUrl)
            // Reload page to show updated avatar
            window.location.reload()
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Avatar</CardTitle>
                <CardDescription>
                    Choose an avatar that represents you
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
                {/* Current Avatar - no border until selection */}
                <div className="flex items-center gap-3">
                    <div className="flex flex-col gap-1.5">
                        <Label className="text-xs text-muted-foreground">Current</Label>
                        <div className="h-14 w-14 rounded-full overflow-hidden">
                            {currentImage ? (
                                <img src={currentImage} alt="Current avatar" className="h-full w-full object-cover" />
                            ) : (
                                <Avatar
                                    size={56}
                                    name={userName}
                                    variant="beam"
                                    colors={AVATAR_COLORS[0]}
                                />
                            )}
                        </div>
                    </div>
                </div>

                {/* Compact Avatar Selection Grid - 10 columns */}
                <div>
                    <Label className="text-xs text-muted-foreground mb-2 block">Select New Avatar</Label>
                    <div className="grid grid-cols-10 gap-1.5">
                        {avatarOptions.map((option) => (
                            <button
                                key={option.index}
                                onClick={() => setSelectedIndex(option.index)}
                                className="relative group focus:outline-none"
                            >
                                <div className="relative h-10 w-10">
                                    <div className="h-10 w-10 rounded-full overflow-hidden transition-transform duration-200 group-hover:scale-110">
                                        <div id={`avatar-${option.index}`}>
                                            <Avatar
                                                size={40}
                                                name={userName}
                                                variant={option.variant}
                                                colors={option.colors}
                                            />
                                        </div>
                                    </div>
                                    {selectedIndex === option.index && (
                                        <div className="absolute inset-0 rounded-full ring-3 ring-primary shadow-md pointer-events-none" />
                                    )}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
                <div className="w-full flex justify-end pt-6">
                    {/* Save Button */}
                    <Button onClick={handleSave} disabled={isUpdatingImage || selectedIndex === null} className="w-full sm:w-auto sm:min-w-32">
                        {isUpdatingImage && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Save Avatar
                    </Button>
                </div>

            </CardContent>
        </Card>
    )
}
