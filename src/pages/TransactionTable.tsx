import { useState, useMemo } from 'react'
import { Transaction } from '../types'

interface TransactionTableProps {
  transactions: Transaction[]
  selectedCategory?: string
  onCategoryFilter?: (category: string) => void
}

type SortConfig = {
  key: keyof Transaction | 'Amount'
  direction: 'asc' | 'desc'
}

export default function TransactionTable({ transactions, selectedCategory, onCategoryFilter }: TransactionTableProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'Transaction Date', direction: 'desc' })
  const itemsPerPage = 25

  // Filter transactions
  const filteredTransactions = useMemo(() => {
    let filtered = transactions.filter(t =>
      t['Account Name'] !== 'Owner Investment / Drawings'
    )

    // Category Filter
    if (selectedCategory) {
      filtered = filtered.filter(t => t['Account Name'] === selectedCategory)
    }

    // Search Filter
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase()
      filtered = filtered.filter(t =>
        Object.values(t).some(val =>
          String(val || '').toLowerCase().includes(lowerSearch)
        )
      )
    }

    // Sorting
    return filtered.sort((a, b) => {
      let aValue: any = a[sortConfig.key as keyof Transaction] || ''
      let bValue: any = b[sortConfig.key as keyof Transaction] || ''

      // Special handling for Amount to sort numerically
      if (sortConfig.key === 'Amount' || sortConfig.key === 'Amount (One column)') {
        aValue = parseFloat(String(a['Amount (One column)'] || '0').replace(/[^0-9.-]+/g, ''))
        bValue = parseFloat(String(b['Amount (One column)'] || '0').replace(/[^0-9.-]+/g, ''))
      } else if (sortConfig.key === 'Transaction Date') {
        aValue = new Date(aValue).getTime()
        bValue = new Date(bValue).getTime()
      }

      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1
      return 0
    })
  }, [transactions, selectedCategory, searchTerm, sortConfig])

  // Get unique categories for dropdown
  const categories = useMemo(() => {
    const cats = Array.from(new Set(
      transactions
        .filter(t => t['Account Name'] !== 'Owner Investment / Drawings')
        .map(t => t['Account Name'] || 'Unknown')
    )).sort()
    return ['All Categories', ...cats]
  }, [transactions])

  // Pagination
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedTransactions = filteredTransactions.slice(startIndex, startIndex + itemsPerPage)

  const handleCategoryChange = (val: string) => {
    if (val === 'All Categories') {
      onCategoryFilter?.('')
    } else {
      onCategoryFilter?.(val)
    }
    setCurrentPage(1)
  }

  const handleSort = (key: keyof Transaction | 'Amount') => {
    setSortConfig(current => ({
      key,
      direction: current.key === key && current.direction === 'desc' ? 'asc' : 'desc'
    }))
  }

  const formatCurrency = (amount: string) => {
    const num = parseFloat(amount) || 0
    return `$${Math.abs(num).toFixed(2)}`
  }

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl overflow-hidden shadow-xl animate-in fade-in zoom-in-95 duration-500">
      <div className="p-6 space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-1">
            <h3 className="text-lg font-semibold text-white">Transactions</h3>
            <p className="text-sm text-slate-400">
              Detailed view of all imported data
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {/* Search Input */}
            <div className="relative group w-full md:w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-4 w-4 text-slate-400 group-focus-within:text-indigo-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search..."
                className="block w-full pl-10 pr-3 py-2 border border-slate-700 rounded-lg leading-5 bg-slate-900/50 text-slate-300 placeholder-slate-500 focus:outline-none focus:bg-slate-900 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all"
              />
            </div>

            {/* Category Filter Dropdown */}
            <div className="relative w-full md:w-48">
              <select
                value={selectedCategory || 'All Categories'}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="block w-full pl-3 pr-10 py-2 text-base border-slate-700 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-lg bg-slate-900/50 text-slate-300 appearance-none"
              >
                {categories.map(category => (
                  <option key={category} value={category === 'All Categories' ? '' : category} className="bg-slate-800">
                    {category}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* Clear Filter Button */}
            {(selectedCategory || searchTerm) && (
              <button
                onClick={() => {
                  handleCategoryChange('All Categories')
                  setSearchTerm('')
                }}
                className="px-3 py-2 bg-slate-700/50 text-slate-300 rounded-lg text-sm hover:bg-slate-700 hover:text-white transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Responsive Table */}
        <div className="overflow-x-auto rounded-lg border border-slate-700/50">
          <table className="w-full text-sm text-left text-slate-400">
            <thead className="text-xs text-slate-400 uppercase bg-slate-900/50">
              <tr>
                <th className="px-6 py-3 cursor-pointer hover:text-white transition-colors group" onClick={() => handleSort('Transaction Date')}>
                  <div className="flex items-center gap-1">
                    Date
                    {sortConfig.key === 'Transaction Date' && (
                      <span className="text-indigo-400">{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </th>
                <th className="px-6 py-3 cursor-pointer hover:text-white transition-colors group" onClick={() => handleSort('Transaction Description')}>
                  <div className="flex items-center gap-1">
                    Description
                    {sortConfig.key === 'Transaction Description' && (
                      <span className="text-indigo-400">{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </th>
                <th className="px-6 py-3 cursor-pointer hover:text-white transition-colors group" onClick={() => handleSort('Account Name')}>
                  <div className="flex items-center gap-1">
                    Category
                    {sortConfig.key === 'Account Name' && (
                      <span className="text-indigo-400">{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </th>
                <th className="px-6 py-3 text-right cursor-pointer hover:text-white transition-colors group" onClick={() => handleSort('Amount')}>
                  <div className="flex items-center justify-end gap-1">
                    Amount
                    {sortConfig.key === 'Amount' && (
                      <span className="text-indigo-400">{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedTransactions.length > 0 ? (
                paginatedTransactions.map((transaction, index) => (
                  <tr
                    key={index}
                    className="bg-transparent border-b border-slate-800 hover:bg-slate-700/30 transition-colors"
                  >
                    <td className="px-6 py-4 font-medium text-slate-200 whitespace-nowrap">
                      {new Date(transaction['Transaction Date'] || '').toLocaleDateString(undefined, { year: 'numeric', month: '2-digit', day: '2-digit' })}
                    </td>
                    <td className="px-6 py-4 text-slate-300">
                      <div className="max-w-md truncate" title={transaction['Transaction Description']}>
                        {transaction['Transaction Description'] || transaction['Transaction Line Description']}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleCategoryChange(transaction['Account Name'] || 'Unknown')}
                        className="text-indigo-400 hover:text-indigo-300 hover:underline transition-colors text-xs font-medium bg-indigo-500/10 px-2 py-1 rounded border border-indigo-500/20"
                      >
                        {transaction['Account Name'] || 'Unknown'}
                      </button>
                    </td>
                    <td className={`px-6 py-4 text-right font-medium ${(parseFloat(transaction['Amount (One column)'] || '0') < 0) ? 'text-red-400' : 'text-emerald-400'}`}>
                      {formatCurrency(transaction['Amount (One column)'] || '0')}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                    <p className="text-lg">No transactions found</p>
                    <p className="text-sm">Try adjusting your search or filters</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-4 border-t border-slate-700/50">
            <div className="text-sm text-slate-500">
              Showing <span className="text-white font-medium">{Math.min((currentPage - 1) * itemsPerPage + 1, filteredTransactions.length)}</span> to <span className="text-white font-medium">{Math.min(currentPage * itemsPerPage, filteredTransactions.length)}</span> of <span className="text-white font-medium">{filteredTransactions.length}</span> entries
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 bg-slate-800 border border-slate-700 rounded-md text-sm text-slate-300 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 bg-slate-800 border border-slate-700 rounded-md text-sm text-slate-300 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}