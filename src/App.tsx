import { useState } from 'react'
import { useAtom } from 'jotai'
import FileUpload from './components/FileUpload'
import DataPreview from './components/DataPreview'
import ClientDashboard from './pages/ClientDashboard'
import { transactionsAtom } from './store'
import { ThemeProvider } from './context/ThemeContext'
import AppLayout from './components/layout/AppLayout'
import StepsGuide from './components/StepsGuide'

function App() {
  const [activeTab, setActiveTab] = useState<'converter' | 'dashboard'>('converter')
  const [transactions] = useAtom(transactionsAtom)

  const filteredCount = transactions.filter(t =>
    t['Account Name'] !== 'Owner Investment / Drawings' &&
    t['Account Name'] !== 'Cash on Hand'
  ).length

  return (
    <ThemeProvider>
      <AppLayout
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        transactionCount={filteredCount}
      >
        {activeTab === 'converter' && (
          <div className="space-y-8">
            {/* Header removed to match screenshot style */}

            <FileUpload />
            <DataPreview />
            <StepsGuide />
          </div>
        )}

        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            <header className="mb-10">
              <h2 className="font-display text-3xl font-bold text-slate-900 dark:text-white mb-2">
                Financial Overview
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-lg">
                Analyze your income, expenses, and trends visually.
              </p>
            </header>
            <ClientDashboard />
          </div>
        )}
      </AppLayout>
    </ThemeProvider>
  )
}

export default App