import { Outline } from '../entities/Outline'

export interface IOutlineRepository {
    getOutlines(organizationId: string): Promise<Outline[]>
    createOutline(organizationId: string, outline: Omit<Outline, 'id' | 'createdAt' | 'updatedAt' | 'organizationId'>): Promise<Outline>
    updateOutline(organizationId: string, outline: Outline): Promise<Outline>
    deleteOutline(organizationId: string, outlineId: string): Promise<void>
}
