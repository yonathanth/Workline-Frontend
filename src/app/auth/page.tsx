import AuthScreen from '@/features/Authentication/presentation/screen/AuthScreen'
import { Suspense } from 'react'

export default function AuthPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <AuthScreen />
        </Suspense>
    )
}
