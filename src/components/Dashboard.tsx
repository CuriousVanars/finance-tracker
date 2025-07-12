'use client';

import { useState, useEffect } from 'react';
import { Transaction, Category, DashboardData, Goal, RecurringTransaction, Alert } from '@/types';
import { LocalStorage } from '@/utils/storage';
import { calculateDashboardData, formatCurrency, getCurrentMonth, getCurrentYear, updateGoalProgress, checkRecurringTransactionAlerts } from '@/utils/calculations';
import { useAuth } from '@/hooks/useAuth';
import { MonthSelector } from './MonthSelector';
import { SummaryCard } from './SummaryCard';
import { CategorySummaryTable } from './CategorySummaryTable';
import { TransactionForm } from './TransactionForm';
import { RecentTransactions } from './RecentTransactions';
import { Charts } from './Charts';
import { ExportButton } from './ExportButton';
import { Settings as SettingsComponent } from './Settings';
import { Goals } from './Goals';
import { RecurringTransactions } from './RecurringTransactions';
import { Alerts } from './Alerts';
import { GoalsProgress } from './GoalsProgress';
import { Plus, RefreshCw, Settings, Target, Repeat, Bell, Menu, X, LogOut } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

export default function Dashboard() {
  const { signOut } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());
  const [selectedYear, setSelectedYear] = useState(getCurrentYear());
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showGoals, setShowGoals] = useState(false);
  const [showRecurringTransactions, setShowRecurringTransactions] = useState(false);
  const [showAlerts, setShowAlerts] = useState(false);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [recurringTransactions, setRecurringTransactions] = useState<RecurringTransaction[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Initialize data on component mount
    LocalStorage.initializeDefaultData();
    loadData();
  }, []);

  useEffect(() => {
    // Recalculate dashboard data when month/year changes
    if (transactions.length >= 0 && categories.length > 0) {
      const data = calculateDashboardData(transactions, categories, selectedMonth, selectedYear);
      setDashboardData(data);
    }
  }, [transactions, categories, selectedMonth, selectedYear]);

  useEffect(() => {
    // Update goal progress when transactions change
    if (goals.length > 0 && transactions.length >= 0) {
      const updatedGoals = updateGoalProgress(goals, transactions);
      const hasChanges = updatedGoals.some((goal, index) => 
        goal.current_amount !== goals[index]?.current_amount
      );
      
      if (hasChanges) {
        setGoals(updatedGoals);
        LocalStorage.saveGoals(updatedGoals);
      }
    }
  }, [transactions, goals]);

  useEffect(() => {
    // Check for recurring transaction alerts
    if (recurringTransactions.length > 0) {
      const updatedAlerts = checkRecurringTransactionAlerts(recurringTransactions, alerts);
      if (updatedAlerts.length !== alerts.length) {
        setAlerts(updatedAlerts);
        LocalStorage.saveAlerts(updatedAlerts);
      }
    }
  }, [recurringTransactions, alerts]);

  const loadData = () => {
    const loadedTransactions = LocalStorage.getTransactions();
    const loadedCategories = LocalStorage.getCategories();
    const loadedGoals = LocalStorage.getGoals();
    const loadedRecurringTransactions = LocalStorage.getRecurringTransactions();
    const loadedAlerts = LocalStorage.getAlerts();
    
    setTransactions(loadedTransactions);
    setCategories(loadedCategories);
    setGoals(loadedGoals);
    setRecurringTransactions(loadedRecurringTransactions);
    
    // Check for new alerts from recurring transactions
    if (loadedRecurringTransactions.length > 0) {
      const updatedAlerts = checkRecurringTransactionAlerts(loadedRecurringTransactions, loadedAlerts);
      setAlerts(updatedAlerts);
      if (updatedAlerts.length !== loadedAlerts.length) {
        LocalStorage.saveAlerts(updatedAlerts);
      }
    } else {
      setAlerts(loadedAlerts);
    }
  };

  const handleAddTransaction = (transaction: Transaction) => {
    LocalStorage.saveTransaction(transaction);
    loadData();
    setShowTransactionForm(false);
  };

  const handleDeleteTransaction = (id: string) => {
    LocalStorage.deleteTransaction(id);
    loadData();
  };

  const handleUpdateBudget = (categoryId: string, amount: number) => {
    const updatedCategories = categories.map(cat => 
      cat.id === categoryId ? { ...cat, budgeted_amount: amount } : cat
    );
    LocalStorage.saveCategories(updatedCategories);
    setCategories(updatedCategories);
  };

  const handleUpdateCategories = (updatedCategories: Category[]) => {
    LocalStorage.saveCategories(updatedCategories);
    setCategories(updatedCategories);
  };

  const handleUpdateGoals = (updatedGoals: Goal[]) => {
    LocalStorage.saveGoals(updatedGoals);
    setGoals(updatedGoals);
  };

  const handleUpdateRecurringTransactions = (updatedTransactions: RecurringTransaction[]) => {
    LocalStorage.saveRecurringTransactions(updatedTransactions);
    setRecurringTransactions(updatedTransactions);
  };

  const handleUpdateAlerts = (updatedAlerts: Alert[]) => {
    LocalStorage.saveAlerts(updatedAlerts);
    setAlerts(updatedAlerts);
  };

  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to log out?')) {
      const { error } = await signOut();
      if (error) {
        alert('Error logging out: ' + error.message);
      }
    }
  };

  const handleCreateRecurringTransaction = (recurringTransaction: RecurringTransaction) => {
    const newTransaction: Transaction = {
      id: uuidv4(),
      date: new Date().toISOString().split('T')[0],
      amount: recurringTransaction.amount,
      type: recurringTransaction.type,
      category: recurringTransaction.category,
      description: `Auto-created from recurring: ${recurringTransaction.name}`,
      created_at: new Date().toISOString()
    };
    
    // Add the transaction
    LocalStorage.saveTransaction(newTransaction);
    
    // Update the recurring transaction's next due date
    const updatedRecurringTransactions = recurringTransactions.map(rt => {
      if (rt.id === recurringTransaction.id) {
        const nextDueDate = calculateNextDueDate(rt.next_due_date, rt.frequency);
        return { ...rt, next_due_date: nextDueDate };
      }
      return rt;
    });
    
    LocalStorage.saveRecurringTransactions(updatedRecurringTransactions);
    
    // Reload data to refresh the UI
    loadData();
  };

  const handleCreateFromAlert = (alertId: string) => {
    // Find the alert to get the recurring transaction name
    const alert = alerts.find(a => a.id === alertId);
    if (!alert || alert.type !== 'recurring_due') return;
    
    // Extract transaction name from alert message
    const match = alert.message.match(/"([^"]*)"/);  
    if (!match) return;
    
    const transactionName = match[1];
    const recurringTransaction = recurringTransactions.find(rt => rt.name === transactionName);
    
    if (recurringTransaction) {
      handleCreateRecurringTransaction(recurringTransaction);
    }
  };
  
  const calculateNextDueDate = (currentDueDate: string, frequency: string): string => {
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
  };

  const remainingAmount = dashboardData 
    ? dashboardData.summary.actual_income - dashboardData.summary.actual_expenses - dashboardData.summary.actual_savings
    : 0;

  if (!dashboardData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p>Loading your financial data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex-1 min-w-0">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 truncate">Finance Tracker</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 hidden sm:block">Track every penny you spend or save</p>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-3">
              <ExportButton />
              <button
                onClick={() => setShowAlerts(true)}
                className="relative inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                <Bell className="h-4 w-4 mr-2" />
                Alerts
                {alerts.filter(alert => !alert.is_read).length > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {alerts.filter(alert => !alert.is_read).length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setShowGoals(true)}
                className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                <Target className="h-4 w-4 mr-2" />
                Goals
              </button>
              <button
                onClick={() => setShowRecurringTransactions(true)}
                className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                <Repeat className="h-4 w-4 mr-2" />
                Recurring
              </button>
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </button>
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-3 py-2 border border-red-300 dark:border-red-600 rounded-md text-sm font-medium text-red-700 dark:text-red-400 bg-white dark:bg-gray-700 hover:bg-red-50 dark:hover:bg-red-900"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </button>
              <button
                onClick={() => setShowTransactionForm(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Transaction
              </button>
            </div>
            
            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center space-x-2">
              <button
                onClick={() => setShowTransactionForm(true)}
                className="inline-flex items-center px-3 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4" />
              </button>
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </button>
            </div>
          </div>
          
          {/* Mobile Navigation Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden border-t border-gray-200 dark:border-gray-700 py-4">
              <div className="flex flex-col space-y-2">
                <button
                  onClick={() => { setShowAlerts(true); setIsMobileMenuOpen(false); }}
                  className="relative flex items-center px-3 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md"
                >
                  <Bell className="h-4 w-4 mr-3" />
                  Alerts
                  {alerts.filter(alert => !alert.is_read).length > 0 && (
                    <span className="ml-auto h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {alerts.filter(alert => !alert.is_read).length}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => { setShowGoals(true); setIsMobileMenuOpen(false); }}
                  className="flex items-center px-3 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md"
                >
                  <Target className="h-4 w-4 mr-3" />
                  Goals
                </button>
                <button
                  onClick={() => { setShowRecurringTransactions(true); setIsMobileMenuOpen(false); }}
                  className="flex items-center px-3 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md"
                >
                  <Repeat className="h-4 w-4 mr-3" />
                  Recurring Transactions
                </button>
                <button
                  onClick={() => { setShowSettings(!showSettings); setIsMobileMenuOpen(false); }}
                  className="flex items-center px-3 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md"
                >
                  <Settings className="h-4 w-4 mr-3" />
                  Settings
                </button>
                <button
                  onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }}
                  className="flex items-center px-3 py-2 text-left text-sm font-medium text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900 rounded-md"
                >
                  <LogOut className="h-4 w-4 mr-3" />
                  Logout
                </button>
                <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                  <ExportButton />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Month Selector */}
        <div className="mb-8">
          <MonthSelector
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
            onMonthChange={setSelectedMonth}
            onYearChange={setSelectedYear}
          />
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <SummaryCard
            title="Expected Income"
            amount={dashboardData.summary.expected_income}
            textColor="text-green-600"
            bgColor="bg-green-50"
          />
          <SummaryCard
            title="Actual Income"
            amount={dashboardData.summary.actual_income}
            textColor="text-green-700"
            bgColor="bg-green-100"
          />
          <SummaryCard
            title="Expected Expenses"
            amount={dashboardData.summary.expected_expenses}
            textColor="text-red-600"
            bgColor="bg-red-50"
          />
          <SummaryCard
            title="Actual Expenses"
            amount={dashboardData.summary.actual_expenses}
            textColor="text-red-700"
            bgColor="bg-red-100"
          />
        </div>

        {/* Remaining Amount */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Amount Left</h3>
            <p className={`text-3xl font-bold ${remainingAmount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(remainingAmount)}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Income - Expenses - Savings
            </p>
          </div>
        </div>

        {/* Goals Progress */}
        <GoalsProgress goals={goals} />

        {/* Category Summaries */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-6 sm:mb-8">
          <CategorySummaryTable
            title="Income Summary"
            data={dashboardData.income_summary}
            type="income"
            categories={categories}
            onUpdateBudget={handleUpdateBudget}
          />
          <CategorySummaryTable
            title="Expense Summary"
            data={dashboardData.expense_summary}
            type="expense"
            categories={categories}
            onUpdateBudget={handleUpdateBudget}
          />
          <CategorySummaryTable
            title="Saving Summary"
            data={dashboardData.saving_summary}
            type="saving"
            categories={categories}
            onUpdateBudget={handleUpdateBudget}
          />
        </div>

        {/* Charts */}
        <div className="mb-8">
          <Charts dashboardData={dashboardData} />
        </div>

        {/* Recent Transactions */}
        <RecentTransactions
          transactions={dashboardData.recent_transactions}
          onDeleteTransaction={handleDeleteTransaction}
        />
      </div>

      {/* Transaction Form Modal */}
      {showTransactionForm && (
        <TransactionForm
          categories={categories}
          onSubmit={handleAddTransaction}
          onClose={() => setShowTransactionForm(false)}
        />
      )}

      {/* Settings Modal */}
      {showSettings && (
        <SettingsComponent
          categories={categories}
          onUpdateCategories={handleUpdateCategories}
          onClose={() => setShowSettings(false)}
        />
      )}

      {/* Goals Modal */}
      {showGoals && (
        <Goals
          goals={goals}
          categories={categories}
          onUpdateGoals={handleUpdateGoals}
          onClose={() => setShowGoals(false)}
        />
      )}

      {/* Recurring Transactions Modal */}
      {showRecurringTransactions && (
        <RecurringTransactions
          recurringTransactions={recurringTransactions}
          categories={categories}
          onUpdateRecurringTransactions={handleUpdateRecurringTransactions}
          onClose={() => setShowRecurringTransactions(false)}
        />
      )}

      {/* Alerts Modal */}
      {showAlerts && (
        <Alerts
          alerts={alerts}
          onUpdateAlerts={handleUpdateAlerts}
          onClose={() => setShowAlerts(false)}
          onCreateRecurringTransaction={handleCreateFromAlert}
        />
      )}
    </div>
  );
}
