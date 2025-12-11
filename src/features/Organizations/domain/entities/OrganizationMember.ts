export interface OrganizationMember {
    id: string
    userId: string
    role: 'owner' | 'admin' | 'member'
    user: {
        id: string
        name: string
        email: string
        image?: string
    }
    createdAt: Date
}
