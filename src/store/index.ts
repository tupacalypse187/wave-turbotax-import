import { atom } from 'jotai'
import { Transaction } from '../types'
import { normalizeTransactions, calculateFinancialSummary } from '../lib/financialUtils'

export const transactionsAtom = atom<Transaction[]>([])

export const normalizedTransactionsAtom = atom((get) => {
  const raw = get(transactionsAtom)
  return normalizeTransactions(raw)
})

type FinancialSummaryValue = {
  totalIncome: number
  totalExpenses: number
  netIncome: number
  transactionCount: number
  txfReadyCount: number
  topExpenseCategory: string | null
  topExpenseAmount: number
}

export const financialSummaryAtom = atom((get) => {
  const normalized = get(normalizedTransactionsAtom)
  const summary = calculateFinancialSummary(normalized)
  return summary as FinancialSummaryValue
})

export const currentViewAtom = atom<'converter' | 'dashboard'>('converter')

export const isCaptchaVerifiedAtom = atom(false)
