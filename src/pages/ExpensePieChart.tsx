import { useCallback } from 'react'
import { Card, CardContent } from '@/components/ui/Card'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { Transaction } from '../types'

interface ExpensePieChartProps {
  transactions: Transaction[]
  onCategoryClick?: (category: string) => void
  selectedCategory?: string
}

export default function ExpensePieChart({ transactions, onCategoryClick, selectedCategory }: ExpensePieChartProps) {
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
    .map(([category, amount]) => ({
      name: category,
      value: parseFloat(amount.toFixed(2))
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 8)

  const COLORS = [
    '#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', 
    '#10b981', '#14b8a6', '#f97316', '#ef4444'
  ]

  const total = data.reduce((sum, item) => sum + item.value, 0)

  const handlePieClick = useCallback((data: { name?: string }) => {
    if (data && data.name && onCategoryClick) {
      onCategoryClick(data.name)
    }
  }, [onCategoryClick])

  if (data.length === 0) {
    return (
      <Card className="shadow-lg">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Expense Distribution</h3>
          <div className="h-64 flex items-center justify-center text-gray-500">
            No expense data available
          </div>
        </CardContent>
      </Card>
    )
  }

  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent
  }: {
    cx?: number
    cy?: number
    midAngle?: number
    innerRadius?: number
    outerRadius?: number
    percent?: number
  }) => {
    if (!cx || !cy || !midAngle || !innerRadius || !outerRadius || !percent) return null
    
    const RADIAN = Math.PI / 180
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)

    if (percent < 0.05) return null // Don't show label for slices less than 5%

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        className="text-xs font-medium"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    )
  }

  return (
    <Card className="shadow-lg">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Expense Distribution</h3>
            <p className="text-sm text-gray-600 mt-1">Click to filter by category</p>
          </div>
          {selectedCategory && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-blue-600 font-medium bg-blue-50 px-3 py-1 rounded-full">
                {selectedCategory}
              </span>
              <button
                onClick={() => onCategoryClick?.('')}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Clear
              </button>
            </div>
          )}
        </div>
        
        <div className="h-80 relative w-full">
          {/* Background shadow effect */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div 
              className="rounded-full opacity-20 blur-xl"
              style={{
                width: '200px',
                height: '200px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
              }}
            ></div>
          </div>
          
          <div className="relative w-full h-full min-h-[320px]">
            <ResponsiveContainer width="100%" height="100%" aspect={1}>
              <PieChart>
                <defs>
                  {COLORS.map((color, index) => (
                    <linearGradient key={`gradient-${index}`} id={`gradient-${index}`} x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor={color} stopOpacity={0.8} />
                      <stop offset="100%" stopColor={color} stopOpacity={1} />
                    </linearGradient>
                  ))}
                  
                  {/* Drop shadow filter */}
                  <filter id="dropshadow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur in="SourceAlpha" stdDeviation="3"/>
                    <feOffset dx="0" dy="2" result="offsetblur"/>
                    <feFlood floodColor="#000000" floodOpacity="0.2"/>
                    <feComposite in2="offsetblur" operator="in"/>
                    <feMerge>
                      <feMergeNode/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                </defs>
                
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  outerRadius={100}
                  innerRadius={60}
                  fill="#8884d8"
                  dataKey="value"
                  onClick={handlePieClick}
                  cursor="pointer"
                  filter="url(#dropshadow)"
                >
                  {data.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={`url(#gradient-${index})`}
                      stroke={selectedCategory === entry.name ? '#1e40af' : 'white'}
                      strokeWidth={selectedCategory === entry.name ? 3 : 2}
                      style={{
                        filter: selectedCategory === entry.name 
                          ? 'brightness(1.1) drop-shadow(0 4px 6px rgba(0, 0, 0, 0.3))'
                          : 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))'
                      }}
                    />
                  ))}
                </Pie>
                
                <Tooltip 
                  formatter={(value: number | undefined) => [`$${(value || 0).toFixed(2)}`, 'Amount']}
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="mt-6 space-y-3">
          <div className="flex justify-between items-center">
            <div className="text-sm font-medium text-gray-900">Total Expenses</div>
            <div className="text-xl font-bold text-gray-900">${total.toFixed(2)}</div>
          </div>
          
          {/* Category legend */}
          <div className="grid grid-cols-2 gap-2 mt-4">
            {data.slice(0, 6).map((item, index) => (
              <div 
                key={item.name}
                className="flex items-center space-x-2 text-sm cursor-pointer hover:bg-gray-50 p-1 rounded"
                onClick={() => handlePieClick(item)}
              >
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ 
                    background: `linear-gradient(135deg, ${COLORS[index % COLORS.length]}dd 0%, ${COLORS[index % COLORS.length]} 100%)`,
                    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)'
                  }}
                ></div>
                <span className="text-gray-700 truncate">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}