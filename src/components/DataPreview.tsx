import { useAtom } from 'jotai'
import { useCallback } from 'react'
import { transactionsAtom } from '../store'
import { convertToTXF } from '../utils/txfConverter'

export default function DataPreview() {
  const [transactions] = useAtom(transactionsAtom)

  const handleConvert = useCallback(() => {
    const txfData = convertToTXF(transactions, 'NeuralSec Advisory')

    const blob = new Blob([txfData], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'neuralsec_tax_import.txf'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }, [transactions])

  if (transactions.length === 0) {
    return null
  }

  const headers = Object.keys(transactions[0])
  const displayCount = 30
  const remainingCount = transactions.length - displayCount

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between p-4 bg-emerald-50 border border-emerald-100 dark:bg-emerald-500/10 dark:border-emerald-500/20 rounded-xl transition-colors">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 rounded-full">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-800 dark:text-white">{transactions.length} Transactions Loaded</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">Ready for conversion and analysis</p>
          </div>
        </div>
        <button
          className="px-4 py-2 text-sm text-slate-500 hover:text-slate-800 hover:bg-slate-200 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-700/50 rounded-lg transition-colors"
          onClick={() => window.location.reload()}
        >
          Clear
        </button>
      </div>

      <button
        onClick={handleConvert}
        className="w-full py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-purple-500/25 transition-all transform hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        Generate & Download TXF
      </button>

      <div className="bg-slate-50 dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700/50 rounded-xl overflow-hidden mt-8 transition-colors">
        <div className="p-4 border-b border-slate-200 dark:border-slate-700/50 bg-white dark:bg-transparent">
          <h4 className="text-slate-800 dark:text-white font-medium">Data Preview</h4>
        </div>
        <div className="overflow-x-auto max-h-96">
          <table className="w-full text-sm text-left text-slate-600 dark:text-slate-400">
            <thead className="text-xs text-slate-500 uppercase bg-slate-100 dark:bg-slate-900/50 sticky top-0 backdrop-blur-md">
              <tr>
                {headers.map((header) => (
                  <th key={header} className="px-6 py-3 whitespace-nowrap font-semibold text-slate-700 dark:text-indigo-300/80 tracking-wider bg-slate-100 dark:bg-slate-900/90">{header}</th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-transparent divide-y divide-slate-200 dark:divide-slate-700/50">
              {transactions.slice(0, displayCount).map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                  {headers.map((header) => (
                    <td key={`${idx}-${header}`} className="px-6 py-3 whitespace-nowrap">
                      {String(row[header as keyof typeof row] ?? '')}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {remainingCount > 0 && (
          <div className="p-3 text-center text-xs text-slate-500 bg-slate-100 dark:bg-slate-900/30 border-t border-slate-200 dark:border-slate-700/50">
            ...and {remainingCount} more rows
          </div>
        )}
      </div>

      <p className="text-center text-slate-400 dark:text-slate-500 text-xs mt-4">
        Your data never leaves your browser. All processing is done locally.
      </p>
    </div>
  )
}
