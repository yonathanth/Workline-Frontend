import { IAccountRepository } from '../../domain/repositories/IAccountRepository'

export class UpdateEmailUseCase {
    constructor(private accountRepository: IAccountRepository) { }

    async execute(email: string, password: string): Promise<void> {
        return this.accountRepository.updateEmail(email, password)
    }
}
