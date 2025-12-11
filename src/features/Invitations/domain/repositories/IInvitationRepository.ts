import { Invitation } from "../entities/Invitation";

export interface IInvitationRepository {
    getReceivedInvitations(): Promise<Invitation[]>;
    getSentInvitations(organizationId: string): Promise<Invitation[]>;
    acceptInvitation(invitationId: string): Promise<void>;
    rejectInvitation(invitationId: string): Promise<void>;
}
