import { IOutlineRepository } from '../../domain/repositories/IOutlineRepository'

export class DeleteOutlineUseCase {
    constructor(private outlineRepository: IOutlineRepository) { }

    async execute(organizationId: string, outlineId: string): Promise<void> {
        return this.outlineRepository.deleteOutline(organizationId, outlineId)
    }
}
