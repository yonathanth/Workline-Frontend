"use client"

import * as React from "react"
import { Formik, Form, Field as FormikField, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2 } from "lucide-react"
import { useOrganization } from "@/features/Organizations/application/hooks/useOrganization"
import { OutlineRepositoryImpl } from "../../data/repositories/OutlineRepositoryImpl"
import { CreateOutlineUseCase } from "../../application/usecases/CreateOutlineUseCase"
import { toast } from "sonner"
import { useQueryClient } from "@tanstack/react-query"
import { cn } from "@/lib/utils"
import { useOrganizationMembers } from "@/features/Organizations/presentation/hooks/useOrganizationMembers"

const outlineRepository = new OutlineRepositoryImpl()
const createOutlineUseCase = new CreateOutlineUseCase(outlineRepository)

const createOutlineSchema = Yup.object().shape({
    header: Yup.string().required('Header is required'),
    sectionType: Yup.string().required('Section type is required'),
    status: Yup.string().required('Status is required'),
    target: Yup.number(),
    limit: Yup.number(),
    reviewerId: Yup.string(),
})

interface CreateOutlineDialogProps {
    trigger?: React.ReactNode
    open?: boolean
    onOpenChange?: (open: boolean) => void
}

export function CreateOutlineDialog({ trigger, open, onOpenChange }: CreateOutlineDialogProps) {
    const [internalOpen, setInternalOpen] = React.useState(false)
    const isControlled = open !== undefined
    const isOpen = isControlled ? open : internalOpen
    const setIsOpen = isControlled ? onOpenChange! : setInternalOpen

    const { activeOrganizationId } = useOrganization()
    const queryClient = useQueryClient()

    const { data: members } = useOrganizationMembers(activeOrganizationId)

    // Filter members for reviewers (Owner or Admin)
    const reviewers = members?.filter(member =>
        member.role === 'owner' || member.role === 'admin'
    ) || []

    const handleCreate = async (values: any, { resetForm }: any) => {
        if (!activeOrganizationId) {
            toast.error("No active organization selected")
            return
        }

        try {
            await createOutlineUseCase.execute(activeOrganizationId, {
                header: values.header,
                sectionType: values.sectionType,
                status: values.status,
                target: parseInt(values.target) || 0,
                limit: parseInt(values.limit) || 0,
                reviewerId: values.reviewerId,
            })

            toast.success("Outline created successfully!")

            // Invalidate and refetch to ensure UI updates
            await queryClient.invalidateQueries({ queryKey: ['outlines', activeOrganizationId] })

            resetForm()
            setIsOpen(false)
        } catch (error) {
            console.error("Failed to create outline:", error)
            toast.error("Failed to create outline. Please try again.")
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Create New Outline</DialogTitle>
                    <DialogDescription>
                        Add a new outline to your organization
                    </DialogDescription>
                </DialogHeader>
                <Formik
                    initialValues={{
                        header: '',
                        sectionType: '',
                        status: 'PENDING',
                        target: '',
                        limit: '',
                        reviewerId: '',
                    }}
                    validationSchema={createOutlineSchema}
                    onSubmit={handleCreate}
                    validateOnChange={false}
                    validateOnBlur={true}
                >
                    {({ isSubmitting, errors, touched, setFieldValue, values }) => (
                        <Form className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="header">Header</Label>
                                <FormikField
                                    as={Input}
                                    id="header"
                                    name="header"
                                    placeholder="Executive Summary"
                                    className={cn(errors.header && touched.header && "border-red-500")}
                                />
                                <ErrorMessage name="header" component="div" className="text-red-500 text-sm" />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="sectionType">Section Type</Label>
                                    <Select
                                        value={values.sectionType}
                                        onValueChange={(value) => setFieldValue('sectionType', value)}
                                    >
                                        <SelectTrigger id="sectionType" className={cn(errors.sectionType && touched.sectionType && "border-red-500")}>
                                            <SelectValue placeholder="Select type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="TABLE_OF_CONTENTS">Table of Contents</SelectItem>
                                            <SelectItem value="EXECUTIVE_SUMMARY">Executive Summary</SelectItem>
                                            <SelectItem value="TECHNICAL_APPROACH">Technical Approach</SelectItem>
                                            <SelectItem value="DESIGN">Design</SelectItem>
                                            <SelectItem value="CAPABILITIES">Capabilities</SelectItem>
                                            <SelectItem value="FOCUS_DOCUMENTS">Focus Documents</SelectItem>
                                            <SelectItem value="NARRATIVE">Narrative</SelectItem>
                                            <SelectItem value="COVER_PAGE">Cover Page</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <ErrorMessage name="sectionType" component="div" className="text-red-500 text-sm" />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="status">Status</Label>
                                    <Select
                                        value={values.status}
                                        onValueChange={(value) => setFieldValue('status', value)}
                                    >
                                        <SelectTrigger id="status">
                                            <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="PENDING">Pending</SelectItem>
                                            <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                                            <SelectItem value="COMPLETED">Completed</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="target">Target (pages)</Label>
                                    <FormikField
                                        as={Input}
                                        id="target"
                                        name="target"
                                        type="number"
                                        placeholder="10"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="limit">Limit (pages)</Label>
                                    <FormikField
                                        as={Input}
                                        id="limit"
                                        name="limit"
                                        type="number"
                                        placeholder="15"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="reviewerId">Reviewer</Label>
                                <Select
                                    value={values.reviewerId}
                                    onValueChange={(value) => setFieldValue('reviewerId', value)}
                                >
                                    <SelectTrigger id="reviewerId">
                                        <SelectValue placeholder="Select reviewer" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {reviewers.map((reviewer) => (
                                            <SelectItem key={reviewer.id} value={reviewer.user.id}>
                                                {reviewer.user.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <Button type="submit" className="w-full" disabled={isSubmitting}>
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Creating...
                                    </>
                                ) : (
                                    'Create Outline'
                                )}
                            </Button>
                        </Form>
                    )}
                </Formik>
            </DialogContent>
        </Dialog>
    )
}
