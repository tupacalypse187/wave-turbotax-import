import { useTheme } from '../context/ThemeContext'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

export default function ThemeToggle() {
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = useState(false)

    useEffect(() => setMounted(true), [])

    if (!mounted) return null

    return (
        <div className="flex items-center gap-1 p-1 bg-slate-200/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-full border border-slate-300/50 dark:border-slate-700/50 shadow-sm relative">
            <button
                onClick={() => setTheme('light')}
                className={`relative z-10 p-2 rounded-full transition-colors duration-200 focus:outline-none ${theme === 'light' ? 'text-amber-500' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                    }`}
                aria-label="Light Mode"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
            </button>
            <button
                onClick={() => setTheme('system')}
                className={`relative z-10 p-2 rounded-full transition-colors duration-200 focus:outline-none ${theme === 'system' ? 'text-blue-500' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                    }`}
                aria-label="System Mode"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
            </button>
            <button
                onClick={() => setTheme('dark')}
                className={`relative z-10 p-2 rounded-full transition-colors duration-200 focus:outline-none ${theme === 'dark' ? 'text-indigo-400' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                    }`}
                aria-label="Dark Mode"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
            </button>

            {/* Sliding Indicator */}
            {mounted && (
                <motion.div
                    layoutId="theme-indicator"
                    className="absolute inset-y-1 bg-white dark:bg-slate-700 rounded-full shadow-sm z-0"
                    initial={false}
                    animate={{
                        x: theme === 'light' ? 4 : theme === 'system' ? 40 : 76,
                        width: 32
                    }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    style={{ left: 0 }}
                />
            )}
        </div>
    )
}
