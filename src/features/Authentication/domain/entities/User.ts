export interface User {
    id: string
    email: string
    name: string
    emailVerified: boolean
    image?: string | null
    createdAt: Date
    updatedAt: Date
}

export interface Session {
    user: User
    session: {
        id: string
        userId: string
        expiresAt: Date
        ipAddress?: string
        userAgent?: string
    }
}

export interface LoginCredentials {
    email: string
    password: string
}

export interface SignupData {
    email: string
    password: string
    name: string
}

export interface AuthResponse {
    user: User
    session: Session['session']
}
