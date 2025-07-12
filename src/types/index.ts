export interface Transaction {
  id: string;
  date: string;
  amount: number;
  type: 'income' | 'expense' | 'saving';
  category: string;
  description?: string;
  created_at?: string;
}

export interface Category {
  id: string;
  name: string;
  type: 'income' | 'expense' | 'saving';
  budgeted_amount: number;
  color?: string;
}

export interface MonthlySummary {
  month: string;
  year: number;
  expected_income: number;
  actual_income: number;
  expected_expenses: number;
  actual_expenses: number;
  expected_savings: number;
  actual_savings: number;
}

export interface CategorySummary {
  category: string;
  budgeted: number;
  actual: number;
  difference: number;
  type: 'income' | 'expense' | 'saving';
}

export interface Goal {
  id: string;
  name: string;
  target_amount: number;
  current_amount: number;
  deadline: string;
  category: string;
  type: 'saving' | 'expense' | 'income';
  created_at: string;
  description?: string;
}

export interface RecurringTransaction {
  id: string;
  name: string;
  amount: number;
  type: 'income' | 'expense' | 'saving';
  category: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
  start_date: string;
  end_date?: string;
  next_due_date: string;
  is_active: boolean;
  description?: string;
  created_at: string;
}

export interface Alert {
  id: string;
  type: 'budget_warning' | 'goal_reminder' | 'recurring_due' | 'unusual_expense';
  title: string;
  message: string;
  dueDate?: string;
  priority: 'low' | 'medium' | 'high';
  isRead: boolean;
  transactionId?: string;
  category?: string;
  amount?: number;
  created_at: string;
  // Legacy fields for backward compatibility
  is_read?: boolean;
  severity?: 'low' | 'medium' | 'high';
}

export interface DashboardData {
  summary: MonthlySummary;
  income_summary: CategorySummary[];
  expense_summary: CategorySummary[];
  saving_summary: CategorySummary[];
  recent_transactions: Transaction[];
  goals?: Goal[];
  alerts?: Alert[];
  recurring_transactions?: RecurringTransaction[];
}
