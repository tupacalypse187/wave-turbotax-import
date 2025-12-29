import FileUpload from '../components/FileUpload'
import DataPreview from '../components/DataPreview'

export default function Converter() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">CSV to TXF Converter</h1>
        <p className="text-gray-500 mt-1">Upload your Wave accounting export and convert to TurboTax format</p>
      </div>
      <FileUpload />
      <DataPreview />
    </div>
  )
}
