import { authClient } from "@/lib/auth-client";
import { Member } from "../../domain/entities/Member";
import { IMemberRepository } from "../../domain/repositories/IMemberRepository";
import { MemberRole } from "@/features/Organizations/domain/entities/Organization";

export class MembersRepositoryImpl implements IMemberRepository {
    async getMembers(organizationId: string): Promise<Member[]> {
        const { data, error } = await authClient.organization.listMembers({
            query: { organizationId }
        });

        if (error) {
            throw new Error(error.message || "Failed to fetch members");
        }

        return data?.members as Member[] || [];
    }

    async removeMember(organizationId: string, userId: string): Promise<void> {
        const { error } = await authClient.organization.removeMember({
            memberIdOrEmail: userId,
            organizationId
        });

        if (error) {
            throw new Error(error.message || "Failed to remove member");
        }
    }

    async updateRole(organizationId: string, userId: string, role: MemberRole): Promise<void> {
        const { error } = await authClient.organization.updateMemberRole({
            memberId: userId,
            role,
            organizationId
        });

        if (error) {
            throw new Error(error.message || "Failed to update member role");
        }
    }

    async inviteMember(email: string, role: MemberRole, organizationId: string): Promise<void> {
        const { error } = await authClient.organization.inviteMember({
            email,
            role,
            organizationId
        });

        if (error) {
            throw new Error(error.message || "Failed to invite member");
        }
    }
}
