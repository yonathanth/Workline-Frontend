import { authClient } from '@/lib/auth-client'
import { Outline } from '../../domain/entities/Outline'
import { IOutlineRepository } from '../../domain/repositories/IOutlineRepository'

export class OutlineRepositoryImpl implements IOutlineRepository {
    private readonly baseURL = process.env.NEXT_PUBLIC_API_URL || 'https://workline-backend.vercel.app'

    async getOutlines(organizationId: string): Promise<Outline[]> {
        const { data, error } = await authClient.$fetch<Outline[]>(`${this.baseURL}/api/organizations/${organizationId}/outlines`)
        if (error) throw new Error(error.message || 'Failed to fetch outlines')
        return data || []
    }

    async createOutline(organizationId: string, outline: Omit<Outline, 'id' | 'createdAt' | 'updatedAt' | 'organizationId'>): Promise<Outline> {
        const { data, error } = await authClient.$fetch<Outline>(`${this.baseURL}/api/organizations/${organizationId}/outlines`, {
            method: 'POST',
            body: outline
        })
        if (error) throw new Error(error.message || 'Failed to create outline')
        return data!
    }

    async updateOutline(organizationId: string, outline: Outline): Promise<Outline> {
        const { data, error } = await authClient.$fetch<Outline>(`${this.baseURL}/api/organizations/${organizationId}/outlines/${outline.id}`, {
            method: 'PATCH',
            body: outline
        })
        if (error) throw new Error(error.message || 'Failed to update outline')
        return data!
    }

    async deleteOutline(organizationId: string, outlineId: string): Promise<void> {
        const { error } = await authClient.$fetch(`${this.baseURL}/api/organizations/${organizationId}/outlines/${outlineId}`, {
            method: 'DELETE'
        })
        if (error) throw new Error(error.message || 'Failed to delete outline')
    }
}
