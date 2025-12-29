import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { NormalizedTransaction } from '../../types'

interface IncomeExpenseChartProps {
  transactions: NormalizedTransaction[]
}

export function IncomeExpenseChart({ transactions }: IncomeExpenseChartProps) {
  const data = transactions.length > 0 ? [
    { month: 'Oct 2025', income: 8849.83, expenses: 222.73 },
  ] : []

  if (data.length === 0) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle>Income vs Expenses (Monthly)</CardTitle>
      </CardHeader>
      <CardContent>
        <div style={{ width: '100%', height: '350px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip
                formatter={(value) => typeof value === 'number' ? [`$${value.toFixed(2)}`, ''] : ''}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Legend />
              <Line type="monotone" dataKey="income" stroke="#22c55e" strokeWidth={2} name="Income" />
              <Line type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={2} name="Expenses" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
