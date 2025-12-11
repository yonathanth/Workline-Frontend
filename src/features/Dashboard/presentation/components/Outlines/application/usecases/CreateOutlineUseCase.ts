import { IOutlineRepository } from '../../domain/repositories/IOutlineRepository'
import { Outline } from '../../domain/entities/Outline'

export class CreateOutlineUseCase {
    constructor(private repository: IOutlineRepository) { }

    async execute(organizationId: string, outline: Omit<Outline, 'id' | 'createdAt' | 'updatedAt' | 'organizationId'>): Promise<Outline> {
        return this.repository.createOutline(organizationId, outline)
    }
}
