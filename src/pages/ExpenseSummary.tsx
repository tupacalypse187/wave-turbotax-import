import { useState, useCallback } from 'react'
import { Card, CardContent } from '@/components/ui/Card'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Cell } from 'recharts'
import { Transaction } from '../types'

interface ExpenseSummaryProps {
  transactions: Transaction[]
  onCategoryClick?: (category: string) => void
}

export default function ExpenseSummary({ transactions, onCategoryClick }: ExpenseSummaryProps) {
  const [viewMode, setViewMode] = useState<'bar' | 'grid'>('grid')

  // Filter out Owner Investment / Drawings and only keep actual expense transactions
  const filteredTransactions = transactions.filter(t =>
    t['Account Name'] !== 'Owner Investment / Drawings'
  )

  const expensesByCategory = filteredTransactions.reduce((acc, t) => {
    const category = t['Account Name'] || 'Unknown'
    const amount = parseFloat(t['Amount (One column)'] || '0') || 0
    // Treat both positive and negative as expenses (absolute value)
    acc[category] = (acc[category] || 0) + Math.abs(amount)
    return acc
  }, {} as Record<string, number>)

  const data = Object.entries(expensesByCategory)
    .map(([category, amount], index) => ({
      category,
      amount: parseFloat(amount.toFixed(2)),
      index
    }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 8)

  const totalExpenses = data.reduce((sum, item) => sum + item.amount, 0)

  const COLORS = [
    '#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b',
    '#10b981', '#14b8a6', '#f97316', '#ef4444'
  ]

  // Stable color assignment based on category string
  const getColorForCategory = (category: string) => {
    let hash = 0
    for (let i = 0; i < category.length; i++) {
      hash = category.charCodeAt(i) + ((hash << 5) - hash)
    }
    const index = Math.abs(hash) % COLORS.length
    return COLORS[index]
  }

  const handleCategoryClick = useCallback((category: string) => {
    if (onCategoryClick) {
      onCategoryClick(category)
    }
  }, [onCategoryClick])

  if (data.length === 0) {
    return (
      <Card className="bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700/50 backdrop-blur-sm transition-colors">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Expense Breakdown</h3>
          <div className="h-80 flex items-center justify-center text-slate-500 dark:text-slate-400">
            No expense data available
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="shadow-lg bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700/50 backdrop-blur-sm transition-colors">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Expense Breakdown</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Click any category to filter transactions</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${viewMode === 'grid'
                ? 'bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300'
                : 'bg-slate-100 dark:bg-slate-700/50 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
            >
              Grid
            </button>
            <button
              onClick={() => setViewMode('bar')}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${viewMode === 'bar'
                ? 'bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300'
                : 'bg-slate-100 dark:bg-slate-700/50 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
            >
              Chart
            </button>
          </div>
        </div>

        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {data.map((item) => {
              const percentage = totalExpenses > 0 ? (item.amount / totalExpenses * 100) : 0
              return (
                <div
                  key={item.category}
                  onClick={() => handleCategoryClick(item.category)}
                  className="p-4 border border-slate-200 dark:border-slate-700/50 rounded-lg hover:border-blue-300 dark:hover:border-blue-500/50 hover:bg-blue-50 dark:hover:bg-blue-500/10 cursor-pointer transition-all duration-200 hover:shadow-md bg-white dark:bg-transparent"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: getColorForCategory(item.category) }}
                    ></div>
                    <span className="text-lg font-bold text-slate-900 dark:text-white">
                      ${item.amount.toFixed(0)}
                    </span>
                  </div>
                  <div className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 truncate" title={item.category}>
                    {item.category}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    {percentage.toFixed(1)}% of total
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="w-full overflow-y-auto overflow-x-hidden" style={{ maxHeight: '600px' }}>
            <div style={{ height: Math.max(400, data.length * 60) }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={data}
                  layout="vertical"
                  margin={{ top: 20, right: 30, left: 40, bottom: 20 }}
                  style={{ cursor: 'pointer' }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" strokeOpacity={0.3} horizontal={false} />
                  <XAxis
                    type="number"
                    tick={{ fill: 'currentColor', fontSize: 12 }}
                    className="text-slate-500 dark:text-slate-400"
                    tickFormatter={(value) => `$${value}`}
                  />
                  <YAxis
                    type="category"
                    dataKey="category"
                    tick={{ fill: 'currentColor', fontSize: 13, fontWeight: 500 }}
                    width={180}
                    className="text-slate-700 dark:text-slate-300"
                    interval={0}
                  />
                  <Tooltip
                    cursor={{ fill: 'rgba(148, 163, 184, 0.1)' }}
                    formatter={(value: number | undefined) => [`$${(value || 0).toFixed(2)}`, 'Amount']}
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                      color: '#1e293b'
                    }}
                    labelStyle={{ color: '#64748b' }}
                  />
                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                  <Bar dataKey="amount" radius={[0, 4, 4, 0]} barSize={32} onClick={(data: any) => handleCategoryClick(data.category)}>
                    {data.map((item, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={getColorForCategory(item.category)}
                        className="transition-all duration-300 hover:opacity-80"
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700/50">
          <div className="flex justify-between items-center">
            <div className="text-sm text-slate-600 dark:text-slate-400">
              Top {data.length} of {Object.keys(expensesByCategory).length} categories
            </div>
            <div className="text-lg font-semibold text-slate-900 dark:text-white">
              Total: ${totalExpenses.toFixed(2)}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}