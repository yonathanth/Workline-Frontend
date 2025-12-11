import { IInvitationRepository } from "../../domain/repositories/IInvitationRepository";
import { Invitation } from "../../domain/entities/Invitation";
import { authClient } from "@/lib/auth-client";

export class InvitationsRepositoryImpl implements IInvitationRepository {
    async getReceivedInvitations(): Promise<Invitation[]> {
        console.log('🔔 Fetching received invitations for current user');

        const { data, error } = await authClient.organization.listUserInvitations();

        if (error) {
            console.error('❌ Failed to fetch received invitations:', error);
            throw new Error(error.message || "Failed to fetch received invitations");
        }

        if (!data) return [];

        const invitations = await Promise.all(data.map(async (inv) => {
            let orgDetails = {
                id: inv.organizationId,
                name: "Unknown Organization",
                slug: "",
                logo: null as string | null
            };

            try {
                const { data: orgData } = await authClient.organization.getFullOrganization({
                    query: {
                        organizationId: inv.organizationId
                    }
                });

                if (orgData) {
                    orgDetails = {
                        id: orgData.id,
                        name: orgData.name,
                        slug: orgData.slug,
                        logo: orgData.logo || null
                    };
                }
            } catch (e) {
                console.warn(`Failed to fetch details for org ${inv.organizationId}`, e);
            }

            return {
                ...inv,
                organization: orgDetails
            } as Invitation;
        }));

        console.log('✅ Received invitations fetched successfully:', invitations.length, 'invitations');
        return invitations;
    }

    async getSentInvitations(organizationId: string): Promise<Invitation[]> {
        console.log('🔔 Fetching sent invitations for organization:', organizationId);

        const { data, error } = await authClient.organization.listInvitations({
            query: { organizationId }
        });

        if (error) {
            console.error('❌ Failed to fetch sent invitations:', error);
            throw new Error(error.message || "Failed to fetch sent invitations");
        }

        if (!data) return [];

        // Fetch organization details once
        let orgDetails = {
            id: organizationId,
            name: "Current Organization",
            slug: "",
            logo: null as string | null
        };

        try {
            const { data: orgData } = await authClient.organization.getFullOrganization({
                query: {
                    organizationId
                }
            });
            if (orgData) {
                orgDetails = {
                    id: orgData.id,
                    name: orgData.name,
                    slug: orgData.slug,
                    logo: orgData.logo || null
                };
            }
        } catch (e) {
            console.warn(`Failed to fetch details for org ${organizationId}`, e);
        }

        const invitations = data.map(inv => ({
            ...inv,
            organization: orgDetails
        })) as Invitation[];

        console.log('✅ Sent invitations fetched successfully:', invitations.length, 'invitations');
        return invitations;
    }

    async acceptInvitation(invitationId: string): Promise<void> {
        console.log('🔔 Accepting invitation:', invitationId);

        const { error } = await authClient.organization.acceptInvitation({
            invitationId
        });

        if (error) {
            console.error('❌ Failed to accept invitation:', error);
            throw new Error(error.message || "Failed to accept invitation");
        }

        console.log('✅ Invitation accepted successfully');
    }

    async rejectInvitation(invitationId: string): Promise<void> {
        console.log('🔔 Rejecting invitation:', invitationId);

        const { error } = await authClient.organization.rejectInvitation({
            invitationId
        });

        if (error) {
            console.error('❌ Failed to reject invitation:', error);
            throw new Error(error.message || "Failed to reject invitation");
        }

        console.log('✅ Invitation rejected successfully');
    }
}
