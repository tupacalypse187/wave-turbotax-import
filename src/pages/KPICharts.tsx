import { Card, CardContent } from '@/components/ui/Card'
import { Transaction } from '../types'

export default function KPICharts({ transactions }: { transactions: Transaction[] }) {
  // Filter out "Owner Investment / Drawings" and only keep actual expense transactions
  const filteredTransactions = transactions.filter(t => 
    t['Account Name'] !== 'Owner Investment / Drawings'
  )

  // All amounts should be treated as expenses (negative values in Wave)
  const totalIncome = 0 // Your Wave export has no income, only expenses
  
  const totalExpenses = filteredTransactions
    .reduce((sum, t) => {
      const amount = parseFloat(t['Amount (One column)'] || '0') || 0
      // Treat both positive and negative as expenses (absolute value)
      return sum + Math.abs(amount)
    }, 0)
    
  const netIncome = totalIncome - totalExpenses
  const transactionCount = filteredTransactions.length // Use the same filtered count

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card className="relative overflow-hidden">
        <CardContent className="p-6 relative">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-green-400/10 to-green-600/10 rounded-bl-2xl"></div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Income</p>
              <p className="text-3xl font-bold text-green-600 mt-1">
                ${totalIncome.toFixed(2)}
              </p>
            </div>
            <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="relative overflow-hidden">
        <CardContent className="p-6 relative">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-red-400/10 to-red-600/10 rounded-bl-2xl"></div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Expenses</p>
              <p className="text-3xl font-bold text-red-600 mt-1">
                ${totalExpenses.toFixed(2)}
              </p>
            </div>
            <div className="p-3 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="relative overflow-hidden">
        <CardContent className="p-6 relative">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-400/10 to-blue-600/10 rounded-bl-2xl"></div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Net Income</p>
              <p className={`text-3xl font-bold mt-1 ${netIncome >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                ${netIncome.toFixed(2)}
              </p>
            </div>
            <div className={`p-3 bg-gradient-to-br rounded-2xl shadow-lg ${netIncome >= 0 ? 'from-blue-500 to-blue-600' : 'from-red-500 to-red-600'}`}>
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="relative overflow-hidden">
        <CardContent className="p-6 relative">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-400/10 to-purple-600/10 rounded-bl-2xl"></div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Transactions</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                {transactionCount}
              </p>
            </div>
            <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}