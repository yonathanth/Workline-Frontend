import { IAuthRepository, SocialLoginParams } from '../../domain/repositories/IAuthRepository'

export class SocialLoginUseCase {
    constructor(private authRepository: IAuthRepository) { }

    async execute(params: SocialLoginParams): Promise<void> {
        return this.authRepository.socialSignIn(params)
    }
}
