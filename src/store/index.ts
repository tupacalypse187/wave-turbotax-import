import { atom } from 'jotai'
import { Transaction, FinancialSummary } from '../types'
import { normalizeTransactions, calculateFinancialSummary } from '../lib/financialUtils'

export const transactionsAtom = atom<Transaction[]>([])

export const normalizedTransactionsAtom = atom((get) => {
  const raw = get(transactionsAtom)
  return normalizeTransactions(raw)
})

export const financialSummaryAtom = atom((get) => {
  const normalized = get(normalizedTransactionsAtom)
  const summary = calculateFinancialSummary(normalized)
  return summary as FinancialSummary
})

export const currentViewAtom = atom<'converter' | 'dashboard'>('converter')

export const isCaptchaVerifiedAtom = atom(false)

export const availableYearsAtom = atom((get) => {
  const transactions = get(transactionsAtom)
  const years = new Set<string>()
  transactions.forEach(t => {
    // Handle both raw CSV keys and potential normalized keys
    const dateStr = t['Transaction Date'] || t.Date
    if (dateStr) {
      // Use string splitting to get the year directly, avoiding timezone issues
      const parts = dateStr.split('-')
      if (parts.length >= 1) {
        const year = parts[0]
        if (year && year.length === 4 && !isNaN(Number(year))) {
          years.add(year)
        }
      }
    }
  })
  return Array.from(years).sort().reverse()
})

export const selectedYearAtom = atom<string>('')
