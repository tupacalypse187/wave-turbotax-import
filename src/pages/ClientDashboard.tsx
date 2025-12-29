import { useState } from 'react'
import { useAtom } from 'jotai'
import { transactionsAtom } from '@/store'
import KPICharts from './KPICharts'
import IncomeExpenseChart from './IncomeExpenseChart'
import ExpensePieChart from './ExpensePieChart'
import ExpenseSummary from './ExpenseSummary'
import TransactionTable from './TransactionTable'

export default function ClientDashboard() {
  const [transactions] = useAtom(transactionsAtom)
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [selectedMonth, setSelectedMonth] = useState<string>('')
  
  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-center">
        <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">No Data Available</h2>
        <p className="text-gray-500">Upload a CSV file in Converter view to see your financial dashboard</p>
      </div>
    )
  }

  const handleCategoryFilter = (category: string) => {
    setSelectedCategory(category === selectedCategory ? '' : category)
  }

  const handleMonthFilter = (month: string) => {
    setSelectedMonth(month === selectedMonth ? '' : month)
  }

  const clearAllFilters = () => {
    setSelectedCategory('')
    setSelectedMonth('')
  }

  // Filter transactions based on selected filters
  const getFilteredTransactions = () => {
    let filtered = transactions.filter(t => 
      t['Account Name'] !== 'Owner Investment / Drawings'
    )
    
    if (selectedCategory) {
      filtered = filtered.filter(t => t['Account Name'] === selectedCategory)
    }
    
    if (selectedMonth) {
      filtered = filtered.filter(t => {
        const date = new Date(t['Transaction Date'])
        const monthKey = date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' })
        return monthKey === selectedMonth
      })
    }
    
    return filtered
  }

  const hasActiveFilters = selectedCategory || selectedMonth

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Financial Dashboard</h1>
        <p className="text-gray-500 mt-1">Overview of your business expenses</p>
        {hasActiveFilters && (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="text-sm text-gray-600">Active filters:</span>
            {selectedCategory && (
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                Category: {selectedCategory}
              </span>
            )}
            {selectedMonth && (
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                Month: {selectedMonth}
              </span>
            )}
            <button
              onClick={clearAllFilters}
              className="text-sm text-red-600 hover:text-red-800 underline"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>

      {/* KPI Cards */}
      <KPICharts transactions={getFilteredTransactions()} />

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <IncomeExpenseChart 
          transactions={transactions} 
          onMonthClick={handleMonthFilter}
          selectedMonth={selectedMonth}
        />
        <ExpensePieChart 
          transactions={getFilteredTransactions()} 
          onCategoryClick={handleCategoryFilter}
          selectedCategory={selectedCategory}
        />
      </div>

      {/* Expense Summary */}
      <div className="grid grid-cols-1 gap-6">
        <ExpenseSummary 
          transactions={getFilteredTransactions()} 
          onCategoryClick={handleCategoryFilter}
        />
      </div>

      {/* Transaction Table */}
      <TransactionTable 
        transactions={transactions}
        selectedCategory={selectedCategory}
        onCategoryFilter={handleCategoryFilter}
      />
    </div>
  )
}