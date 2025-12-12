import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { OutlineRepositoryImpl } from '../../data/repositories/OutlineRepositoryImpl'
import { GetOutlinesUseCase } from '../usecases/GetOutlinesUseCase'
import { UpdateOutlineUseCase } from '../usecases/UpdateOutlineUseCase'
import { Outline } from '../../domain/entities/Outline'
import { toast } from 'sonner'

import { DeleteOutlineUseCase } from '../usecases/DeleteOutlineUseCase'

const outlineRepository = new OutlineRepositoryImpl()
const getOutlinesUseCase = new GetOutlinesUseCase(outlineRepository)
const updateOutlineUseCase = new UpdateOutlineUseCase(outlineRepository)
const deleteOutlineUseCase = new DeleteOutlineUseCase(outlineRepository)

export const useOutlines = (organizationId?: string) => {
    const queryClient = useQueryClient()

    const outlinesQuery = useQuery({
        queryKey: ['outlines', organizationId],
        queryFn: async () => {
            console.log('📡 [useOutlines] Fetching outlines for org:', organizationId)
            try {
                const result = await getOutlinesUseCase.execute(organizationId!)
                console.log('✅ [useOutlines] Outlines fetched:', result)
                return result
            } catch (error) {
                console.error('❌ [useOutlines] Error fetching outlines:', error)
                throw error
            }
        },
        enabled: !!organizationId,
        staleTime: 5 * 60 * 1000, // 5 minutes
        refetchOnWindowFocus: false,
        retry: 2,
    })

    const updateOutlineMutation = useMutation({
        mutationFn: (outline: Outline) => {
            if (!organizationId) throw new Error("Organization ID is required")
            return updateOutlineUseCase.execute(organizationId, outline)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['outlines', organizationId] })
            toast.success("Outline updated successfully")
        },
        onError: (error: any) => {
            toast.error(error.message || "Failed to update outline")
        }
    })

    const deleteOutlineMutation = useMutation({
        mutationFn: (outlineId: string) => {
            if (!organizationId) throw new Error("Organization ID is required")
            return deleteOutlineUseCase.execute(organizationId, outlineId)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['outlines', organizationId] })
            toast.success("Outline deleted successfully")
        },
        onError: (error: any) => {
            toast.error(error.message || "Failed to delete outline")
        }
    })

    return {
        outlines: outlinesQuery.data || [],
        isLoading: outlinesQuery.isLoading,
        error: outlinesQuery.error,
        updateOutline: updateOutlineMutation.mutateAsync,
        isUpdating: updateOutlineMutation.isPending,
        deleteOutline: deleteOutlineMutation.mutateAsync,
        isDeleting: deleteOutlineMutation.isPending
    }
}
