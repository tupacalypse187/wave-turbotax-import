import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend, PieLabelRenderProps } from 'recharts'
import { COLORS } from '../dashboard/colors'
import { NormalizedTransaction } from '../../types'

interface ExpensePieChartProps {
  transactions: NormalizedTransaction[]
}

export function ExpensePieChart({ transactions }: ExpensePieChartProps) {
  const categories = ['Advertising', 'Contractors', 'Insurance', 'Legal & Professional', 'Office Expenses', 'Rent & Utilities', 'Travel & Meals', 'Other Expenses', 'Uncategorized']
  const breakdown = categories.map(catName => {
    const catValue = transactions.filter(function(t) {
      return t.category === catName
    }).reduce(function(sum, t) {
      return sum + Math.abs(t.amount)
    }, 0)
    return { name: catName, value: catValue }
  }).filter((cat) => cat.value > 0).sort((a, b) => b.value - a.value)

  if (breakdown.length === 0) return null

  const renderLabel = function(props: PieLabelRenderProps) {
    const name = props.name || ''
    const percent = props.percent
    return `${name} (${percent ? (percent * 100).toFixed(0) : 0}%)`
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Expense Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div style={{ width: '100%', height: '350px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={breakdown}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label={renderLabel}
              >
                {breakdown.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => typeof value === 'number' ? [`$${value.toFixed(2)}`, 'Amount'] : ''} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
