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
      <div className="flex flex-col items-center justify-center h-96 text-center animate-in fade-in duration-700">
        <svg className="w-20 h-20 text-indigo-500/50 mb-6 drop-shadow-[0_0_15px_rgba(99,102,241,0.3)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        <h2 className="text-3xl font-bold text-white mb-3">No Data Available</h2>
        <p className="text-slate-400 max-w-md">Upload a CSV file in the Converter view to unlock your financial insights.</p>
        <div className="mt-8">
          <div className="h-1 w-24 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mx-auto"></div>
        </div>
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
        const date = new Date(t['Transaction Date'] || '')
        const monthKey = date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' })
        return monthKey === selectedMonth
      })
    }

    return filtered
  }

  const hasActiveFilters = selectedCategory || selectedMonth

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-white mb-2">Financial Dashboard</h1>
          <p className="text-slate-400 text-lg">Detailed overview of your business expenses and performance.</p>
        </div>

        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 animate-in fade-in">
            <span className="text-sm text-slate-500 mr-2">Filters:</span>
            {selectedCategory && (
              <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-full text-sm font-medium flex items-center gap-1">
                {selectedCategory}
                <button onClick={() => handleCategoryFilter(selectedCategory)} className="hover:text-white">×</button>
              </span>
            )}
            {selectedMonth && (
              <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full text-sm font-medium flex items-center gap-1">
                {selectedMonth}
                <button onClick={() => handleMonthFilter(selectedMonth)} className="hover:text-white">×</button>
              </span>
            )}
            <button
              onClick={clearAllFilters}
              className="px-3 py-1 text-sm text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-md transition-colors"
            >
              Clear All
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