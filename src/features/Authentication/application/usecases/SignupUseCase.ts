import { IAuthRepository, SignupCredentials } from '../../domain/repositories/IAuthRepository'
import { Session } from '../../domain/entities/User'

export class SignupUseCase {
    constructor(private authRepository: IAuthRepository) { }

    async execute(credentials: SignupCredentials): Promise<Session> {
        return this.authRepository.signup(credentials)
    }
}
