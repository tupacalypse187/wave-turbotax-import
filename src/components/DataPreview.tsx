import { useAtom } from 'jotai'
import { useCallback } from 'react'
import { transactionsAtom } from '../store'
import { convertToTXF } from '../utils/txfConverter'

export default function DataPreview() {
  const [transactions] = useAtom(transactionsAtom)

  const handleConvert = useCallback(() => {
    const txfData = convertToTXF(transactions, 'NeuralSec Advisory')
    
    const blob = new Blob([txfData], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'neuralsec_tax_import.txf'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }, [transactions])

  if (transactions.length === 0) {
    return null
  }

  const headers = Object.keys(transactions[0])

  return (
    <div className="data-preview">
      <h3>Data Preview</h3>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              {headers.map((header) => (
                <th key={header}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {transactions.slice(0, 10).map((row, idx) => (
              <tr key={idx}>
                {headers.map((header) => (
                  <td key={`${idx}-${header}`}>
                    {String(row[header as keyof typeof row] ?? '')}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        {transactions.length > 10 && (
          <p className="showing-hint">Showing first 10 of {transactions.length} rows</p>
        )}
      </div>
      <button className="convert-button" onClick={handleConvert}>Convert to TXF</button>
    </div>
  )
}
