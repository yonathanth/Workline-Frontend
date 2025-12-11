import { IAccountRepository } from '../../domain/repositories/IAccountRepository'

export class UpdateNameUseCase {
    constructor(private accountRepository: IAccountRepository) { }

    async execute(name: string): Promise<void> {
        return this.accountRepository.updateName(name)
    }
}
