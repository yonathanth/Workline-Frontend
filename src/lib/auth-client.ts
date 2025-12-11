import { createAuthClient } from "better-auth/react"
import { organizationClient } from "better-auth/client/plugins"

export const authClient = createAuthClient({
    baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "https://workline-backend.vercel.app",
    plugins: [
        organizationClient()
    ],
    fetchOptions: {
        credentials: 'include',
    }
})

// Log to verify configuration
console.log('🔐 Auth Client configured with baseURL:', process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "https://workline-backend.vercel.app")
