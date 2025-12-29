import { useState, useMemo } from 'react'
import { Card, CardContent } from '@/components/ui/Card'

interface TransactionTableProps {
  transactions: any[]
  selectedCategory?: string
  onCategoryFilter?: (category: string) => void
}

export default function TransactionTable({ transactions, selectedCategory, onCategoryFilter }: TransactionTableProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 25

  // Filter transactions
  const filteredTransactions = useMemo(() => {
    let filtered = transactions.filter(t => 
      t['Account Name'] !== 'Owner Investment / Drawings'
    )
    
    if (selectedCategory) {
      filtered = filtered.filter(t => t['Account Name'] === selectedCategory)
    }
    
    return filtered.sort((a, b) => 
      new Date(b['Transaction Date']).getTime() - new Date(a['Transaction Date']).getTime()
    )
  }, [transactions, selectedCategory])

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

  const handleCategoryChange = (category: string) => {
    if (category === 'All Categories') {
      onCategoryFilter?.('')
    } else {
      onCategoryFilter?.(category)
    }
    setCurrentPage(1)
  }

  const formatCurrency = (amount: string) => {
    const num = parseFloat(amount) || 0
    return `$${Math.abs(num).toFixed(2)}`
  }

  if (transactions.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Transactions</h3>
          <div className="text-center text-gray-500 py-8">
            <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p>No transactions available</p>
            <p className="text-sm text-gray-400 mt-1">Upload a CSV file to see transactions</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Transactions</h3>
          <div className="flex items-center gap-4">
            {/* Category Filter Dropdown */}
            <select
              value={selectedCategory || 'All Categories'}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {categories.map(category => (
                <option key={category} value={category === 'All Categories' ? '' : category}>
                  {category}
                </option>
              ))}
            </select>
            
            {/* Clear Filter Button */}
            {selectedCategory && (
              <button
                onClick={() => handleCategoryChange('All Categories')}
                className="px-3 py-2 bg-gray-100 text-gray-700 rounded-md text-sm hover:bg-gray-200 transition-colors"
              >
                Clear Filter
              </button>
            )}
            
            {/* Transaction Count */}
            <div className="text-sm text-gray-600">
              Showing {paginatedTransactions.length} of {filteredTransactions.length} transactions
            </div>
          </div>
        </div>

        {/* Responsive Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-2 font-medium text-gray-700">Date</th>
                <th className="text-left py-3 px-2 font-medium text-gray-700">Description</th>
                <th className="text-left py-3 px-2 font-medium text-gray-700">Category</th>
                <th className="text-right py-3 px-2 font-medium text-gray-700">Amount</th>
              </tr>
            </thead>
            <tbody>
              {paginatedTransactions.map((transaction, index) => (
                <tr 
                  key={index} 
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <td className="py-3 px-2 text-gray-900">
                    {new Date(transaction['Transaction Date']).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-2 text-gray-900">
                    <div className="max-w-xs truncate" title={transaction['Transaction Description']}>
                      {transaction['Transaction Description'] || transaction['Transaction Line Description']}
                    </div>
                  </td>
                  <td className="py-3 px-2">
                    <button
                      onClick={() => handleCategoryChange(transaction['Account Name'])}
                      className="text-blue-600 hover:text-blue-800 hover:underline font-medium"
                      title="Click to filter by this category"
                    >
                      {transaction['Account Name'] || 'Unknown'}
                    </button>
                  </td>
                  <td className="py-3 px-2 text-right font-medium text-red-600">
                    {formatCurrency(transaction['Amount (One column)'])}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center mt-6">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Previous
            </button>
            <div className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </div>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}