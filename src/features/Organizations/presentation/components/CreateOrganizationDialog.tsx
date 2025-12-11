import React from 'react'
import { Formik, Form, Field as FormikField, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { Loader2, Plus } from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Field,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { useOrganization } from '../../application/hooks/useOrganization'
import { useToast } from '@/features/Core/application/hooks/useToast'

const createOrgSchema = Yup.object().shape({
    name: Yup.string().required('Required'),
    slug: Yup.string().required('Required').matches(/^[a-z0-9-]+$/, 'Slug must be lowercase, numbers, and hyphens only'),
})

interface CreateOrganizationDialogProps {
    trigger?: React.ReactNode
    open?: boolean
    onOpenChange?: (open: boolean) => void
}

export const CreateOrganizationDialog: React.FC<CreateOrganizationDialogProps> = ({ trigger, open, onOpenChange }) => {
    const { createOrganization } = useOrganization()
    const { success, error } = useToast()
    const [isOpen, setIsOpen] = React.useState(false)

    // Handle controlled/uncontrolled state
    const isControlled = open !== undefined
    const show = isControlled ? open : isOpen
    const setShow = isControlled ? onOpenChange : setIsOpen

    const handleCreate = async (values: { name: string; slug: string }, { setSubmitting, resetForm }: any) => {
        try {
            await createOrganization(values)
            success("Organization created successfully")
            resetForm()
            setShow?.(false)
        } catch (err: any) {
            error(err.message || "Failed to create organization")
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <Dialog open={show} onOpenChange={setShow}>
            {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Create Organization</DialogTitle>
                    <DialogDescription>
                        Create a new organization to manage your team and projects.
                    </DialogDescription>
                </DialogHeader>
                <Formik
                    initialValues={{ name: '', slug: '' }}
                    validationSchema={createOrgSchema}
                    onSubmit={handleCreate}
                    validateOnChange={false}
                    validateOnBlur={true}
                >
                    {({ isSubmitting, errors, touched, setFieldValue, values }) => (
                        <Form className="space-y-4">
                            <FieldGroup>
                                <Field>
                                    <FieldLabel htmlFor="name">Organization Name</FieldLabel>
                                    <FormikField
                                        as={Input}
                                        id="name"
                                        name="name"
                                        placeholder="Acme Inc."
                                        className={cn(errors.name && touched.name && "border-red-500 focus-visible:ring-red-500")}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                            const name = e.target.value
                                            setFieldValue('name', name)
                                            // Auto-generate slug if slug hasn't been touched
                                            if (!touched.slug) {
                                                const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
                                                setFieldValue('slug', slug)
                                            }
                                        }}
                                    />
                                    <ErrorMessage name="name" component="div" className="text-red-500 text-sm mt-1" />
                                </Field>
                                <Field>
                                    <FieldLabel htmlFor="slug">Slug</FieldLabel>
                                    <FormikField
                                        as={Input}
                                        id="slug"
                                        name="slug"
                                        placeholder="acme-inc"
                                        className={cn(errors.slug && touched.slug && "border-red-500 focus-visible:ring-red-500")}
                                    />
                                    <ErrorMessage name="slug" component="div" className="text-red-500 text-sm mt-1" />
                                </Field>
                                <Button type="submit" className="w-full" disabled={isSubmitting}>
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Creating...
                                        </>
                                    ) : (
                                        'Create Organization'
                                    )}
                                </Button>
                            </FieldGroup>
                        </Form>
                    )}
                </Formik>
            </DialogContent>
        </Dialog>
    )
}
