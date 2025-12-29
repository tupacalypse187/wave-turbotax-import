import { Transaction } from '../types'

export const TXF_MAPPING: Record<string, number> = {
  "Sales": 266,
  "Service Income": 266,
  "Consulting Income": 266,
  "Revenue": 266,
  "Gross Receipts": 266,
  "Uncategorized Income": 266,
  "Advertising & Promotion": 271,
  "Marketing": 271,
  "Web Hosting": 271,
  "Computer – Hosting": 271,
  "Vehicle Expenses": 270,
  "Gas & Fuel": 270,
  "Commissions": 272,
  "Contractors": 367,
  "Subcontractors": 367,
  "Insurance": 275,
  "Business Insurance": 275,
  "Liability Insurance": 275,
  "Interest Expense": 276,
  "Credit Card Interest": 276,
  "Legal & Professional Services": 277,
  "Legal Fees": 277,
  "Accounting Fees": 277,
  "Consulting Fees": 277,
  "Office Expenses": 278,
  "Office Supplies": 278,
  "Postage": 278,
  "Shipping": 278,
  "Software": 278,
  "Computer – Hardware": 278,
  "Computer – Software": 278,
  "Small Tools & Equipment": 278,
  "Rent": 281,
  "Equipment Rental": 280,
  "Repairs & Maintenance": 282,
  "Taxes & Licenses": 286,
  "State Taxes": 286,
  "Permits": 286,
  "Travel": 283,
  "Airfare": 283,
  "Hotel": 283,
  "Taxi & Rideshare": 283,
  "Meals": 284,
  "Meals & Entertainment": 284,
  "Client Meals": 284,
  "Utilities": 287,
  "Telephone": 287,
  "Mobile Phone": 287,
  "Internet": 287,
  "Computer – Internet": 287,
  "Telephone – Wireless": 287,
  "Dues & Subscriptions": 298,
  "Education & Training": 298,
  "Conferences": 298,
  "Bank Service Charges": 298,
  "Merchant Fees": 298,
  "Uniforms": 298,
  "Gifts": 298,
}

export function convertToTXF(transactions: Transaction[], companyName: string = 'NeuralSec Advisory'): string {
  const output: string[] = []
  const today = new Date().toLocaleDateString('en-US')

  console.log('TXF Conversion - Total transactions:', transactions.length)

  output.push('V041')
  output.push(`A${companyName}`)
  output.push(`D${today}`)
  output.push('^')

  let convertedCount = 0
  let skippedCount = 0

  for (const row of transactions) {
    try {
      const rawAmount = String(row.Amount ?? row['Amount (One column)'] ?? '0').replace(/,/g, '').replace(/\$/g, '')
      const amount = parseFloat(rawAmount)

      const category = row.Category ?? row['Account Name'] ?? 'Uncategorized'
      const description = row.Description ?? row['Transaction Description'] ?? row['Transaction Line Description'] ?? 'No Description'

      let dateStr = today
      const dateValue = row.Date ?? row['Transaction Date']
      if (dateValue) {
        try {
          const dateObj = new Date(dateValue)
          if (!isNaN(dateObj.getTime())) {
            dateStr = dateObj.toLocaleDateString('en-US')
          }
        } catch {
          dateStr = today
        }
      }

      const txfCode = TXF_MAPPING[category]

      if (txfCode) {
        output.push('^')
        output.push(`C${txfCode}`)
        output.push(`P${description}`)
        output.push(`D${dateStr}`)
        output.push(`$${Math.abs(amount).toFixed(2)}`)
        output.push('^')
        convertedCount++
      } else {
        skippedCount++
      }
    } catch {
      continue
    }
  }

  if (skippedCount > 0) {
    console.warn(`TXF Conversion: ${skippedCount} transactions skipped (unmapped categories)`)
  }

  return output.join('\n')
}
