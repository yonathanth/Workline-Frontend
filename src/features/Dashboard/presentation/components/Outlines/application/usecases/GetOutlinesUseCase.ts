import { IOutlineRepository } from '../../domain/repositories/IOutlineRepository'

export class GetOutlinesUseCase {
    constructor(private repository: IOutlineRepository) { }

    async execute(organizationId: string) {
        return this.repository.getOutlines(organizationId)
    }
}
