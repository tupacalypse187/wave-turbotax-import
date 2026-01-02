import React, { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'light' | 'dark' | 'system'

interface ThemeContextType {
    theme: Theme
    resolvedTheme: 'light' | 'dark'
    setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setTheme] = useState<Theme>(() => {
        const saved = localStorage.getItem('theme')
        // Validate that the saved theme is one of the allowed values
        if (saved === 'light' || saved === 'dark' || saved === 'system') {
            return saved
        }
        return 'system' // Default to system
    })

    // Track the actual applied theme (light/dark) for UI purposes
    const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light')

    useEffect(() => {
        const root = window.document.documentElement
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

        const applyTheme = () => {
            let targetTheme: 'light' | 'dark'

            if (theme === 'system') {
                targetTheme = mediaQuery.matches ? 'dark' : 'light'
            } else {
                targetTheme = theme
            }

            setResolvedTheme(targetTheme)

            root.classList.remove('light', 'dark')
            root.classList.add(targetTheme)
        }

        applyTheme()

        // Listen for system changes if mode is 'system'
        const handleChange = () => {
            if (theme === 'system') {
                applyTheme()
            }
        }

        mediaQuery.addEventListener('change', handleChange)

        // Save preference
        localStorage.setItem('theme', theme)

        return () => mediaQuery.removeEventListener('change', handleChange)
    }, [theme])

    return (
        <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useTheme() {
    const context = useContext(ThemeContext)
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider')
    }
    return context
}
