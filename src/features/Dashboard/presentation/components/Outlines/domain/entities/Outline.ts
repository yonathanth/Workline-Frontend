export type SectionType =
    | 'TABLE_OF_CONTENTS'
    | 'EXECUTIVE_SUMMARY'
    | 'TECHNICAL_APPROACH'
    | 'DESIGN'
    | 'CAPABILITIES'
    | 'FOCUS_DOCUMENTS'
    | 'NARRATIVE'
    | 'COVER_PAGE'

export type OutlineStatus =
    | 'PENDING'
    | 'IN_PROGRESS'
    | 'COMPLETED'
    | 'ARCHIVED'

export interface Outline {
    id: string
    header: string
    sectionType: SectionType
    status: OutlineStatus
    target: number
    limit: number
    reviewerId: string
    reviewer?: {
        id: string
        name: string
        email: string
    }
    createdAt: string
    updatedAt: string
    organizationId: string
}
