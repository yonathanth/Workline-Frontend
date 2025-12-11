"use client"

import { DotLottieReact } from '@lottiefiles/dotlottie-react'
import { useGlobalLoader } from '@/context/GlobalLoaderContext'

export function GlobalLoader() {
    const { isLoading } = useGlobalLoader()

    if (!isLoading) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
            <div className="h-32 w-32 dark:invert">
                <DotLottieReact
                    src="https://lottie.host/9bb78450-71c3-4504-8131-93881a04bc9e/3EHJAvNhCk.lottie"
                    loop
                    autoplay
                />
            </div>
        </div>
    )
}
