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
    const sessionResult = authClient.useSession()
    const session = sessionResult?.data

    const dispatch = useAppDispatch()
    const activeOrganizationId = useAppSelector((state) => state.organizations.activeOrganizationId)
    const currentUserRole = useAppSelector((state) => state.organizations.currentUserRole)

    // Debug logging
    useEffect(() => {
        console.log('🔍 [useOrganization] Session state:', {
            hasSession: !!session,
            hasUser: !!session?.user,
            sessionData: session,
            sessionResult: sessionResult
        })
    }, [session, sessionResult])

    const organizationsQuery = useQuery({
        queryKey: ['organizations'],
        queryFn: async () => {
            console.log('📡 [useOrganization] Fetching organizations...')
            try {
                const result = await getOrganizationsUseCase.execute()
                console.log('✅ [useOrganization] Organizations fetched:', result)
                return result
            } catch (error) {
                console.error('❌ [useOrganization] Error fetching organizations:', error)
                throw error
            }
        },
        enabled: !!session?.user,
        retry: 2,
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
        staleTime: 30000, // Consider data fresh for 30 seconds
    })

    // Force refetch organizations when session becomes available
    useEffect(() => {
        if (session?.user && !organizationsQuery.data && !organizationsQuery.isFetching) {
            console.log('🔄 [useOrganization] Session available, refetching organizations...')
            organizationsQuery.refetch()
        }
    }, [session?.user, organizationsQuery.data, organizationsQuery.isFetching])

    // Debug organizations query state
    useEffect(() => {
        console.log('🔍 [useOrganization] Organizations query state:', {
            isLoading: organizationsQuery.isLoading,
            isError: organizationsQuery.isError,
            error: organizationsQuery.error,
            data: organizationsQuery.data,
            enabled: !!session?.user
        })
    }, [organizationsQuery.isLoading, organizationsQuery.isError, organizationsQuery.error, organizationsQuery.data, session?.user])

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
            console.log('🔄 [useOrganization] Setting active org from session:', session.session.activeOrganizationId)
            dispatch(setActiveOrgRedux(session.session.activeOrganizationId))
        }

        // Fetch role from Better Auth's dedicated endpoint
        // We depend on the session's activeOrganizationId being correct
        const fetchRole = async () => {
            if (session?.session?.activeOrganizationId) {
                try {
                    console.log('🔍 [useOrganization] Fetching role for org:', session.session.activeOrganizationId)
                    const { data } = await authClient.organization.getActiveMemberRole()

                    if (data?.role && currentUserRole !== data.role) {
                        console.log('✅ [useOrganization] Role fetched:', data.role)
                        dispatch(setCurrentUserRole(data.role))
                    }
                } catch (error) {
                    console.error('❌ [useOrganization] Error fetching role:', error)
                }
            }
        }

        fetchRole()
    }, [session, activeOrganizationId, currentUserRole, dispatch])

    // Auto-select first organization if user has orgs but no active org
    useEffect(() => {
        const organizations = organizationsQuery.data || []
        if (organizations.length > 0 && !activeOrganizationId && !organizationsQuery.isLoading) {
            const firstOrg = organizations[0]
            if (firstOrg?.id) {
                console.log('🔄 [useOrganization] Auto-selecting first organization:', firstOrg.id)
                setActiveOrganizationMutation.mutate(firstOrg.id)
            }
        }
    }, [organizationsQuery.data, activeOrganizationId, organizationsQuery.isLoading, setActiveOrganizationMutation])


    // Derived active organization
    const activeOrganization = organizationsQuery.data?.find(org => org.id === activeOrganizationId) || null

    // Determine loading state:
    // - Only show loading if session exists with a user AND organizations are still loading
    // - Don't show loading if session is undefined (waiting for auth) or if there's no user (not authenticated)
    // This prevents infinite loading states when session hasn't loaded yet
    const isLoading = session?.user ? organizationsQuery.isLoading : false

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
