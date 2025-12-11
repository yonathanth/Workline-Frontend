import { IOrganizationRepository } from "../../domain/repositories/IOrganizationRepository";
import { OrganizationMember } from "../../domain/entities/OrganizationMember";

export class GetOrganizationMembersUseCase {
    constructor(private organizationRepository: IOrganizationRepository) { }

    async execute(organizationId: string): Promise<OrganizationMember[]> {
        return this.organizationRepository.getOrganizationMembers(organizationId);
    }
}
