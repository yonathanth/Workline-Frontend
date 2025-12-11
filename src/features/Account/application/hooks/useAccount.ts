import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AccountRepositoryImpl } from '../../data/repositories/AccountRepositoryImpl'
import { UpdateNameUseCase } from '../usecases/UpdateNameUseCase'
import { UpdateImageUseCase } from '../usecases/UpdateImageUseCase'
import { UpdateEmailUseCase } from '../usecases/UpdateEmailUseCase'
import { UpdatePasswordUseCase } from '../usecases/UpdatePasswordUseCase'
import { toast } from 'sonner'

const accountRepository = new AccountRepositoryImpl()
const updateNameUseCase = new UpdateNameUseCase(accountRepository)
const updateImageUseCase = new UpdateImageUseCase(accountRepository)
const updateEmailUseCase = new UpdateEmailUseCase(accountRepository)
const updatePasswordUseCase = new UpdatePasswordUseCase(accountRepository)

export const useAccount = () => {
    const queryClient = useQueryClient()

    const updateNameMutation = useMutation({
        mutationFn: (name: string) => updateNameUseCase.execute(name),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['session'] })
            toast.success("Name updated successfully")
        },
        onError: (error: any) => {
            toast.error(error.message || "Failed to update name")
        }
    })

    const updateImageMutation = useMutation({
        mutationFn: (image: string) => updateImageUseCase.execute(image),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['session'] })
            toast.success("Avatar updated successfully")
        },
        onError: (error: any) => {
            toast.error(error.message || "Failed to update avatar")
        }
    })

    const updateEmailMutation = useMutation({
        mutationFn: ({ email, password }: { email: string; password: string }) =>
            updateEmailUseCase.execute(email, password),
        onSuccess: () => {
            toast.success("Verification email sent! Please check your inbox.")
        },
        onError: (error: any) => {
            toast.error(error.message || "Failed to update email")
        }
    })

    const updatePasswordMutation = useMutation({
        mutationFn: ({ currentPassword, newPassword }: { currentPassword: string; newPassword: string }) =>
            updatePasswordUseCase.execute(currentPassword, newPassword),
        onSuccess: () => {
            toast.success("Password updated successfully")
        },
        onError: (error: any) => {
            toast.error(error.message || "Failed to update password")
        }
    })

    return {
        updateName: updateNameMutation.mutateAsync,
        isUpdatingName: updateNameMutation.isPending,
        updateImage: updateImageMutation.mutateAsync,
        isUpdatingImage: updateImageMutation.isPending,
        updateEmail: updateEmailMutation.mutateAsync,
        isUpdatingEmail: updateEmailMutation.isPending,
        updatePassword: updatePasswordMutation.mutateAsync,
        isUpdatingPassword: updatePasswordMutation.isPending,
    }
}
