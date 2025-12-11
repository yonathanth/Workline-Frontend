'use client'

import { AnimatePresence } from 'framer-motion'
import { Toast, ToastProps } from './Toast'

interface ToastContainerProps {
    toasts: Omit<ToastProps, 'onClose'>[]
    onClose: (id: string) => void
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onClose }) => {
    return (
        <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
            <AnimatePresence>
                {toasts.map((toast) => (
                    <Toast key={toast.id} {...toast} onClose={onClose} />
                ))}
            </AnimatePresence>
        </div>
    )
}
