import { IOrganizationRepository } from '../../domain/repositories/IOrganizationRepository'

export class GetOrganizationsUseCase {
    constructor(private repository: IOrganizationRepository) { }

    async execute() {
        return this.repository.listOrganizations()
    }
}
