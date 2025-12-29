import { useState } from 'react'
import { useAtom } from 'jotai'
import FileUpload from './components/FileUpload'
import DataPreview from './components/DataPreview'
import ClientDashboard from './pages/ClientDashboard'
import { transactionsAtom } from './store'

function App() {
  const [activeTab, setActiveTab] = useState<'converter' | 'dashboard'>('converter')
  const [transactions] = useAtom(transactionsAtom)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated background */}
      <div className="fixed inset-0 opacity-20">
          <div className="w-full h-full" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center p-2 bg-white/10 backdrop-blur-sm rounded-full mb-6">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 tracking-tight">
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                NeuralSec Wave
              </span>
              <br />
              <span className="text-3xl md:text-4xl text-gray-300 font-light">
                → TurboTax Converter
              </span>
            </h1>
            
            <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
              Seamlessly convert your Wave Accounting CSV exports to TXF format for TurboTax import. 
              Visualize your business expenses with interactive dashboards.
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <div className="flex items-center space-x-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full">
                <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-300 text-sm">Wave CSV Compatible</span>
              </div>
              <div className="flex items-center space-x-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full">
                <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-gray-300 text-sm">TXF Export</span>
              </div>
              <div className="flex items-center space-x-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full">
                <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <span className="text-gray-300 text-sm">Interactive Analytics</span>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
            {/* Navigation Tabs */}
            <div className="border-b border-gray-200 bg-gray-50/50">
              <nav className="flex">
                <button
                  onClick={() => setActiveTab('converter')}
                  className={`flex-1 flex items-center justify-center space-x-2 px-6 py-4 text-sm font-medium transition-all duration-200 ${
                    activeTab === 'converter'
                      ? 'bg-white text-blue-600 border-b-2 border-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <span>Converter</span>
                </button>
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`flex-1 flex items-center justify-center space-x-2 px-6 py-4 text-sm font-medium transition-all duration-200 ${
                    activeTab === 'dashboard'
                      ? 'bg-white text-blue-600 border-b-2 border-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                  }`}
                  disabled={transactions.length === 0}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <span>Dashboard</span>
                  {(() => {
                    const filteredCount = transactions.filter(t => 
                      t['Account Name'] !== 'Owner Investment / Drawings'
                    ).length
                    return filteredCount > 0 && (
                      <span className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-600 rounded-full">
                        {filteredCount}
                      </span>
                    )
                  })()}
                </button>
              </nav>
            </div>

            {/* Tab Content */}
            <div className="p-8">
              {activeTab === 'converter' && (
                <div className="space-y-8">
                  <FileUpload />
                  <DataPreview />
                </div>
              )}

              {activeTab === 'dashboard' && (
                <ClientDashboard />
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-8 text-gray-400 text-sm">
            <p>Securely process your financial data locally • No data uploaded to external servers</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App