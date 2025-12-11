import { AuthResponse, LoginCredentials, SignupData, User } from '../entities/User'

export interface AuthRepository {
    login(credentials: LoginCredentials): Promise<AuthResponse>
    signup(data: SignupData): Promise<AuthResponse>
    logout(): Promise<void>
    getCurrentUser(): Promise<User | null>
}
