export interface Invitation {
    id: string;
    email: string;
    organizationId: string;
    role: string;
    status: 'pending' | 'accepted' | 'rejected';
    expiresAt: Date;
    createdAt: Date;
    organization: {
        id: string;
        name: string;
        slug: string;
        logo?: string | null;
    };
}
