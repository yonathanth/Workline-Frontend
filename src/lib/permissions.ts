import { MemberRole } from "@/features/Organizations/domain/entities/Organization"

/**
 * Permission definitions for role-based access control
 */
export const Permissions = {
    /**
     * Can access the Members page/tab
     */
    ACCESS_MEMBERS: [MemberRole.OWNER, MemberRole.ADMIN],

    /**
     * Can delete members from the organization
     */
    DELETE_MEMBER: [MemberRole.OWNER, MemberRole.ADMIN],

    /**
     * Can update member roles
     */
    UPDATE_MEMBER_ROLE: [MemberRole.OWNER],

    /**
     * Can invite new members
     */
    INVITE_MEMBER: [MemberRole.OWNER, MemberRole.ADMIN],

    /**
     * Can view and manage sent invitations
     */
    MANAGE_INVITATIONS: [MemberRole.OWNER, MemberRole.ADMIN],

    /**
     * Can manage organization settings
     */
    MANAGE_ORGANIZATION: [MemberRole.OWNER],
} as const

/**
 * Check if a user role has a specific permission
 */
export function hasPermission(
    userRole: string | null | undefined,
    permission: readonly MemberRole[]
): boolean {
    if (!userRole) return false
    return permission.includes(userRole as MemberRole)
}

/**
 * Permission check helpers
 */
export const PermissionChecks = {
    canAccessMembers: (role: string | null | undefined) =>
        hasPermission(role, Permissions.ACCESS_MEMBERS),

    canDeleteMember: (role: string | null | undefined) =>
        hasPermission(role, Permissions.DELETE_MEMBER),

    canUpdateMemberRole: (role: string | null | undefined) =>
        hasPermission(role, Permissions.UPDATE_MEMBER_ROLE),

    canInviteMember: (role: string | null | undefined) =>
        hasPermission(role, Permissions.INVITE_MEMBER),

    canManageOrganization: (role: string | null | undefined) =>
        hasPermission(role, Permissions.MANAGE_ORGANIZATION),

    canManageInvitations: (role: string | null | undefined) =>
        hasPermission(role, Permissions.MANAGE_INVITATIONS),
}
