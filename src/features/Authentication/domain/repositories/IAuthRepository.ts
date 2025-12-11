import { Session } from '../entities/User'

export interface LoginCredentials {
    email: string
    password: string
    callbackURL?: string
}

export interface SignupCredentials {
    name: string
    email: string
    password: string
}

export interface SocialLoginParams {
    provider: 'google' | 'github'
    callbackURL: string
}

export interface IAuthRepository {
    login(credentials: LoginCredentials): Promise<Session>
    signup(credentials: SignupCredentials): Promise<Session>
    socialSignIn(params: SocialLoginParams): Promise<void>
    logout(): Promise<void>
    getSession(): Promise<Session | null>
}
