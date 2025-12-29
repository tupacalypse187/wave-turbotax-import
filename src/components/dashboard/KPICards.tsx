import { Card, CardContent } from '@/components/ui/Card'
import { NormalizedTransaction } from '../../types'

interface KPICardsProps {
  transactions: NormalizedTransaction[]
}

interface KPI {
  label: string
  value: number
  format: 'currency' | 'number'
  color: string
  subtitle?: string
}

export function KPICards({ transactions }: KPICardsProps) {
  const income = transactions.filter(function(t) { return t.amount && t.amount > 0 })
  const expenses = transactions.filter(function(t) { return t.amount && t.amount < 0 })
  const totalIncome = income.reduce(function(sum, t) { return sum + t.amount }, 0)
  const totalExpenses = expenses.reduce(function(sum, t) { return sum + Math.abs(t.amount) }, 0)
  const netIncome = totalIncome - totalExpenses

  expenses.reduce(function(acc: Record<string, number>, t) {
    const category = t.category || 'Uncategorized'
    acc[category] = (acc[category] || 0) + Math.abs(t.amount)
    return acc
  }, {} as Record<string, number>)

  const kpis: KPI[] = [
    { label: 'Total Income', value: totalIncome, format: 'currency', color: 'text-green-600' },
    { label: 'Total Expenses', value: totalExpenses, format: 'currency', color: 'text-red-600' },
    { label: 'Net Income', value: netIncome, format: 'currency', color: netIncome >= 0 ? 'text-green-600' : 'text-red-600' },
    { label: 'Transactions', value: transactions.length, format: 'number', color: 'text-gray-700' },
  ]

  if (transactions.length === 0) {
    return null
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {kpis.map(function(kpi, idx) {
        return (
          <Card key={idx}>
            <CardContent>
              <p className="text-sm text-gray-500">{kpi.label}</p>
              <p className={`text-2xl font-bold ${kpi.color}`}>
                {kpi.format === 'currency' ? kpi.value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : kpi.value.toLocaleString()}
              </p>
              {kpi.subtitle && (
                <p className="text-xs text-gray-400 mt-1">{kpi.subtitle}</p>
              )}
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
