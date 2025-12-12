import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { OrganizationRepositoryImpl } from '../../data/repositories/OrganizationRepositoryImpl'
import { GetOrganizationsUseCase } from '../usecases/GetOrganizationsUseCase'
import { CreateOrganizationUseCase } from '../usecases/CreateOrganizationUseCase'
import { SetActiveOrganizationUseCase } from '../usecases/SetActiveOrganizationUseCase'
import { authClient } from '@/lib/auth-client'
import { useAppDispatch, useAppSelector } from '@/lib/store'
import { setActiveOrganization as setActiveOrgRedux, setCurrentUserRole } from '@/lib/features/organizations/organizationsSlice'
import { useEffect } from 'react'
import { useGlobalLoader } from '@/context/GlobalLoaderContext'

// Initialize repository and use cases
const organizationRepository = new OrganizationRepositoryImpl()
const getOrganizationsUseCase = new GetOrganizationsUseCase(organizationRepository)
const createOrganizationUseCase = new CreateOrganizationUseCase(organizationRepository)
const setActiveOrganizationUseCase = new SetActiveOrganizationUseCase(organizationRepository)

export const useOrganization = () => {
    const queryClient = useQueryClient()
    const { data: session } = authClient.useSession()

    const dispatch = useAppDispatch()
    const activeOrganizationId = useAppSelector((state) => state.organizations.activeOrganizationId)
    const currentUserRole = useAppSelector((state) => state.organizations.currentUserRole)

    const organizationsQuery = useQuery({
        queryKey: ['organizations'],
        queryFn: () => getOrganizationsUseCase.execute(),
        enabled: !!session?.user,
    })

    const createOrganizationMutation = useMutation({
        mutationFn: (params: { name: string; slug: string }) =>
            createOrganizationUseCase.execute(params.name, params.slug),
        onSuccess: async (newOrg) => {
            await queryClient.invalidateQueries({ queryKey: ['organizations'] })
            // Auto-switch to the newly created organization
            if (newOrg?.id) {
                dispatch(setActiveOrgRedux(newOrg.id))
                await authClient.organization.setActive({ organizationId: newOrg.id })
            }
        },
    })

    const { showLoader, hideLoader } = useGlobalLoader()

    const setActiveOrganizationMutation = useMutation({
        mutationFn: async (organizationId: string) => {
            showLoader()
            return setActiveOrganizationUseCase.execute(organizationId)
        },
        onSuccess: async (_, organizationId) => {
            // Optimistic update
            dispatch(setActiveOrgRedux(organizationId))

            await queryClient.invalidateQueries({ queryKey: ['session'] })
            await queryClient.invalidateQueries({ queryKey: ['organizations'] })

            // Refresh session to ensure backend state is synced
            await authClient.getSession()

            // Navigate to dashboard outlines
            window.location.href = '/dashboard'
            // Loader will be hidden when page reloads or we can hide it if we used router.push
            // hideLoader() 
        },
        onError: () => {
            hideLoader()
        }
    })

    // Sync Redux with session and fetch role from Better Auth
    useEffect(() => {
        // Set active org ID from session if not in Redux
        if (session?.session?.activeOrganizationId && !activeOrganizationId) {
            dispatch(setActiveOrgRedux(session.session.activeOrganizationId))
        }

        // Fetch role from Better Auth's dedicated endpoint
        // We depend on the session's activeOrganizationId being correct
        const fetchRole = async () => {
            if (session?.session?.activeOrganizationId) {
                try {
                    const { data } = await authClient.organization.getActiveMemberRole()
                    if (data?.role && currentUserRole !== data.role) {
                        dispatch(setCurrentUserRole(data.role))
                    }
                } catch (error) {
                    console.error('❌ Error fetching role:', error)
                }
            }
        }

        fetchRole()
    }, [session, activeOrganizationId, currentUserRole, dispatch])

    // Auto-select first organization if user has orgs but no active org
    // Wait for session to be fully established before auto-selecting
    useEffect(() => {
        const organizations = organizationsQuery.data || []

        // Only auto-select if:
        // 1. We have organizations
        // 2. No active org is set
        // 3. Query is not loading
        // 4. Session is fully established (user exists)
        // 5. Mutation is not already running
        if (
            organizations.length > 0 &&
            !activeOrganizationId &&
            !organizationsQuery.isLoading &&
            session?.user &&
            !setActiveOrganizationMutation.isPending
        ) {
            const firstOrg = organizations[0]
            if (firstOrg?.id) {
                console.log('🔄 Auto-selecting first organization:', firstOrg.id)
                // Add small delay to ensure backend is ready after OAuth
                setTimeout(() => {
                    setActiveOrganizationMutation.mutate(firstOrg.id)
                }, 300)
            }
        }
    }, [organizationsQuery.data, activeOrganizationId, organizationsQuery.isLoading, session?.user, setActiveOrganizationMutation.isPending])

    // Derived active organization
    const activeOrganization = organizationsQuery.data?.find(org => org.id === activeOrganizationId) || null

    // Determine loading state:
    // - Show loading if organizations query is loading OR switching organization is pending
    // - Only show loading if session exists (if no session, that's a different state)
    const isLoading = session?.user 
        ? (organizationsQuery.isLoading || setActiveOrganizationMutation.isPending)
        : false

    return {
        organizations: organizationsQuery.data || [],
        isLoading,
        error: organizationsQuery.error,
        createOrganization: createOrganizationMutation.mutateAsync,
        setActiveOrganization: setActiveOrganizationMutation.mutateAsync,
        isSwitchingOrganization: setActiveOrganizationMutation.isPending,
        activeOrganizationId: activeOrganizationId || null,
        activeOrganization,
        currentUserRole, // From Redux
    }
}