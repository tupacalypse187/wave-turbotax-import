import { useState, useCallback } from 'react'
import { Card, CardContent } from '@/components/ui/Card'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts'

interface IncomeExpenseChartProps {
  transactions: any[]
  onMonthClick?: (month: string) => void
  selectedMonth?: string
}

export default function IncomeExpenseChart({ transactions, onMonthClick, selectedMonth }: IncomeExpenseChartProps) {
  // Filter out Owner Investment / Drawings and only keep actual expense transactions
  const filteredTransactions = transactions.filter(t => 
    t['Account Name'] !== 'Owner Investment / Drawings'
  )

  const monthlyData = filteredTransactions.reduce((acc, t) => {
    const date = new Date(t['Transaction Date'])
    const monthKey = date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' })
    const amount = parseFloat(t['Amount (One column)']) || 0
    
    if (!acc[monthKey]) {
      acc[monthKey] = { month: monthKey, income: 0, expenses: 0, date: date }
    }
    
    // Since this Wave export only has expenses, treat all as expenses
    acc[monthKey].expenses += Math.abs(amount)
    
    return acc
  }, {} as Record<string, { month: string; income: number; expenses: number; date: Date }>)

  const data = Object.values(monthlyData)
    .map(item => ({
      ...item,
      income: parseFloat(item.income.toFixed(2)),
      expenses: parseFloat(item.expenses.toFixed(2))
    }))
    // Sort by date (oldest first)
    .sort((a, b) => a.date.getTime() - b.date.getTime())

  const handleAreaClick = useCallback((data: any) => {
    if (data && data.activeLabel && onMonthClick) {
      onMonthClick(data.activeLabel)
    }
  }, [onMonthClick])

  if (data.length === 0) {
    return (
      <Card className="lg:col-span-2">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Expense Trend</h3>
          <div className="h-64 flex items-center justify-center text-gray-500">
            No expense data available
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="lg:col-span-2 shadow-lg">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Monthly Expense Trend</h3>
            <p className="text-sm text-gray-600 mt-1">Click on chart to filter by month</p>
          </div>
          {selectedMonth && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-blue-600 font-medium bg-blue-50 px-3 py-1 rounded-full">
                {selectedMonth}
              </span>
              <button
                onClick={() => onMonthClick?.('')}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Clear
              </button>
            </div>
          )}
        </div>
        
        <div className="h-64 relative w-full">
          <div className="relative w-full h-full min-h-[256px]">
            <ResponsiveContainer width="100%" height="100%" aspect={16/9}>
              <AreaChart 
                data={data} 
                onClick={handleAreaClick}
                style={{ cursor: 'pointer' }}
              >
                <defs>
                  <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="month" 
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                  axisLine={{ stroke: '#e5e7eb' }}
                />
                <YAxis 
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                  axisLine={{ stroke: '#e5e7eb' }}
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip 
                  formatter={(value: number) => [`$${value.toFixed(2)}`, 'Expenses']}
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="expenses" 
                  stroke="#ef4444" 
                  strokeWidth={3}
                  fill="url(#colorExpenses)"
                  name="Expenses"
                  activeDot={{ r: 8, fill: '#ef4444', stroke: '#fff', strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}