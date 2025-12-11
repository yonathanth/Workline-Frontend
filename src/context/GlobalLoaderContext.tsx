"use client"

import React, { createContext, useContext, useState, ReactNode } from 'react'

interface GlobalLoaderContextType {
    isLoading: boolean
    showLoader: () => void
    hideLoader: () => void
}

const GlobalLoaderContext = createContext<GlobalLoaderContextType | undefined>(undefined)

export function GlobalLoaderProvider({ children }: { children: ReactNode }) {
    const [isLoading, setIsLoading] = useState(false)

    const showLoader = () => setIsLoading(true)
    const hideLoader = () => setIsLoading(false)

    return (
        <GlobalLoaderContext.Provider value={{ isLoading, showLoader, hideLoader }}>
            {children}
        </GlobalLoaderContext.Provider>
    )
}

export function useGlobalLoader() {
    const context = useContext(GlobalLoaderContext)
    if (context === undefined) {
        throw new Error('useGlobalLoader must be used within a GlobalLoaderProvider')
    }
    return context
}
