import React, { useState, useCallback } from 'react'
import Papa from 'papaparse'
import { Transaction } from '../types'
import { useSetAtom } from 'jotai'
import { transactionsAtom } from '../store'

export default function FileUpload() {
  const [file, setFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)
  const setTransactions = useSetAtom(transactionsAtom)

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
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
  }, [setTransactions])

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
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
  }, [setTransactions])

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }, [])

  return (
    <div className="file-upload">
      <div
        className="upload-zone"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <div className="upload-content">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
            <polyline points="17,8 12,3 7 8" />
            <line x1="12" y1="3" x2="12" y2="21" />
          </svg>
          <p>Drag and drop your CSV file here, or click to browse</p>
          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="file-input"
          />
        </div>
      </div>
      {error && <div className="error">{error}</div>}
      {file && <div className="success">Loaded: {file.name}</div>}
    </div>
  )
}
