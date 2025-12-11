export interface Organization {
    id: string
    name: string
    slug: string
    logo?: string | null
    metadata?: Record<string, any>
    createdAt: Date
    role?: string // The user's role in this organization
}

export interface ActiveOrganization {
    organization: Organization
    member: {
        id: string
        role: string
        userId: string
    }
}

export enum MemberRole {
    OWNER = 'owner',
    ADMIN = 'admin',
    MEMBER = 'member',
}
