import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface OrganizationsState {
    activeOrganizationId: string | null
    currentUserRole: string | null
}

const initialState: OrganizationsState = {
    activeOrganizationId: null,
    currentUserRole: null,
}

export const organizationsSlice = createSlice({
    name: 'organizations',
    initialState,
    reducers: {
        setActiveOrganization: (state, action: PayloadAction<string | null>) => {
            state.activeOrganizationId = action.payload
        },
        setCurrentUserRole: (state, action: PayloadAction<string | null>) => {
            state.currentUserRole = action.payload
        },
    },
})

export const { setActiveOrganization, setCurrentUserRole } = organizationsSlice.actions

export default organizationsSlice.reducer
