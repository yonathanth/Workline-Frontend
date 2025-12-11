import { IOrganizationRepository } from '../../domain/repositories/IOrganizationRepository'

export class SetActiveOrganizationUseCase {
    constructor(private repository: IOrganizationRepository) { }

    async execute(organizationId: string) {
        return this.repository.setActiveOrganization(organizationId)
    }
}
