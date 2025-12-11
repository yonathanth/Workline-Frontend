import { IAuthRepository, LoginCredentials } from '../../domain/repositories/IAuthRepository'
import { Session } from '../../domain/entities/User'

export class LoginUseCase {
    constructor(private authRepository: IAuthRepository) { }

    async execute(credentials: LoginCredentials): Promise<Session> {
        return this.authRepository.login(credentials)
    }
}
