import { useAtom } from 'jotai'
import React, { useCallback } from 'react'
import { transactionsAtom, availableYearsAtom, selectedYearAtom } from '../store'
import { convertToTXF } from '../utils/txfConverter'

export default function DataPreview() {
  const [transactions] = useAtom(transactionsAtom)
  const [availableYears] = useAtom(availableYearsAtom)
  const [selectedYear, setSelectedYear] = useAtom(selectedYearAtom)

  const getFilteredTransactions = () => {
    let filtered = transactions.filter(t =>
      t['Account Name'] !== 'Owner Investment / Drawings' &&
      t['Account Name'] !== 'Cash on Hand'
    )

    if (selectedYear) {
      filtered = filtered.filter(t => {
        const dateStr = t['Transaction Date'] || ''
        return dateStr.startsWith(selectedYear)
      })
    }
    return filtered
  }

  const filteredTransactions = getFilteredTransactions()

  const handleConvert = useCallback(() => {
    const txfData = convertToTXF(filteredTransactions, 'NeuralSec Advisory')

    const blob = new Blob([txfData], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'neuralsec_tax_import.txf'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }, [filteredTransactions])

  if (transactions.length === 0) {
    return null
  }

  const remainingCount = transactions.length - 30

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* Header Stats Bar */}
      <div className="flex items-center justify-between p-6 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl shadow-sm">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-brand-secondary/10 text-brand-secondary rounded-xl">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-display font-bold text-slate-900 dark:text-white">{transactions.length} Transactions Loaded</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">Ready for processing</p>
          </div>
        </div>

        {availableYears.length > 1 && (
          <div className="flex items-center gap-3 p-1.5 bg-slate-100 dark:bg-obsidian-950 rounded-lg border border-slate-200 dark:border-obsidian-800">
            {availableYears.map(year => (
              <button
                key={year}
                onClick={() => setSelectedYear(selectedYear === year ? '' : year)}
                className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${selectedYear === year
                  ? 'bg-brand-primary text-white shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
              >
                {year}
              </button>
            ))}
            <button
              onClick={() => setSelectedYear('')}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${!selectedYear
                ? 'bg-brand-primary text-white shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
            >
              All
            </button>
          </div>
        )}

        <button
          className="px-4 py-2 text-xs font-bold uppercase tracking-wide text-slate-400 hover:text-red-500 transition-colors"
          onClick={() => window.location.reload()}
        >
          Reset
        </button>
      </div>

      {/* Main Action Button */}
      <button
        onClick={handleConvert}
        className="group w-full py-5 bg-gradient-to-r from-brand-primary to-purple-600 hover:from-brand-primary/90 hover:to-purple-600/90 text-white font-display font-bold text-lg rounded-2xl shadow-xl shadow-brand-primary/20 transition-all transform hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-3 border border-white/10"
      >
        <svg className="w-6 h-6 group-hover:animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        Generate & Download TXF
      </button>

      {/* Data Grid */}
      <div className="bg-white dark:bg-obsidian-900 border border-slate-200 dark:border-obsidian-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-200 dark:border-obsidian-800 bg-slate-50/50 dark:bg-obsidian-950/30 flex justify-between items-center">
          <h4 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Data Preview</h4>
          <span className="text-xs font-mono text-slate-400 bg-slate-100 dark:bg-obsidian-800 px-2 py-1 rounded">
            {filteredTransactions.length} ROWS
          </span>
        </div>

        <div className="overflow-x-auto max-h-[500px] scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-obsidian-700">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr>
                {Object.keys(filteredTransactions[0] || {}).map((header) => (
                  <th key={header} className="p-4 border-b border-slate-200 dark:border-obsidian-800 bg-slate-50 dark:bg-obsidian-900/95 backdrop-blur-sm text-[10px] font-bold text-slate-400 uppercase tracking-widest sticky top-0 z-10">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-obsidian-800">
              {filteredTransactions.slice(0, 50).map((row, index) => (
                <tr key={index} className="group hover:bg-slate-50 dark:hover:bg-obsidian-800/50 transition-colors">
                  {Object.values(row).map((cell, i) => (
                    <td key={i} className="p-4 text-xs font-medium text-slate-600 dark:text-slate-300 whitespace-nowrap group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                      {cell as React.ReactNode}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {remainingCount > 0 && (
          <div className="p-4 text-center text-xs font-medium text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-obsidian-800 bg-slate-50 dark:bg-obsidian-950/30">
            +{remainingCount} more rows hidden
          </div>
        )}
      </div>

    </div>
  )
}
