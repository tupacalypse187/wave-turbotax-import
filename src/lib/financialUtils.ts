import { Transaction, NormalizedTransaction, FinancialSummary } from '../types'
import { TXF_MAPPING } from '../utils/txfConverter'

export type TaxCategory =
  | "Income"
  | "Advertising"
  | "Contractors"
  | "Insurance"
  | "Legal & Professional"
  | "Office Expenses"
  | "Rent & Utilities"
  | "Travel & Meals"
  | "Other Expenses"
  | "Uncategorized"
  | "Transfer"
  | "Payment"
  | "Equity";

export const CATEGORY_MAPPING: Record<string, TaxCategory> = {
  "Sales": "Income",
  "Service Income": "Income",
  "Consulting Income": "Income",
  "Revenue": "Income",
  "Advertising & Promotion": "Advertising",
  "Marketing": "Advertising",
  "Web Hosting": "Advertising",
  "Computer – Hosting": "Office Expenses",
  "Contractors": "Contractors",
  "Subcontractors": "Contractors",
  "Insurance": "Insurance",
  "Business Insurance": "Insurance",
  "Legal & Professional Services": "Legal & Professional",
  "Legal Fees": "Legal & Professional",
  "Accounting Fees": "Legal & Professional",
  "Office Expenses": "Office Expenses",
  "Office Supplies": "Office Expenses",
  "Software": "Office Expenses",
  "Computer – Hardware": "Office Expenses",
  "Computer – Software": "Office Expenses",
  "Rent": "Rent & Utilities",
  "Utilities": "Rent & Utilities",
  "Telephone": "Rent & Utilities",
  "Internet": "Rent & Utilities",
  "Computer – Internet": "Rent & Utilities",
  "Telephone – Wireless": "Rent & Utilities",
  "Travel": "Travel & Meals",
  "Airfare": "Travel & Meals",
  "Meals": "Travel & Meals",
  "Client Meals": "Travel & Meals",
  "Dues & Subscriptions": "Other Expenses",
  "Education & Training": "Other Expenses",
  "Bank Service Charges": "Other Expenses",
  // Non-taxable categories
  "Transfer": "Transfer",
  "Payment": "Payment",
  "Credit Card Payment": "Payment",
  "Owner Investment": "Equity",
  "Owner Investment / Drawings": "Equity",
  "Owner's Draw": "Equity",
  "Owner Draw": "Equity",
  "Personal Expense": "Equity",
};

export function getStandardCategory(rawCategory: string): TaxCategory {
  return CATEGORY_MAPPING[rawCategory] || "Uncategorized";
}

export function normalizeTransaction(tx: Transaction, index: number): NormalizedTransaction | null {
  try {
    const rawAmount = tx.Amount ?? tx['Amount (One column)'] ?? '0'
    const amount = parseFloat(rawAmount.replace(/,/g, '').replace(/\$/g, ''))

    if (isNaN(amount)) {
      return null
    }

    const category = tx.Category ?? tx['Account Name'] ?? 'Uncategorized'
    const description = tx.Description ?? tx['Transaction Description'] ?? tx['Transaction Line Description'] ?? 'No Description'
    const dateValue = tx.Date ?? tx['Transaction Date']

    const date = new Date(dateValue || Date.now())
    if (isNaN(date.getTime())) {
      return null
    }

    const normalized: NormalizedTransaction = {
      id: `tx_${index}`,
      date,
      description,
      amount,
      category: getStandardCategory(category),
      rawCategory: category,
      accountType: tx['Account Type'],
      accountGroup: tx['Account Group']
    }

    return normalized
  } catch {
    return null
  }
}

export function normalizeTransactions(transactions: Transaction[]): NormalizedTransaction[] {
  const normalized = transactions
    .map((tx, idx) => normalizeTransaction(tx, idx))
    .filter((tx): tx is NormalizedTransaction => tx !== null)

  return normalized
}

export function calculateFinancialSummary(transactions: NormalizedTransaction[]): FinancialSummary {
  // Filter out non-business transaction types
  const businessTransactions = transactions.filter(t => {
    return t.category !== 'Transfer' &&
      t.category !== 'Payment' &&
      t.category !== 'Equity' &&
      t.accountGroup !== 'Liability';
  })

  const income = businessTransactions.filter(t => t.amount > 0)
  const expenses = businessTransactions.filter(t => t.amount < 0)

  const totalIncome = income.reduce((sum, t) => sum + t.amount, 0)
  const totalExpenses = expenses.reduce((sum, t) => sum + Math.abs(t.amount), 0)
  const netIncome = totalIncome - totalExpenses

  const expenseByCategory = expenses.reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + Math.abs(t.amount)
    return acc
  }, {} as Record<string, number>)

  const [topExpenseCategory, topExpenseAmount] =
    Object.entries(expenseByCategory).sort((a, b) => b[1] - a[1])[0] || [null, 0]

  const txfReadyCount = transactions.filter(t => TXF_MAPPING[t.rawCategory]).length

  const summary: FinancialSummary = {
    totalIncome,
    totalExpenses,
    netIncome,
    transactionCount: transactions.length,
    txfReadyCount,
    topExpenseCategory,
    topExpenseAmount
  }

  return summary
}

export function calculateMonthlyBreakdown(transactions: NormalizedTransaction[]) {
  const monthly: Record<string, { income: number; expenses: number }> = {}

  transactions.forEach(tx => {
    const monthKey = tx.date.toISOString().slice(0, 7)
    if (!monthly[monthKey]) monthly[monthKey] = { income: 0, expenses: 0 }

    if (tx.amount > 0) {
      monthly[monthKey].income += tx.amount
    } else {
      monthly[monthKey].expenses += Math.abs(tx.amount)
    }
  })

  const result = Object.entries(monthly)
    .map(([month, data]) => ({ month, ...data }))
    .sort((a, b) => a.month.localeCompare(b.month))

  return result
}

export function calculateExpenseBreakdown(transactions: NormalizedTransaction[]) {
  const breakdown: Record<string, number> = {}

  transactions.forEach((tx) => {
    if (tx.amount < 0) {
      const standardCat = tx.category
      const expenseAmount = Math.abs(tx.amount)
      breakdown[standardCat] = (breakdown[standardCat] || 0) + expenseAmount
    }
  })

  const result = Object.entries(breakdown)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)

  return result
}
