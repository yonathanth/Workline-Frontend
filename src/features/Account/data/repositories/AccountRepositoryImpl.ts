import { authClient } from '@/lib/auth-client'
import { IAccountRepository } from '../../domain/repositories/IAccountRepository'

export class AccountRepositoryImpl implements IAccountRepository {
    async updateName(name: string): Promise<void> {
        await authClient.updateUser({ name })
    }

    async updateImage(image: string): Promise<void> {
        await authClient.updateUser({ image })
    }

    async updateEmail(email: string, password: string): Promise<void> {
        await authClient.changeEmail({ newEmail: email })
    }

    async updatePassword(currentPassword: string, newPassword: string): Promise<void> {
        await authClient.changePassword({ currentPassword, newPassword })
    }
}
