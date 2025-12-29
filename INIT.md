# 🌊 NeuralSec Wave TurboTax Import

## 📋 Overview

A **cutting-edge React application** for converting Wave Accounting CSV exports to TurboTax TXF format, featuring an **interactive financial dashboard** with advanced visualizations, click-to-filter functionality, and modern glassmorphism design.

## ✨ Enhanced Features

### 🔄 Data Conversion System
- **Drag-and-drop CSV upload** with real-time validation
- **Wave Accounting column mapping**: "Transaction Date", "Amount (One column)", "Account Name"
- **Automatic duplicate filtering**: Removes "Owner Investment / Drawings" entries
- **TXF format generation**: V041 format compatible with TurboTax Desktop
- **Error handling**: Robust parsing with fallback date handling

### 📊 Interactive Dashboard v2.0
- **6 Animated KPI Cards**:
  - 💰 Total Income (positive amounts)
  - 💸 Total Expenses (absolute value)
  - 📈 Net Income (Income - Expenses)
  - 📊 Transaction Count (filtered)
  - ✅ TXF-Ready Count (mappable categories)
  - 🏆 Top Expense Category & Amount

- **Advanced Charts with Click-to-Filter**:
  - 📈 **Income vs Expenses Chart**: Monthly trend analysis with gradient lines
  - 🥧 **Expense Pie Chart**: Interactive slices - click to filter transactions
  - 📊 **Operating Expenses Chart**: Horizontal bars with hover effects

- **Enhanced Transaction Table**:
  - 🔍 **Real-time search** across all fields
  - 📄 **Pagination** (10 rows per page)
  - 🏷️ **Category filtering** from chart interactions
  - 💅 **Modern styling** with hover states and transitions

### 🎨 Modern UI/UX Design
- **Glassmorphism effects**: Backdrop blur and transparency
- **Gradient backgrounds**: Purple-to-slate animated patterns
- **Smooth animations**: 300ms transitions throughout
- **Responsive design**: Mobile-first with Tailwind CSS
- **Tab navigation**: Seamless Converter ↔ Dashboard switching
- **Loading states**: Skeleton components and spinners

### 🔐 Privacy-First Architecture
- **100% client-side processing**: No server uploads
- **In-memory storage**: Data cleared on browser refresh
- **Local file handling**: Secure parsing with PapaParse
- **No third-party tracking**: Zero analytics or cookies

## 🛠️ Technology Stack

| Technology | Purpose | Version |
|------------|---------|---------|
| **React 18** | Frontend Framework | 18.3.1 |
| **TypeScript** | Type Safety | 5.6.2 |
| **Vite** | Build Tool & Dev Server | 6.0.1 |
| **Tailwind CSS 4** | Styling Framework | 4.1.18 |
| **Jotai** | Atomic State Management | 2.10.1 |
| **Recharts** | Data Visualization | 3.6.0 |
| **PapaParse** | CSV Parsing | 5.4.1 |

## 📁 Enhanced Project Structure

```
src/
├── components/
│   ├── ui/
│   │   └── Card.tsx                 # Reusable glassmorphism card
│   ├── dashboard/
│   │   ├── KPICards.tsx             # Animated KPI metrics with icons
│   │   ├── IncomeExpenseChart.tsx   # Monthly trend with gradients
│   │   ├── ExpensePieChart.tsx      # Interactive pie (click-to-filter)
│   │   └── ExpenseSummary.tsx       # Horizontal bars with hover
│   ├── FileUpload.tsx               # Drag-drop CSV with validation
│   └── DataPreview.tsx              # Table preview + TXF download
├── pages/
│   ├── Converter.tsx                 # Converter tab view
│   ├── ClientDashboard.tsx          # Dashboard with all charts
│   ├── TransactionTable.tsx         # Searchable transaction list
│   ├── ExpensePieChart.tsx          # Standalone pie chart
│   ├── ExpenseSummary.tsx           # Standalone bar chart
│   ├── IncomeExpenseChart.tsx       # Standalone line chart
│   └── KPICharts.tsx                # KPI metrics display
├── lib/
│   └── financialUtils.ts            # Enhanced calculations + filtering
├── store/
│   └── index.ts                     # Jotai atoms + filters
├── types/
│   └── index.ts                     # Updated TypeScript interfaces
├── utils/
│   └── txfConverter.ts              # TXF generation with validation
├── App.tsx                          # Main app with glassmorphism UI
├── App.css                          # Component animations & styles
└── main.tsx                         # Entry point
```

## Type System

### Transaction (CSV Data)
Raw transaction data from CSV parsing (string-based amounts).

```typescript
interface Transaction {
  Date?: string
  Amount?: string
  Category?: string
  Description?: string
  [key: string]: string | undefined
}
```

### NormalizedTransaction (Processed Data)
Normalized transaction data for calculations and charts (numeric amounts).

```typescript
interface NormalizedTransaction {
  id: string
  date: Date
  description: string
  amount: number  // Negative for expenses, positive for income
  category: string  // Standardized tax category
  rawCategory: string  // Original Wave category
}
```

### FinancialSummary
Aggregated financial metrics.

```typescript
interface FinancialSummary {
  totalIncome: number
  totalExpenses: number
  netIncome: number
  transactionCount: number
  txfReadyCount: number
  topExpenseCategory: string | null
  topExpenseAmount: number
}
```

## Data Flow

```
User uploads CSV
       ↓
PapaParse (FileUpload.tsx)
       ↓
transactionsAtom (Jotai store) - Raw CSV data
       ↓
normalizedTransactionsAtom (derived) - Processed numeric data
       ↓
├── financialSummaryAtom (derived) - KPI metrics
├── calculateExpenseBreakdown() - Bar chart data
├── calculateMonthlyBreakdown() - Line chart data
└── convertToTXF() - TXF file generation
```

## Setup Instructions

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. **Clone repository**:
   ```bash
   git clone https://github.com/tupacalypse187/wave-turbotax-import.git
   cd wave-turbotax-import
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run development server**:
   ```bash
   npm run dev
   ```

4. **Open in browser**: http://localhost:8501

### Building for Production

```bash
npm run build
npm run preview
```

## Usage

### Converter View

1. **Upload CSV**: Drag and drop your Wave export file or click to browse
2. **Preview Data**: Review first 10 rows of your transactions
3. **Convert**: Click "Convert to TXF" to generate TurboTax import file
4. **Download**: The `.txf` file downloads automatically

### Dashboard View

1. **Upload CSV**: First upload data in Converter view
2. **View Metrics**:
   - KPI cards show overall financial health
   - Charts visualize expense distribution and trends
3. **Analyze**: Hover over charts for detailed breakdowns

### 📋 Wave CSV Format

Your Wave Accounting export requires these **exact column names**:

| Column | Required | Wave Column Name | Description |
|--------|----------|------------------|-------------|
| Transaction Date | ✅ Yes | `Transaction Date` | Any date format accepted |
| Amount (One column) | ✅ Yes | `Amount (One column)` | Positive/negative, with/without currency |
| Account Name | ✅ Yes | `Account Name` | Category for TXF mapping |
| Description | ❌ No | `Description` | Optional memo field |

### 📄 Wave CSV Example
```csv
Transaction Date,Amount (One column),Account Name,Description,Memo
2025-01-15,-252.11,Computer - Hosting,Google Workspace,Monthly subscription
2025-01-18,-100.00,Software,GitHub Copilot,Developer tools
2025-01-20,5000.00,Service Income,Client consulting,Project payment
2025-01-22,-45.99,Meals,Client lunch meeting,Business expense
2025-01-25,-299.99,Software,Adobe Creative Suite,Annual license
```

### 🔍 Data Processing Rules
- **Automatic filtering**: Excludes "Owner Investment / Drawings" transactions
- **Amount normalization**: Handles currency symbols, commas, parentheses
- **Date parsing**: Flexible with MM/DD/YYYY, DD/MM/YYYY, ISO formats
- **Category mapping**: 58+ Wave categories to Schedule C tax lines

## Category Mapping

The app maps 58+ Wave/Bank categories to TurboTax TXF codes:

### Income Categories (Code 266)
- Sales, Service Income, Consulting Income, Revenue, Gross Receipts

### Expense Categories (Schedule C)
- **Advertising (271)**: Advertising & Promotion, Marketing, Web Hosting
- **Car & Truck (270)**: Vehicle Expenses, Gas & Fuel
- **Contractors (367)**: Contractors, Subcontractors
- **Insurance (275)**: Insurance, Business Insurance, Liability Insurance
- **Interest (276)**: Interest Expense, Credit Card Interest
- **Legal & Professional (277)**: Legal & Professional Services, Legal Fees, Accounting Fees, Consulting Fees
- **Office Expenses (278)**: Office Expenses, Office Supplies, Software, Computer Hardware/Hosting/Software, Small Tools
- **Rent (281)**: Rent
- **Equipment Rental (280)**: Equipment Rental
- **Repairs (282)**: Repairs & Maintenance
- **Taxes & Licenses (286)**: Taxes & Licenses, State Taxes, Permits
- **Travel (283)**: Travel, Airfare, Hotel, Taxi & Rideshare
- **Meals (284)**: Meals, Meals & Entertainment, Client Meals (50% limit)
- **Utilities (287)**: Utilities, Telephone, Mobile Phone, Internet, Computer - Internet, Telephone Wireless
- **Other (298)**: Dues & Subscriptions, Education & Training, Conferences, Bank Service Charges, Merchant Fees, Uniforms, Gifts

Unmapped categories are skipped during TXF conversion (with no warning).

## Architecture Decisions

### Why Jotai?
- Lightweight atomic state management
- Derived atoms for computed values (no manual memoization needed)
- Better performance than Context API for complex derived state

### Why Two Transaction Types?
- **Transaction (strings)**: Represents raw CSV data before processing
- **NormalizedTransaction (numbers)**: Represents processed data for calculations
- Separation allows for robust error handling and type safety

### Why Tailwind + CSS Modules?
- Tailwind for rapid dashboard UI development
- CSS Modules for existing converter components (minimal refactoring)
- Hybrid approach balances speed and maintainability

### Why Recharts?
- Simple declarative API
- React-native implementation
- Good performance for typical use cases
- Easy to customize styling

## Development

### Adding New Charts

1. Create component in `src/components/dashboard/`
2. Use `normalizedTransactionsAtom` for data
3. Import from `financialUtils.ts` for calculations
4. Add to `ClientDashboard.tsx`

### Adding New KPI Metrics

1. Add metric calculation to `calculateFinancialSummary()` in `financialUtils.ts`
2. Add to `KPICards.tsx` kpi array

### Adding New Categories

1. Update `TXF_MAPPING` in `src/utils/txfConverter.ts`
2. Optionally update `CATEGORY_MAPPING` in `src/lib/financialUtils.ts`

## Troubleshooting

### Dependencies not installing
- Delete `node_modules` and `package-lock.json`
- Run `npm install` again

### Tailwind styles not applying
- Ensure `src/index.css` imports are correct
- Check `tailwind.config.js` content paths
- Restart dev server

### Charts not rendering
- Check browser console for errors
- Ensure `normalizedTransactionsAtom` has data
- Verify Recharts installation

### TXF file not importing to TurboTax
- Check that CSV has mapped categories
- Verify amount format (no special characters)
- Ensure TXF header is correct (V041 format)

## 🚀 Recent Enhancements (v2.0)

### ✨ New Interactive Features
- **Click-to-filter functionality** on all charts
- **Real-time transaction search** with instant results
- **Category-based filtering** from pie chart interactions
- **Pagination system** for large datasets
- **Hover states and transitions** throughout the UI

### 🎨 UI/UX Improvements
- **Glassmorphism design** with backdrop blur effects
- **Animated gradient backgrounds** with pattern overlays
- **Loading states** with skeleton components
- **Smooth page transitions** (300ms animations)
- **Responsive breakpoints** for mobile/tablet/desktop

### 📊 Enhanced Visualizations
- **Gradient line charts** with area fills
- **Interactive pie charts** with click handlers
- **Horizontal bar charts** with custom tooltips
- **KPI cards with icons** and trend indicators
- **Color-coded categories** consistent across charts

### 🔧 Technical Improvements
- **TypeScript strict mode** for better type safety
- **Derived state atoms** for efficient reactivity
- **Error boundaries** for graceful failure handling
- **Performance optimizations** with React.memo
- **Build optimizations** with Vite

## 🗺️ Roadmap & Future Enhancements

### 🚀 v2.1 (Coming Soon)
- [ ] **Multi-currency support** with automatic conversion
- [ ] **Custom category mapping** interface for users
- [ ] **Excel/CSV export** from dashboard data
- [ ] **Year-over-year comparison** charts with trends

### 📈 v2.2 (Planned)
- [ ] **Budget tracking** and variance analysis
- [ ] **Expense categorization** AI suggestions
- [ ] **Receipt upload** with image attachment
- [ ] **Tax year filtering** and archiving system
- [ ] **QuickBooks integration** for broader compatibility

### 🌟 v3.0 (Future)
- [ ] **Mobile app** (React Native) for on-the-go tracking
- [ ] **API endpoints** for automated workflows
- [ ] **Team collaboration** features
- [ ] **Advanced reporting** with scheduled emails
- [ ] **Bank integration** for direct transaction sync

## License

MIT License - see LICENSE file for details

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## Support

For issues or questions, please open a GitHub issue.
