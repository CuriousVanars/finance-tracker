import { Transaction, Category, MonthlySummary, CategorySummary, DashboardData, Goal, RecurringTransaction, Alert } from '@/types';
import { format, startOfMonth, endOfMonth, isWithinInterval, differenceInDays, isToday, isBefore } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';

export function calculateMonthlySummary(
  transactions: Transaction[],
  categories: Category[],
  month: string,
  year: number
): MonthlySummary {
  const monthStart = startOfMonth(new Date(year, getMonthNumber(month) - 1));
  const monthEnd = endOfMonth(new Date(year, getMonthNumber(month) - 1));
  
  const monthlyTransactions = transactions.filter(t => {
    const transactionDate = new Date(t.date);
    return isWithinInterval(transactionDate, { start: monthStart, end: monthEnd });
  });

  const incomeCategories = categories.filter(c => c.type === 'income');
  const expenseCategories = categories.filter(c => c.type === 'expense');
  const savingCategories = categories.filter(c => c.type === 'saving');

  const actual_income = monthlyTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const actual_expenses = monthlyTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const actual_savings = monthlyTransactions
    .filter(t => t.type === 'saving')
    .reduce((sum, t) => sum + t.amount, 0);

  const expected_income = incomeCategories.reduce((sum, c) => sum + c.budgeted_amount, 0);
  const expected_expenses = expenseCategories.reduce((sum, c) => sum + c.budgeted_amount, 0);
  const expected_savings = savingCategories.reduce((sum, c) => sum + c.budgeted_amount, 0);

  return {
    month,
    year,
    expected_income,
    actual_income,
    expected_expenses,
    actual_expenses,
    expected_savings,
    actual_savings
  };
}

export function calculateCategorySummaries(
  transactions: Transaction[],
  categories: Category[],
  month: string,
  year: number,
  type: 'income' | 'expense' | 'saving'
): CategorySummary[] {
  const monthStart = startOfMonth(new Date(year, getMonthNumber(month) - 1));
  const monthEnd = endOfMonth(new Date(year, getMonthNumber(month) - 1));
  
  const monthlyTransactions = transactions.filter(t => {
    const transactionDate = new Date(t.date);
    return isWithinInterval(transactionDate, { start: monthStart, end: monthEnd }) && t.type === type;
  });

  const typeCategories = categories.filter(c => c.type === type);

  return typeCategories.map(category => {
    const actual = monthlyTransactions
      .filter(t => t.category === category.name)
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      category: category.name,
      budgeted: category.budgeted_amount,
      actual,
      difference: type === 'expense' ? category.budgeted_amount - actual : actual - category.budgeted_amount,
      type
    };
  });
}

export function calculateDashboardData(
  transactions: Transaction[],
  categories: Category[],
  month: string,
  year: number
): DashboardData {
  const summary = calculateMonthlySummary(transactions, categories, month, year);
  const income_summary = calculateCategorySummaries(transactions, categories, month, year, 'income');
  const expense_summary = calculateCategorySummaries(transactions, categories, month, year, 'expense');
  const saving_summary = calculateCategorySummaries(transactions, categories, month, year, 'saving');
  
  // Get recent transactions (last 10)
  const recent_transactions = transactions
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 10);

  return {
    summary,
    income_summary,
    expense_summary,
    saving_summary,
    recent_transactions
  };
}

function getMonthNumber(month: string): number {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  return months.indexOf(month) + 1;
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function getMonthName(date: Date): string {
  return format(date, 'MMMM');
}

export function getCurrentMonth(): string {
  return getMonthName(new Date());
}

export function getCurrentYear(): number {
  return new Date().getFullYear();
}

export function updateGoalProgress(goals: Goal[], transactions: Transaction[]): Goal[] {
  return goals.map(goal => {
    // Only update saving goals based on transactions
    if (goal.type === 'saving') {
      const relevantTransactions = transactions.filter(transaction => 
        transaction.type === 'saving' && 
        transaction.category === goal.category
      );
      
      const totalAmount = relevantTransactions.reduce((sum, transaction) => 
        sum + transaction.amount, 0
      );
      
      return {
        ...goal,
        current_amount: totalAmount
      };
    }
    
    return goal;
  });
}

export function checkRecurringTransactionAlerts(
  recurringTransactions: RecurringTransaction[],
  existingAlerts: Alert[]
): Alert[] {
  const today = new Date();
  const newAlerts: Alert[] = [];
  
  // Filter only active recurring transactions
  const activeTransactions = recurringTransactions.filter(rt => rt.is_active);
  
  activeTransactions.forEach(transaction => {
    const dueDate = new Date(transaction.next_due_date);
    const daysUntilDue = differenceInDays(dueDate, today);
    
    // Check if there's already an alert for this transaction for today
    const existingAlert = existingAlerts.find(alert => 
      alert.type === 'recurring_due' &&
      alert.message.includes(transaction.name) &&
      new Date(alert.created_at).toDateString() === today.toDateString()
    );
    
    if (!existingAlert) {
      // Create alert if transaction is due today
      if (isToday(dueDate)) {
        newAlerts.push({
          id: uuidv4(),
          type: 'recurring_due',
          message: `Recurring transaction "${transaction.name}" is due today!`,
          category: transaction.category,
          amount: transaction.amount,
          created_at: new Date().toISOString(),
          is_read: false,
          severity: 'high'
        });
      }
      // Create alert if transaction is due in 1-3 days
      else if (daysUntilDue >= 1 && daysUntilDue <= 3) {
        newAlerts.push({
          id: uuidv4(),
          type: 'recurring_due',
          message: `Recurring transaction "${transaction.name}" is due in ${daysUntilDue} day${daysUntilDue === 1 ? '' : 's'}`,
          category: transaction.category,
          amount: transaction.amount,
          created_at: new Date().toISOString(),
          is_read: false,
          severity: daysUntilDue === 1 ? 'high' : 'medium'
        });
      }
      // Create alert if transaction is overdue
      else if (daysUntilDue < 0) {
        const overdueDays = Math.abs(daysUntilDue);
        newAlerts.push({
          id: uuidv4(),
          type: 'recurring_due',
          message: `Recurring transaction "${transaction.name}" is overdue by ${overdueDays} day${overdueDays === 1 ? '' : 's'}!`,
          category: transaction.category,
          amount: transaction.amount,
          created_at: new Date().toISOString(),
          is_read: false,
          severity: 'high'
        });
      }
    }
  });
  
  return [...existingAlerts, ...newAlerts];
}

export function updateRecurringTransactionDates(
  recurringTransactions: RecurringTransaction[]
): RecurringTransaction[] {
  const today = new Date();
  
  return recurringTransactions.map(transaction => {
    const dueDate = new Date(transaction.next_due_date);
    
    // If the transaction is due today or overdue, update the next due date
    if (!isBefore(today, dueDate) && transaction.is_active) {
      const nextDueDate = calculateNextDueDate(transaction.next_due_date, transaction.frequency);
      return {
        ...transaction,
        next_due_date: nextDueDate
      };
    }
    
    return transaction;
  });
}

function calculateNextDueDate(currentDueDate: string, frequency: string): string {
  const date = new Date(currentDueDate);
  
  switch (frequency) {
    case 'daily':
      date.setDate(date.getDate() + 1);
      break;
    case 'weekly':
      date.setDate(date.getDate() + 7);
      break;
    case 'monthly':
      date.setMonth(date.getMonth() + 1);
      break;
    case 'yearly':
      date.setFullYear(date.getFullYear() + 1);
      break;
  }
  
  return date.toISOString().split('T')[0];
}
