import { MemberRole } from "@/features/Organizations/domain/entities/Organization";

export interface Member {
    id: string;
    userId: string;
    organizationId: string;
    role: MemberRole;
    createdAt: Date;
    user: {
        id: string;
        name: string;
        email: string;
        image?: string;
    };
}
