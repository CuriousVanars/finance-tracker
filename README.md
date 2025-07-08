# Personal Finance Tracker

A comprehensive web application to track every penny you spend or save, inspired by spreadsheet-based financial management.

## 🚀 Features

### Monthly Dashboard
- **Monthly Summary**: View expected vs actual income, expenses, and savings
- **Amount Left Calculator**: See your remaining balance (Income - Expenses - Savings)
- **Month Navigation**: Easily switch between different months and years

### Income Tracking
- Track multiple income sources (Paycheck 1, Paycheck 2, Side Hustle, etc.)
- Compare expected vs actual income
- View income breakdown and trends

### Expense Management
- Comprehensive expense categories (Rent, Food, Travel, Entertainment, etc.)
- Budget setting with real-time tracking
- Expense vs budget comparison
- Visual expense breakdown charts

### Savings Tracking
- Multiple saving categories (PPF, SIP, Emergency Fund, etc.)
- Track saving goals vs actual savings
- Monitor saving progress

### Transaction Management
- Add, view, and delete transactions
- Date-based filtering
- Detailed transaction history
- Transaction categorization

### Analytics & Visualization
- **Budget vs Actual Charts**: Compare planned vs actual spending
- **Expense Breakdown**: Pie chart showing expense distribution
- **Monthly Trends**: Track financial patterns over time

### Data Management
- **Local Storage**: All data stored locally in your browser
- **CSV Export**: Export all transactions for external analysis
- **Data Persistence**: Your data is saved automatically

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **Storage**: Browser Local Storage
- **Build Tool**: Next.js with Turbopack

## 📦 Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run the development server**:
   ```bash
   npm run dev
   ```

3. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎯 Usage

### Getting Started
1. **Set Your Budget**: Click on expense categories and set your monthly budget amounts
2. **Add Transactions**: Use the "Add Transaction" button to log income, expenses, or savings
3. **Monitor Progress**: View your dashboard to see how you're tracking against your budget
4. **Export Data**: Use the "Export CSV" button to download your financial data

### Adding Transactions
1. Click the **"Add Transaction"** button in the top navigation
2. Select transaction type: **Income**, **Expense**, or **Saving**
3. Choose the appropriate category
4. Enter the amount and date
5. Add an optional description
6. Click **"Add Transaction"**

### Setting Budgets
1. Navigate to the **Expense Summary** section
2. Click on the budget input field for any expense category
3. Enter your monthly budget amount
4. The app will automatically calculate your remaining budget

### Viewing Analytics
- **Budget vs Actual Chart**: Compare your planned vs actual spending across categories
- **Expense Breakdown**: See which categories consume most of your budget
- **Monthly Navigation**: Use the month selector to view historical data

## 📊 Default Categories

### Income Sources
- Paycheck 1, Paycheck 2, Side Hustle

### Expense Categories
- Rent & Utilities, Travel, Food & Dining, Entertainment, Shopping, Personal Care, Healthcare, Digital Services

### Savings Categories
- PPF, SIP, Emergency Fund, Mutual Funds, Fixed Deposits

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm run build
vercel --prod
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 🔒 Data Privacy

- All data is stored locally in your browser
- No data is sent to external servers
- Use the export feature to backup your data
- Clear browser data will reset the app

---

**Built with ❤️ for better financial management**
