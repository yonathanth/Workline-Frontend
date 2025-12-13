import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AuthRepositoryImpl } from '../../data/repositories/AuthRepositoryImpl'
import { LoginUseCase } from '../../application/usecases/LoginUseCase'
import { SignupUseCase } from '../../application/usecases/SignupUseCase'
import { SocialLoginUseCase } from '../../application/usecases/SocialLoginUseCase'
import { LoginCredentials, SignupCredentials, SocialLoginParams } from '../../domain/repositories/IAuthRepository'

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
        onSuccess: (data) => {
            queryClient.setQueryData(['session'], data)
        },
    })

    const signupMutation = useMutation({
        mutationFn: (credentials: SignupCredentials) => signupUseCase.execute(credentials),
        onSuccess: (data) => {
            queryClient.setQueryData(['session'], data)
        },
    })

    const socialLoginMutation = useMutation({
        mutationFn: (params: SocialLoginParams) => socialLoginUseCase.execute(params),
    })

    return {
        login: loginMutation.mutateAsync,
        signup: signupMutation.mutateAsync,
        socialLogin: socialLoginMutation.mutateAsync,
        isLoading: loginMutation.isPending || signupMutation.isPending || socialLoginMutation.isPending,
        error: loginMutation.error || signupMutation.error || socialLoginMutation.error,
    }
}
