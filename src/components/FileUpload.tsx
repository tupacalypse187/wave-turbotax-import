import React, { useState, useCallback } from 'react'
import Papa from 'papaparse'
import { Transaction } from '../types'
import { useSetAtom } from 'jotai'
import { transactionsAtom } from '../store'
import { Turnstile } from '@marsidev/react-turnstile'

export default function FileUpload() {
  const [file, setFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isCaptchaVerified, setIsCaptchaVerified] = useState(false)
  const setTransactions = useSetAtom(transactionsAtom)

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isCaptchaVerified) return
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    setFile(selectedFile)
    setError(null)

    Papa.parse<Transaction>(selectedFile, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        setTransactions(results.data)
      },
      error: (err) => {
        setError(err.message)
      }
    })
  }, [setTransactions, isCaptchaVerified])

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    if (!isCaptchaVerified) return

    const droppedFile = e.dataTransfer.files?.[0]
    if (!droppedFile) return

    if (!droppedFile.name.endsWith('.csv')) {
      setError('Please upload a CSV file')
      return
    }

    setFile(droppedFile)
    setError(null)

    Papa.parse<Transaction>(droppedFile, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        setTransactions(results.data)
      },
      error: (err) => {
        setError(err.message)
      }
    })
  }, [setTransactions, isCaptchaVerified])

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }, [])

  return (
    <div className="file-upload space-y-4">
      <div className="flex justify-center">
        <Turnstile
          siteKey={import.meta.env.VITE_TURNSTILE_SITE_KEY || '1x00000000000000000000AA'}
          onSuccess={() => setIsCaptchaVerified(true)}
          onExpire={() => setIsCaptchaVerified(false)}
          onError={() => setIsCaptchaVerified(false)}
        />
      </div>

      <div
        className={`upload-zone transition-all duration-200 ${!isCaptchaVerified ? 'opacity-50 cursor-not-allowed pointer-events-none grayscale' : ''}`}
        onDrop={isCaptchaVerified ? handleDrop : undefined}
        onDragOver={handleDragOver}
      >
        <div className="upload-content">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
            <polyline points="17,8 12,3 7 8" />
            <line x1="12" y1="3" x2="12" y2="21" />
          </svg>
          <p>
            {!isCaptchaVerified
              ? "Please complete the security check above"
              : "Drag and drop your CSV file here, or click to browse"}
          </p>
          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="file-input"
            disabled={!isCaptchaVerified}
          />
        </div>
      </div>
      {error && <div className="error">{error}</div>}
      {file && <div className="success">Loaded: {file.name}</div>}
    </div>
  )
}
