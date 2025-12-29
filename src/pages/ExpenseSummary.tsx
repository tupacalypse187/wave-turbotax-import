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

  const handleCategoryClick = useCallback((category: string) => {
    if (onCategoryClick) {
      onCategoryClick(category)
    }
  }, [onCategoryClick])

  if (data.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Expense Breakdown</h3>
          <div className="h-80 flex items-center justify-center text-gray-500">
            No expense data available
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="shadow-lg">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Expense Breakdown</h3>
            <p className="text-sm text-gray-600 mt-1">Click any category to filter transactions</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                viewMode === 'grid' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Grid
            </button>
            <button
              onClick={() => setViewMode('bar')}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                viewMode === 'bar' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Chart
            </button>
          </div>
        </div>

        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {data.map((item, index) => {
              const percentage = totalExpenses > 0 ? (item.amount / totalExpenses * 100) : 0
              return (
                <div
                  key={item.category}
                  onClick={() => handleCategoryClick(item.category)}
                  className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 cursor-pointer transition-all duration-200 hover:shadow-md"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div 
                      className="w-4 h-4 rounded-full" 
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    ></div>
                    <span className="text-lg font-bold text-gray-900">
                      ${item.amount.toFixed(0)}
                    </span>
                  </div>
                  <div className="text-sm font-medium text-gray-700 mb-1 truncate" title={item.category}>
                    {item.category}
                  </div>
                  <div className="text-xs text-gray-500">
                    {percentage.toFixed(1)}% of total
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="h-80 relative w-full">
            <div className="relative w-full h-full min-h-[320px]">
              <ResponsiveContainer width="100%" height="100%" aspect={16/9}>
                <BarChart data={data} style={{ cursor: 'pointer' }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="category" 
                    tick={{ fill: '#6b7280', fontSize: 11 }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis 
                    tick={{ fill: '#6b7280', fontSize: 12 }}
                    tickFormatter={(value) => `$${value}`}
                  />
                  <Tooltip 
                    formatter={(value: number | undefined) => [`$${(value || 0).toFixed(2)}`, 'Amount']}
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Bar dataKey="amount" radius={[8, 8, 0, 0]}>
                    {data.map((_, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              Top {data.length} of {Object.keys(expensesByCategory).length} categories
            </div>
            <div className="text-lg font-semibold text-gray-900">
              Total: ${totalExpenses.toFixed(2)}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}