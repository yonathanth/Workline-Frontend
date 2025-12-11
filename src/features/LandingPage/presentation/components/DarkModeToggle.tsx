'use client'

import React from 'react'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { motion } from 'framer-motion'

const DarkModeToggle = () => {
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = React.useState(false)

    // Avoid hydration mismatch
    React.useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return null

    const isDark = theme === 'dark'

    return (
        <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1, duration: 0.3 }}
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
            className={`
                fixed bottom-14 right-8 z-50
                w-14 h-14 rounded-full
                flex items-center justify-center
                transition-all duration-300
                shadow-lg hover:shadow-2xl
                hover:scale-110 active:scale-95
                ${isDark
                    ? 'bg-white text-black hover:bg-gray-100'
                    : 'bg-black text-white hover:bg-gray-900'
                }
            `}
            aria-label="Toggle dark mode"
        >
            {isDark ? (
                <Sun className="w-6 h-6" />
            ) : (
                <Moon className="w-6 h-6" />
            )}
        </motion.button>
    )
}

export default DarkModeToggle
