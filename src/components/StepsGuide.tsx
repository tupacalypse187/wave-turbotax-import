import React from 'react'

export default function StepsGuide() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 relative">
            {/* Connector Line (Desktop) */}
            <div className="hidden md:block absolute top-8 left-1/6 right-1/6 h-0.5 bg-slate-200 dark:bg-zinc-800 -z-10"></div>

            {/* Step 1 */}
            <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-brand-primary text-white flex items-center justify-center font-display font-bold text-xl shadow-lg shadow-brand-primary/20 relative z-10 ring-4 ring-slate-50 dark:ring-obsidian-950">
                    1
                </div>
                <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Export from Wave</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Go to your Business &gt; Business Settings &gt; Data Export &gt; Export CSV.
                    </p>
                </div>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-brand-primary text-white flex items-center justify-center font-display font-bold text-xl shadow-lg shadow-brand-primary/20 relative z-10 ring-4 ring-slate-50 dark:ring-obsidian-950">
                    2
                </div>
                <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Upload & Review</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Drop the file here to see your financial dashboard.
                    </p>
                </div>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-brand-primary text-white flex items-center justify-center font-display font-bold text-xl shadow-lg shadow-brand-primary/20 relative z-10 ring-4 ring-slate-50 dark:ring-obsidian-950">
                    3
                </div>
                <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Import to TurboTax</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Download the TXF and import it into TurboTax Business.
                    </p>
                </div>
            </div>
        </div>
    )
}
