'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, XCircle, X } from 'lucide-react'
import { useEffect } from 'react'

export type ToastType = 'success' | 'error'

export interface ToastProps {
    id: string
    type: ToastType
    message: string
    onClose: (id: string) => void
}

export const Toast: React.FC<ToastProps> = ({ id, type, message, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose(id)
        }, 5000)

        return () => clearTimeout(timer)
    }, [id, onClose])

    const Icon = type === 'success' ? CheckCircle : XCircle
    const bgColor = type === 'success'
        ? 'bg-green-500/90 dark:bg-green-600/90'
        : 'bg-red-500/90 dark:bg-red-600/90'

    return (
        <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.3 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
            className={`${bgColor} text-white px-6 py-4 rounded-lg shadow-lg backdrop-blur-sm flex items-center gap-3 min-w-[300px] max-w-md`}
        >
            <Icon className="w-5 h-5 shrink-0" />
            <p className="flex-1 text-sm font-medium">{message}</p>
            <button
                onClick={() => onClose(id)}
                className="shrink-0 hover:bg-white/20 rounded p-1 transition-colors"
            >
                <X className="w-4 h-4" />
            </button>
        </motion.div>
    )
}
