import { Transaction, Category, Goal, RecurringTransaction, Alert } from '@/types';

const STORAGE_KEYS = {
  TRANSACTIONS: 'finance_transactions',
  CATEGORIES: 'finance_categories',
  BUDGETS: 'finance_budgets',
  GOALS: 'finance_goals',
  RECURRING_TRANSACTIONS: 'finance_recurring_transactions',
  ALERTS: 'finance_alerts'
};

// Default categories based on your spreadsheet
const DEFAULT_CATEGORIES: Category[] = [
  // Income categories
  { id: '1', name: 'Paycheck 1', type: 'income', budgeted_amount: 0, color: '#10B981' },
  { id: '2', name: 'Paycheck 2', type: 'income', budgeted_amount: 0, color: '#059669' },
  { id: '3', name: 'Side Hustle', type: 'income', budgeted_amount: 0, color: '#047857' },
  
  // Expense categories
  { id: '4', name: 'Rent', type: 'expense', budgeted_amount: 0, color: '#EF4444' },
  { id: '5', name: 'Rent_Electricity', type: 'expense', budgeted_amount: 0, color: '#DC2626' },
  { id: '6', name: 'Digital Bangalore', type: 'expense', budgeted_amount: 0, color: '#B91C1C' },
  { id: '7', name: 'Travel_Bangalore', type: 'expense', budgeted_amount: 0, color: '#991B1B' },
  { id: '8', name: 'Food Dining', type: 'expense', budgeted_amount: 0, color: '#7F1D1D' },
  { id: '9', name: 'Drink Outing', type: 'expense', budgeted_amount: 0, color: '#F97316' },
  { id: '10', name: 'Entertainment', type: 'expense', budgeted_amount: 0, color: '#EA580C' },
  { id: '11', name: 'Groceries', type: 'expense', budgeted_amount: 0, color: '#C2410C' },
  { id: '12', name: 'Shopping', type: 'expense', budgeted_amount: 0, color: '#9A3412' },
  { id: '13', name: 'Personal Care', type: 'expense', budgeted_amount: 0, color: '#7C2D12' },
  { id: '14', name: 'Beauty', type: 'expense', budgeted_amount: 0, color: '#8B5CF6' },
  { id: '15', name: 'Pet Care', type: 'expense', budgeted_amount: 0, color: '#7C3AED' },
  { id: '16', name: 'Fuel', type: 'expense', budgeted_amount: 0, color: '#6D28D9' },
  { id: '17', name: 'Travel_Jaipur', type: 'expense', budgeted_amount: 0, color: '#5B21B6' },
  { id: '18', name: 'Dentist', type: 'expense', budgeted_amount: 0, color: '#4C1D95' },
  { id: '19', name: 'Zomato', type: 'expense', budgeted_amount: 0, color: '#2563EB' },
  
  // Saving categories
  { id: '20', name: 'PPF', type: 'saving', budgeted_amount: 0, color: '#059669' },
  { id: '21', name: 'Rent Fund', type: 'saving', budgeted_amount: 0, color: '#047857' },
  { id: '22', name: 'Emergency', type: 'saving', budgeted_amount: 0, color: '#065F46' },
  { id: '23', name: 'SIP', type: 'saving', budgeted_amount: 0, color: '#064E3B' },
  { id: '24', name: 'Fuel Card', type: 'saving', budgeted_amount: 0, color: '#10B981' },
  { id: '25', name: 'Fixed Card', type: 'saving', budgeted_amount: 0, color: '#34D399' },
  { id: '26', name: 'Liquid Mutual Funds', type: 'saving', budgeted_amount: 0, color: '#6EE7B7' }
];

export class LocalStorage {
  static getTransactions(): Transaction[] {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    return data ? JSON.parse(data) : [];
  }

  static saveTransaction(transaction: Transaction): void {
    if (typeof window === 'undefined') return;
    const transactions = this.getTransactions();
    const existingIndex = transactions.findIndex(t => t.id === transaction.id);
    
    if (existingIndex >= 0) {
      transactions[existingIndex] = transaction;
    } else {
      transactions.push(transaction);
    }
    
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
  }

  static deleteTransaction(id: string): void {
    if (typeof window === 'undefined') return;
    const transactions = this.getTransactions().filter(t => t.id !== id);
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
  }

  static getCategories(): Category[] {
    if (typeof window === 'undefined') return DEFAULT_CATEGORIES;
    const data = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
    return data ? JSON.parse(data) : DEFAULT_CATEGORIES;
  }

  static saveCategories(categories: Category[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
  }

  static addCategory(category: Category): void {
    if (typeof window === 'undefined') return;
    const categories = this.getCategories();
    categories.push(category);
    this.saveCategories(categories);
  }

  static updateCategory(categoryId: string, updates: Partial<Category>): void {
    if (typeof window === 'undefined') return;
    const categories = this.getCategories();
    const updatedCategories = categories.map(cat =>
      cat.id === categoryId ? { ...cat, ...updates } : cat
    );
    this.saveCategories(updatedCategories);
  }

  static deleteCategory(categoryId: string): void {
    if (typeof window === 'undefined') return;
    const categories = this.getCategories();
    const updatedCategories = categories.filter(cat => cat.id !== categoryId);
    this.saveCategories(updatedCategories);
  }

  static initializeDefaultData(): void {
    if (typeof window === 'undefined') return;
    
    if (!localStorage.getItem(STORAGE_KEYS.CATEGORIES)) {
      this.saveCategories(DEFAULT_CATEGORIES);
    }
  }

  static exportToCSV(): string {
    const transactions = this.getTransactions();
    const headers = ['Date', 'Type', 'Category', 'Amount', 'Description'];
    const rows = transactions.map(t => [
      t.date,
      t.type,
      t.category,
      t.amount.toString(),
      t.description || ''
    ]);
    
    return [headers, ...rows].map(row => row.join(',')).join('\n');
  }

  // Goals management
  static getGoals(): Goal[] {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(STORAGE_KEYS.GOALS);
    return data ? JSON.parse(data) : [];
  }

  static saveGoals(goals: Goal[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(goals));
  }

  static updateGoalProgress(goalId: string, currentAmount: number): void {
    if (typeof window === 'undefined') return;
    const goals = this.getGoals();
    const updatedGoals = goals.map(goal =>
      goal.id === goalId ? { ...goal, current_amount: currentAmount } : goal
    );
    this.saveGoals(updatedGoals);
  }

  // Recurring transactions management
  static getRecurringTransactions(): RecurringTransaction[] {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(STORAGE_KEYS.RECURRING_TRANSACTIONS);
    return data ? JSON.parse(data) : [];
  }

  static saveRecurringTransactions(transactions: RecurringTransaction[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.RECURRING_TRANSACTIONS, JSON.stringify(transactions));
  }

  static updateRecurringTransactionNextDue(transactionId: string, nextDueDate: string): void {
    if (typeof window === 'undefined') return;
    const transactions = this.getRecurringTransactions();
    const updatedTransactions = transactions.map(transaction =>
      transaction.id === transactionId ? { ...transaction, next_due_date: nextDueDate } : transaction
    );
    this.saveRecurringTransactions(updatedTransactions);
  }

  // Alerts management
  static getAlerts(): Alert[] {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(STORAGE_KEYS.ALERTS);
    return data ? JSON.parse(data) : [];
  }

  static saveAlerts(alerts: Alert[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.ALERTS, JSON.stringify(alerts));
  }

  static addAlert(alert: Alert): void {
    if (typeof window === 'undefined') return;
    const alerts = this.getAlerts();
    alerts.unshift(alert); // Add to beginning for newest first
    this.saveAlerts(alerts);
  }

  static clearAllData(): void {
    if (typeof window === 'undefined') return;
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  }
}
