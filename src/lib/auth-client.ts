import { createAuthClient } from "better-auth/react"
import { organizationClient } from "better-auth/client/plugins"

/**
 * Auth Client Configuration
 * 
 * For cross-browser compatibility (especially Firefox and Safari), the backend API must:
 * 1. Set cookies with `SameSite=None; Secure` attributes for cross-origin requests
 * 2. Send `Access-Control-Allow-Credentials: true` header
 * 3. Send `Access-Control-Allow-Origin` with the specific frontend origin (not wildcard `*`)
 * 
 * Without these backend configurations, authentication will fail in Firefox and Safari
 * due to their stricter cookie policies.
 */
export const authClient = createAuthClient({
    baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "https://workline.api.shalops.com/",
    plugins: [
        organizationClient()
    ],
    fetchOptions: {
        credentials: 'include',
        // Add headers for better cross-browser compatibility
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        // Ensure mode is set for cross-origin requests
        mode: 'cors',
    }
})

// Log to verify configuration
console.log('🔐 Auth Client configured with baseURL:', process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "https://workline.api.shalops.com/")
