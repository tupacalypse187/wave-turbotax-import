import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { COLORS } from '../dashboard/colors'

interface ExpenseSummaryProps {
  transactions: any[]
}

export function ExpenseSummary({ transactions }: ExpenseSummaryProps) {
  if (transactions.length === 0) {
    return null
  }

  const categories = ['Advertising', 'Contractors', 'Insurance', 'Legal & Professional', 'Office Expenses', 'Rent & Utilities', 'Travel & Meals', 'Other Expenses', 'Uncategorized']
  const breakdown = categories.map(catName => {
    const catValue = transactions.filter(function(t) {
      return t.category === catName
    }).reduce(function(sum, t) {
      return sum + Math.abs(t.amount)
    }, 0)
    return { name: catName, value: catValue }
  }).filter((cat) => cat.value > 0).sort((a, b) => b.value - a.value)

  return (
    <Card className="col-span-1 md:col-span-2">
      <CardHeader>
        <CardTitle>Operating Expenses (YTD)</CardTitle>
      </CardHeader>
      <CardContent>
        <div style={{ width: '100%', height: '350px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={breakdown} layout="vertical" margin={{ left: 20 }}>
              <XAxis type="number" hide />
              <YAxis
                dataKey="name"
                type="category"
                width={120}
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                cursor={{ fill: 'transparent' }}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                formatter={(value) => typeof value === 'number' ? [`$${value.toFixed(2)}`, 'Amount'] : ''}
              />
              <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={32}>
                {breakdown.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
