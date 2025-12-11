import { authClient } from '@/lib/auth-client'
import { IAuthRepository, LoginCredentials, SignupCredentials, SocialLoginParams } from '../../domain/repositories/IAuthRepository'
import { Session } from '../../domain/entities/User'

export class AuthRepositoryImpl implements IAuthRepository {
    async login(credentials: LoginCredentials): Promise<Session> {
        const { data, error } = await authClient.signIn.email({
            email: credentials.email,
            password: credentials.password,
            callbackURL: credentials.callbackURL,
        })

        if (error) {
            throw new Error(error.message || 'Login failed')
        }

        return data as unknown as Session
    }

    async signup(credentials: SignupCredentials): Promise<Session> {
        const { data, error } = await authClient.signUp.email({
            email: credentials.email,
            password: credentials.password,
            name: credentials.name,
            callbackURL: process.env.NEXT_PUBLIC_BASE_URL + "/dashboard" || "https://workline-frontend.vercel.app/dashboard"
        })

        if (error) {
            throw new Error(error.message || 'Signup failed')
        }

        return data as unknown as Session
    }

    async socialSignIn(params: SocialLoginParams): Promise<void> {
        const { error } = await authClient.signIn.social({
            provider: params.provider,
            callbackURL: params.callbackURL,
        })

        if (error) {
            throw new Error(error.message || 'Social login failed')
        }
    }

    async logout(): Promise<void> {
        const { error } = await authClient.signOut()
        if (error) {
            throw new Error(error.message || 'Logout failed')
        }
    }

    async getSession(): Promise<Session | null> {
        const { data, error } = await authClient.getSession()
        if (error) {
            throw new Error(error.message || 'Failed to get session')
        }
        return data as unknown as Session | null
    }
}
