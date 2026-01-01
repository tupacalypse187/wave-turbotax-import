import FileUpload from '../components/FileUpload'
import DataPreview from '../components/DataPreview'

export default function Converter() {
  return (
    <div className="space-y-6">
      <div className="text-center py-6">
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">Upload Your Data</h1>
        <p className="text-slate-400 mt-2 text-lg">Export your transactions from Wave Accounting as CSV and drop them here.</p>
      </div>
      <FileUpload />
      <DataPreview />
    </div>
  )
}
