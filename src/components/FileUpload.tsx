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
    <div className="file-upload space-y-8">
      {/* Hero Header - Always Visible */}
      <div className="mb-10 text-center space-y-6">
        <h1 className="text-4xl md:text-5xl font-display font-bold tracking-tight text-slate-900 dark:text-white">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-primary to-brand-accent">
            Wave2TXF
          </span>
          <span className="mx-3 text-slate-300 dark:text-slate-600">→</span>
          <span className="block sm:inline mt-2 sm:mt-0">TurboTax Converter</span>
        </h1>

        <p className="max-w-2xl mx-auto text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
          Seamlessly convert your Wave Accounting CSV exports to TXF format for TurboTax import.
          Visualize your business expenses with interactive dashboards.
        </p>

        <div className="flex flex-wrap justify-center gap-4 mt-6">
          <div className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-zinc-800 rounded-full border border-slate-200 dark:border-zinc-700 shadow-sm text-sm font-medium text-slate-700 dark:text-slate-200">
            <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Wave CSV Compatible
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-zinc-800 rounded-full border border-slate-200 dark:border-zinc-700 shadow-sm text-sm font-medium text-slate-700 dark:text-slate-200">
            <div className="w-5 h-5 rounded-full bg-blue-500/10 flex items-center justify-center">
              <svg className="w-3.5 h-3.5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </div>
            TXF Export
          </div>
        </div>
      </div>
      {!isCaptchaVerified && (
        <div className="flex flex-col items-center justify-center p-8 bg-white dark:bg-zinc-900/80 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-2xl backdrop-blur-xl transition-all animate-in fade-in zoom-in-95 duration-300 max-w-md mx-auto">
          <div className="p-4 bg-brand-primary/10 rounded-full mb-6">
            <svg className="w-8 h-8 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h3 className="text-xl font-display font-bold text-slate-900 dark:text-white mb-6">Security Verification</h3>
          <Turnstile
            siteKey={import.meta.env.VITE_TURNSTILE_SITE_KEY || '1x00000000000000000000AA'}
            options={{ theme: 'dark', size: 'normal' }}
            onSuccess={() => setIsCaptchaVerified(true)}
            onExpire={() => setIsCaptchaVerified(false)}
            onError={() => setIsCaptchaVerified(false)}
          />
          <p className="mt-6 text-slate-500 text-xs text-center">Protected by Cloudflare Turnstile<br />Secure Connection Established</p>
        </div>
      )}

      {isCaptchaVerified && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 text-center">
          <div className="flex justify-center mb-8">
            <div className="flex items-center space-x-2 text-brand-secondary">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-medium text-sm">Verified - You can upload files</span>
            </div>
          </div>

          <div
            className="upload-zone group cursor-pointer relative overflow-hidden bg-white dark:bg-zinc-900/50 dark:!bg-zinc-900/50 backdrop-blur-xl border-2 border-dashed border-slate-300 dark:border-zinc-700 hover:border-brand-primary dark:hover:border-brand-primary transition-all duration-300 rounded-3xl p-16 text-center max-w-2xl mx-auto"
            onClick={handleDivClick}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            {/* Hover Gradient Overlay */}
            <div className="absolute inset-0 bg-brand-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>

            <div className="upload-content relative z-10 flex flex-col items-center space-y-6">
              <div className="p-4 bg-slate-100 dark:bg-zinc-800 text-slate-400 dark:text-slate-400 rounded-2xl group-hover:scale-110 group-hover:text-brand-primary transition-all duration-300">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="21" />
                </svg>
              </div>
              <div className="space-y-1">
                <p className="text-lg font-bold text-slate-900 dark:text-white">
                  Click or drag CSV file
                </p>
                <p className="text-slate-500 dark:text-slate-500 text-sm">
                  Wave Accounting Transaction Export (.csv)
                </p>
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

          <div className="mt-6 flex justify-center items-center gap-2 text-slate-500 dark:text-slate-400 text-sm">
            <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span>Securely process your financial data locally • No data uploaded to external servers</span>
          </div>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-500/5 border border-red-500/20 rounded-xl flex items-center space-x-3 text-red-600 dark:text-red-400 animate-in fade-in slide-in-from-top-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <span className="font-medium text-sm">{error}</span>
        </div>
      )}

      {file && (
        <div className="p-4 bg-brand-primary/5 border border-brand-primary/20 rounded-xl flex items-center justify-between animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-brand-primary/10 rounded-lg text-brand-primary">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="font-medium text-slate-900 dark:text-white text-sm">{file.name}</p>
              <p className="text-xs text-brand-primary mt-0.5">Ready for processing</p>
            </div>
          </div>
          <button
            onClick={() => setFile(null)}
            className="p-2 hover:bg-slate-100 dark:hover:bg-obsidian-800 text-slate-400 hover:text-red-500 rounded-lg transition-colors"
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
