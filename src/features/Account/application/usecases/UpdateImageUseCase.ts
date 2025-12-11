import { IAccountRepository } from '../../domain/repositories/IAccountRepository'

export class UpdateImageUseCase {
    constructor(private accountRepository: IAccountRepository) { }

    async execute(image: string): Promise<void> {
        return this.accountRepository.updateImage(image)
    }
}
