import { authClient } from '@/lib/auth-client'
import { Organization, ActiveOrganization } from '../../domain/entities/Organization'
import { OrganizationMember } from '../../domain/entities/OrganizationMember'
import { IOrganizationRepository } from '../../domain/repositories/IOrganizationRepository'

export class OrganizationRepositoryImpl implements IOrganizationRepository {
    async listOrganizations(): Promise<Organization[]> {
        try {
            console.log('📡 [OrganizationRepository] Fetching organizations list...')
            const { data, error } = await authClient.organization.list()

            if (error) {
                console.error('❌ [OrganizationRepository] Error from API:', error)
                throw error
            }
            
            if (!data) {
                console.log('⚠️ [OrganizationRepository] No data returned, returning empty array')
                return []
            }

            console.log('✅ [OrganizationRepository] Organizations fetched:', data)
            return data as Organization[]
        } catch (error) {
            console.error('❌ [OrganizationRepository] Exception fetching organizations:', error)
            throw error
        }
    }

    async createOrganization(name: string, slug: string): Promise<Organization> {
        const { data, error } = await authClient.organization.create({
            name,
            slug,
        })
        if (error) throw error
        return data as Organization
    }

    async setActiveOrganization(organizationId: string): Promise<void> {
        const { error } = await authClient.organization.setActive({
            organizationId,
        })
        if (error) throw error
    }

    async getActiveOrganization(): Promise<ActiveOrganization | null> {
        // This is a bit tricky as better-auth might not expose a direct "get active" async method
        // that returns the full object if it's not in the session.
        // However, we can use useSession in the hook, but for the repo we might rely on listing or session data.
        // For now, let's assume we rely on the session state managed by the hook/client.
        // But strictly speaking, the repository should fetch data.
        // Let's check if there is a 'check' or similar, or we just return null and let the hook handle it via useSession.
        // Actually, authClient.useSession() is a hook. authClient.getSession() is async.
        const { data } = await authClient.getSession()
        if (!data?.session?.activeOrganizationId) return null

        // If we have an active org ID, we might want to return the full org details.
        // The session object usually contains activeOrganizationId.
        // To get the full object, we might need to find it in the list or fetch it.
        // For simplicity in this Clean Arch implementation, let's return what we can or null.
        // Ideally, the session data should have it if configured.

        // Let's try to list and find.
        const orgs = await this.listOrganizations()
        const activeOrg = orgs.find(o => o.id === data.session.activeOrganizationId)

        if (!activeOrg) return null

        return {
            organization: activeOrg,
            member: {
                id: '', // We might not have this easily without another call
                role: '', // Same
                userId: data.user.id
            }
        }
    }
    async getOrganizationMembers(organizationId: string): Promise<OrganizationMember[]> {
        const { data, error } = await authClient.organization.listMembers({
            query: { organizationId }
        })

        if (error) {
            throw new Error(error.message || "Failed to fetch organization members")
        }

        return data?.members as OrganizationMember[] || []
    }
}
