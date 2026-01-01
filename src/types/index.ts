export interface Transaction {
  Date?: string
  Amount?: string
  Category?: string
  Description?: string
  [key: string]: string | undefined
}

export interface NormalizedTransaction {
  id: string
  date: Date
  description: string
  amount: number
  category: string
  rawCategory: string
  accountType?: string
  accountGroup?: string
}

export interface FinancialSummary {
  totalIncome: number
  totalExpenses: number
  netIncome: number
  transactionCount: number
  txfReadyCount: number
  topExpenseCategory: string | null
  topExpenseAmount: number
}
