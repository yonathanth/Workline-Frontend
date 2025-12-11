export interface IAccountRepository {
    updateName(name: string): Promise<void>
    updateImage(image: string): Promise<void>
    updateEmail(email: string, password: string): Promise<void>
    updatePassword(currentPassword: string, newPassword: string): Promise<void>
}
