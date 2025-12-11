import { Outline } from '../../domain/entities/Outline'
import { IOutlineRepository } from '../../domain/repositories/IOutlineRepository'

export class UpdateOutlineUseCase {
    constructor(private outlineRepository: IOutlineRepository) { }

    async execute(organizationId: string, outline: Outline): Promise<Outline> {
        return await this.outlineRepository.updateOutline(organizationId, outline)
    }
}
