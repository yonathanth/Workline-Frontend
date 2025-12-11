import { Organization, ActiveOrganization } from '../entities/Organization'
import { OrganizationMember } from '../entities/OrganizationMember'

export interface IOrganizationRepository {
    listOrganizations(): Promise<Organization[]>
    createOrganization(name: string, slug: string): Promise<Organization>
    setActiveOrganization(organizationId: string): Promise<void>
    getActiveOrganization(): Promise<ActiveOrganization | null>
    getOrganizationMembers(organizationId: string): Promise<OrganizationMember[]>
}
