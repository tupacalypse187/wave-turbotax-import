import { Card, CardContent } from '@/components/ui/Card'
import { Transaction } from '../types'

export default function KPICharts({ transactions }: { transactions: Transaction[] }) {
  // Filter out "Owner Investment / Drawings" and "Cash on Hand"
  const filteredTransactions = transactions.filter(t =>
    t['Account Name'] !== 'Owner Investment / Drawings' &&
    t['Account Name'] !== 'Cash on Hand'
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
      <Card className="relative overflow-hidden bg-white dark:bg-obsidian-900 border-slate-200 dark:border-obsidian-800 backdrop-blur-sm transition-all hover:shadow-lg hover:shadow-brand-secondary/10 group">
        <CardContent className="p-6 relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-secondary/5 rounded-bl-[100px] transition-transform group-hover:scale-110"></div>
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-brand-secondary/10 rounded-2xl text-brand-secondary group-hover:bg-brand-secondary group-hover:text-white transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            {/* Trend Indicator (Mock) */}
            <span className="flex items-center text-xs font-bold text-brand-secondary bg-brand-secondary/10 px-2 py-1 rounded-full">
              +0%
            </span>
          </div>
          <div>
            <p className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Total Income</p>
            <p className="text-3xl font-display font-bold text-slate-900 dark:text-white mt-1 group-hover:text-brand-secondary transition-colors">
              ${totalIncome.toFixed(2)}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="relative overflow-hidden bg-white dark:bg-obsidian-900 border-slate-200 dark:border-obsidian-800 backdrop-blur-sm transition-all hover:shadow-lg hover:shadow-brand-accent/10 group">
        <CardContent className="p-6 relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-accent/5 rounded-bl-[100px] transition-transform group-hover:scale-110"></div>
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-brand-accent/10 rounded-2xl text-brand-accent group-hover:bg-brand-accent group-hover:text-white transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
            </div>
          </div>
          <div>
            <p className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Total Expenses</p>
            <p className="text-3xl font-display font-bold text-slate-900 dark:text-white mt-1 group-hover:text-brand-accent transition-colors">
              ${totalExpenses.toFixed(2)}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="relative overflow-hidden bg-white dark:bg-obsidian-900 border-slate-200 dark:border-obsidian-800 backdrop-blur-sm transition-all hover:shadow-lg hover:shadow-brand-primary/10 group">
        <CardContent className="p-6 relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/5 rounded-bl-[100px] transition-transform group-hover:scale-110"></div>
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-2xl transition-colors ${netIncome >= 0 ? 'bg-brand-primary/10 text-brand-primary group-hover:bg-brand-primary group-hover:text-white' : 'bg-red-500/10 text-red-500 group-hover:bg-red-500 group-hover:text-white'}`}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
          <div>
            <p className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Net Income</p>
            <p className={`text-3xl font-display font-bold mt-1 ${netIncome >= 0 ? 'text-brand-primary' : 'text-brand-accent'}`}>
              ${netIncome.toFixed(2)}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="relative overflow-hidden bg-white dark:bg-obsidian-900 border-slate-200 dark:border-obsidian-800 backdrop-blur-sm transition-all hover:shadow-lg hover:shadow-purple-500/10 group">
        <CardContent className="p-6 relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-bl-[100px] transition-transform group-hover:scale-110"></div>
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-500/10 rounded-2xl text-purple-500 group-hover:bg-purple-500 group-hover:text-white transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
          </div>
          <div>
            <p className="text-sm font-bold text-slate-500 dark:text-slate-200 uppercase tracking-widest">Transactions</p>
            <p className="text-3xl font-display font-bold text-slate-900 dark:text-white mt-1 group-hover:text-purple-500 transition-colors">
              {transactionCount}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}