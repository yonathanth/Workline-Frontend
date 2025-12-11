import { IAccountRepository } from '../../domain/repositories/IAccountRepository'

export class UpdatePasswordUseCase {
    constructor(private accountRepository: IAccountRepository) { }

    async execute(currentPassword: string, newPassword: string): Promise<void> {
        return this.accountRepository.updatePassword(currentPassword, newPassword)
    }
}
