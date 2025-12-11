import { Member } from "../entities/Member";
import { MemberRole } from "@/features/Organizations/domain/entities/Organization";

export interface IMemberRepository {
    getMembers(organizationId: string): Promise<Member[]>;
    removeMember(organizationId: string, userId: string): Promise<void>;
    updateRole(organizationId: string, userId: string, role: MemberRole): Promise<void>;
    inviteMember(email: string, role: MemberRole, organizationId: string): Promise<void>;
}
