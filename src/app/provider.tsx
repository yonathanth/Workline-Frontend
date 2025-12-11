'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useRef } from 'react'
import { Provider } from 'react-redux'
import { makeStore, AppStore } from '@/lib/store'
import { ThemeProvider } from 'next-themes'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

export default function AppProvider({
    children,
}: {
    children: React.ReactNode
}) {
    const storeRef = useRef<AppStore>(null)
    if (!storeRef.current) {
        // Create the store instance the first time this renders
        storeRef.current = makeStore()
    }

    const queryClientRef = useRef<QueryClient>(null)
    if (!queryClientRef.current) {
        queryClientRef.current = new QueryClient()
    }

    return (
        <Provider store={storeRef.current}>
            <QueryClientProvider client={queryClientRef.current}>
                <ReactQueryDevtools initialIsOpen={false} />
                <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
                    {children}
                </ThemeProvider>
            </QueryClientProvider>
        </Provider>
    )
}
