import { IOrganizationRepository } from '../../domain/repositories/IOrganizationRepository'

export class CreateOrganizationUseCase {
    constructor(private repository: IOrganizationRepository) { }

    async execute(name: string, slug: string) {
        return this.repository.createOrganization(name, slug)
    }
}
