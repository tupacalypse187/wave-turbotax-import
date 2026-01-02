import React from 'react'
import { motion } from 'framer-motion'
import ThemeToggle from '../ThemeToggle'

interface AppLayoutProps {
    children: React.ReactNode
    activeTab: 'converter' | 'dashboard'
    setActiveTab: (tab: 'converter' | 'dashboard') => void
    transactionCount: number
}

export default function AppLayout({ children, activeTab, setActiveTab, transactionCount }: AppLayoutProps) {
    return (
        <div className="min-h-screen w-full bg-slate-50 dark:bg-obsidian-950 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-300 flex flex-col">

            {/* Top Navigation Bar */}
            <header className="fixed top-0 inset-x-0 z-50 bg-white/80 dark:bg-obsidian-950/80 backdrop-blur-md border-b border-slate-200 dark:border-obsidian-800">
                <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">

                    {/* Brand */}
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-primary to-brand-secondary flex items-center justify-center text-white font-bold text-lg">
                            W
                        </div>
                        <span className="font-display font-bold text-lg tracking-tight hidden sm:inline-block">
                            Wave2TXF
                        </span>
                    </div>

                    {/* Navigation Pills */}
                    <div className="flex items-center p-1 bg-slate-100 dark:bg-zinc-900 rounded-full border border-slate-200 dark:border-zinc-800">
                        <button
                            onClick={() => setActiveTab('converter')}
                            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${activeTab === 'converter'
                                ? 'bg-white dark:bg-zinc-800 text-brand-primary shadow-sm ring-1 ring-black/5 dark:ring-white/10'
                                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                                }`}
                        >
                            Converter
                        </button>
                        <button
                            onClick={() => setActiveTab('dashboard')}
                            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${activeTab === 'dashboard'
                                ? 'bg-white dark:bg-zinc-800 text-brand-secondary shadow-sm ring-1 ring-black/5 dark:ring-white/10'
                                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                                }`}
                            disabled={transactionCount === 0}
                        >
                            Dashboard
                            {transactionCount > 0 && (
                                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold leading-none ${activeTab === 'dashboard'
                                    ? 'bg-brand-secondary/10 text-brand-secondary'
                                    : 'bg-slate-200 dark:bg-zinc-800 text-slate-500'
                                    }`}>
                                    {transactionCount}
                                </span>
                            )}
                        </button>
                    </div>

                    {/* Right Side: Badges & Theme Toggle */}
                    <div className="flex items-center gap-4">
                        {/* Trust Badges (Desktop Only) */}
                        <div className="hidden lg:flex items-center gap-3 mr-2">
                            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-medium">
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Client-Side Processing
                            </div>
                            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-400 text-xs font-medium">
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                                Privacy First
                            </div>
                        </div>

                        <ThemeToggle />
                    </div>

                </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 pt-24 pb-12 px-4 sm:px-6 relative overflow-hidden bg-slate-50 dark:bg-obsidian-950 transition-colors duration-300">
                {/* Background Decorative Blob */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -mt-20 w-96 h-96 bg-brand-primary/20 dark:bg-brand-primary/10 rounded-full blur-3xl opacity-30 animate-blob pointer-events-none"></div>

                <div className="relative z-10 max-w-6xl mx-auto">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        {children}
                    </motion.div>
                </div>
            </main>

            {/* Footer */}
            <footer className="py-8 border-t border-slate-200 dark:border-obsidian-800 bg-slate-50 dark:bg-obsidian-950">
                <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-500 dark:text-slate-400">
                    <div className="flex flex-col md:flex-row items-center gap-2 text-center md:text-left">
                        <span>&copy; {new Date().getFullYear()} Wave2TXF.</span>
                        <span className="hidden md:inline text-slate-300 dark:text-slate-600">|</span>
                        <span>Empowering small businesses with secure local financial tools.</span>
                    </div>
                    <div className="flex items-center gap-6">
                        <a href="#" className="hover:text-brand-primary transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-brand-primary transition-colors">Terms of Service</a>
                        <a href="#" className="hover:text-brand-primary transition-colors">Help Center</a>
                    </div>
                </div>
            </footer>

        </div>
    )
}
