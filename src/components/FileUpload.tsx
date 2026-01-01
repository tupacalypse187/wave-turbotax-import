import React, { useState, useCallback } from 'react'
import Papa from 'papaparse'
import { Transaction } from '../types'
import { useSetAtom, useAtom } from 'jotai'
import { transactionsAtom, isCaptchaVerifiedAtom } from '../store'
import { Turnstile } from '@marsidev/react-turnstile'

export default function FileUpload() {
  const [file, setFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isCaptchaVerified, setIsCaptchaVerified] = useAtom(isCaptchaVerifiedAtom)
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

  const inputRef = React.useRef<HTMLInputElement>(null)

  const handleDivClick = () => {
    if (isCaptchaVerified) {
      inputRef.current?.click()
    }
  }

  return (
    <div className="file-upload space-y-6">
      {!isCaptchaVerified && (
        <div className="flex flex-col items-center justify-center p-8 bg-slate-900/80 rounded-2xl border border-slate-700 shadow-2xl backdrop-blur-xl transition-all animate-in fade-in zoom-in-95 duration-300">
          <div className="p-3 bg-indigo-500/10 rounded-full mb-4">
            <svg className="w-8 h-8 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-white mb-6">Security Verification</h3>
          <Turnstile
            siteKey={import.meta.env.VITE_TURNSTILE_SITE_KEY || '1x00000000000000000000AA'}
            options={{ theme: 'dark', size: 'normal' }}
            onSuccess={() => setIsCaptchaVerified(true)}
            onExpire={() => setIsCaptchaVerified(false)}
            onError={() => setIsCaptchaVerified(false)}
          />
          <p className="mt-6 text-slate-500 text-xs">Protected by Cloudflare Turnstile</p>
        </div>
      )}

      {isCaptchaVerified && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex justify-center mb-6">
            <div className="flex items-center space-x-2 text-emerald-400 bg-emerald-400/10 px-4 py-2 rounded-full border border-emerald-400/20 shadow-[0_0_15px_rgba(52,211,153,0.1)]">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="font-medium text-sm">Verified - You can upload files</span>
            </div>
          </div>

          <div
            className="upload-zone group cursor-pointer border-2 border-dashed border-slate-700 hover:border-indigo-500 hover:bg-slate-800/30 transition-all duration-300 rounded-xl p-10 text-center"
            onClick={handleDivClick}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            <div className="upload-content flex flex-col items-center space-y-4">
              <div className="p-4 bg-indigo-500/10 text-indigo-400 rounded-full group-hover:scale-110 group-hover:bg-indigo-500/20 transition-all duration-300">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="21" />
                </svg>
              </div>
              <div>
                <p className="text-lg font-medium text-white">Drag and drop your CSV file here</p>
                <p className="text-slate-400 mt-1">or click to browse from your computer</p>
              </div>
              <input
                ref={inputRef}
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center space-x-3 text-red-200 animate-in fade-in slide-in-from-top-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      {file && (
        <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-lg flex items-center justify-between text-indigo-200 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center space-x-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
            </svg>
            <span className="font-medium">{file.name}</span>
          </div>
          <button
            onClick={() => setFile(null)}
            className="p-1 hover:bg-indigo-500/20 rounded-full transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      )}
    </div>
  )
}
