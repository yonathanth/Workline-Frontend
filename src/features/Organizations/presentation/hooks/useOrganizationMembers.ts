import { useQuery } from '@tanstack/react-query'
import { OrganizationRepositoryImpl } from '../../data/repositories/OrganizationRepositoryImpl'
import { GetOrganizationMembersUseCase } from '../../application/usecases/GetOrganizationMembersUseCase'

const organizationRepository = new OrganizationRepositoryImpl()
const getOrganizationMembersUseCase = new GetOrganizationMembersUseCase(organizationRepository)

export const useOrganizationMembers = (organizationId: string | null) => {
    return useQuery({
        queryKey: ['organization-members', organizationId],
        queryFn: () => {
            if (!organizationId) throw new Error('Organization ID is required')
            return getOrganizationMembersUseCase.execute(organizationId)
        },
        enabled: !!organizationId,
    })
}
