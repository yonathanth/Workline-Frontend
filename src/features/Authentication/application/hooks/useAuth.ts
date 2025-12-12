import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AuthRepositoryImpl } from '../../data/repositories/AuthRepositoryImpl'
import { LoginUseCase } from '../../application/usecases/LoginUseCase'
import { SignupUseCase } from '../../application/usecases/SignupUseCase'
import { SocialLoginUseCase } from '../../application/usecases/SocialLoginUseCase'
import { LoginCredentials, SignupCredentials, SocialLoginParams } from '../../domain/repositories/IAuthRepository'
import { authClient } from '@/lib/auth-client'

// Initialize repository and use cases
// In a real app, these might be injected via a DI container or context
const authRepository = new AuthRepositoryImpl()
const loginUseCase = new LoginUseCase(authRepository)
const signupUseCase = new SignupUseCase(authRepository)
const socialLoginUseCase = new SocialLoginUseCase(authRepository)

export const useAuth = () => {
    const queryClient = useQueryClient()

    const loginMutation = useMutation({
        mutationFn: (credentials: LoginCredentials) => loginUseCase.execute(credentials),
        onSuccess: async (data) => {
            // Set the session data in React Query cache
            queryClient.setQueryData(['session'], data)
            // Refetch the session using better-auth's method to ensure it's up to date
            // This ensures better-auth's internal state is updated
            await authClient.getSession()
            // Invalidate all queries that depend on session to trigger refetch
            await queryClient.invalidateQueries({ queryKey: ['session'] })
            await queryClient.invalidateQueries({ queryKey: ['organizations'] })
        },
    })

    const signupMutation = useMutation({
        mutationFn: (credentials: SignupCredentials) => signupUseCase.execute(credentials),
        onSuccess: async (data) => {
            // Set the session data in React Query cache
            queryClient.setQueryData(['session'], data)
            // Refetch the session using better-auth's method to ensure it's up to date
            // This ensures better-auth's internal state is updated
            await authClient.getSession()
            // Invalidate all queries that depend on session to trigger refetch
            await queryClient.invalidateQueries({ queryKey: ['session'] })
            await queryClient.invalidateQueries({ queryKey: ['organizations'] })
        },
    })

    const socialLoginMutation = useMutation({
        mutationFn: (params: SocialLoginParams) => socialLoginUseCase.execute(params),
        onSuccess: async () => {
            // Refetch the session using better-auth's method
            // This ensures better-auth's internal state is updated
            await authClient.getSession()
            // Invalidate all queries that depend on session to trigger refetch
            await queryClient.invalidateQueries({ queryKey: ['session'] })
            await queryClient.invalidateQueries({ queryKey: ['organizations'] })
        },
    })

    return {
        login: loginMutation.mutateAsync,
        signup: signupMutation.mutateAsync,
        socialLogin: socialLoginMutation.mutateAsync,
        isLoading: loginMutation.isPending || signupMutation.isPending || socialLoginMutation.isPending,
        error: loginMutation.error || signupMutation.error || socialLoginMutation.error,
    }
}
