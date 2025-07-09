'use client';

import { useState } from 'react';
import { RecurringTransaction, Category } from '@/types';
import { X, Plus, Repeat, Calendar, Play, Pause, Trash2 } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { formatCurrency } from '@/utils/calculations';

interface RecurringTransactionsProps {
  recurringTransactions: RecurringTransaction[];
  categories: Category[];
  onUpdateRecurringTransactions: (transactions: RecurringTransaction[]) => void;
  onClose: () => void;
}

export function RecurringTransactions({ 
  recurringTransactions, 
  categories, 
  onUpdateRecurringTransactions, 
  onClose 
}: RecurringTransactionsProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    type: 'expense' as 'income' | 'expense' | 'saving',
    category: '',
    frequency: 'monthly' as 'daily' | 'weekly' | 'monthly' | 'yearly',
    start_date: new Date().toISOString().split('T')[0],
    end_date: '',
    description: ''
  });

  const calculateNextDueDate = (startDate: string, frequency: string): string => {
    const start = new Date(startDate);
    
    switch (frequency) {
      case 'daily':
        start.setDate(start.getDate() + 1);
        break;
      case 'weekly':
        start.setDate(start.getDate() + 7);
        break;
      case 'monthly':
        start.setMonth(start.getMonth() + 1);
        break;
      case 'yearly':
        start.setFullYear(start.getFullYear() + 1);
        break;
    }
    
    return start.toISOString().split('T')[0];
  };

  const handleAddRecurringTransaction = () => {
    if (!formData.name || !formData.amount || !formData.category || !formData.start_date) {
      alert('Please fill in all required fields');
      return;
    }

    const newTransaction: RecurringTransaction = {
      id: uuidv4(),
      name: formData.name,
      amount: parseFloat(formData.amount),
      type: formData.type,
      category: formData.category,
      frequency: formData.frequency,
      start_date: formData.start_date,
      end_date: formData.end_date || undefined,
      next_due_date: calculateNextDueDate(formData.start_date, formData.frequency),
      is_active: true,
      description: formData.description || undefined,
      created_at: new Date().toISOString()
    };

    onUpdateRecurringTransactions([...recurringTransactions, newTransaction]);
    setFormData({
      name: '',
      amount: '',
      type: 'expense',
      category: '',
      frequency: 'monthly',
      start_date: new Date().toISOString().split('T')[0],
      end_date: '',
      description: ''
    });
    setShowAddForm(false);
  };

  const handleToggleActive = (transactionId: string) => {
    const updatedTransactions = recurringTransactions.map(transaction =>
      transaction.id === transactionId 
        ? { ...transaction, is_active: !transaction.is_active }
        : transaction
    );
    onUpdateRecurringTransactions(updatedTransactions);
  };

  const handleDeleteRecurring = (transactionId: string) => {
    if (window.confirm('Are you sure you want to delete this recurring transaction?')) {
      const updatedTransactions = recurringTransactions.filter(
        transaction => transaction.id !== transactionId
      );
      onUpdateRecurringTransactions(updatedTransactions);
    }
  };

  const getAvailableCategories = (type: 'income' | 'expense' | 'saving') => {
    return categories.filter(cat => cat.type === type);
  };

  const getDaysUntilDue = (nextDueDate: string) => {
    const today = new Date();
    const dueDate = new Date(nextDueDate);
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getFrequencyText = (frequency: string) => {
    const frequencyMap = {
      daily: 'Daily',
      weekly: 'Weekly',
      monthly: 'Monthly',
      yearly: 'Yearly'
    };
    return frequencyMap[frequency as keyof typeof frequencyMap];
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <Repeat className="h-6 w-6 text-purple-600" />
            <h2 className="text-xl font-bold text-gray-900">Recurring Transactions</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[75vh]">
          {/* Add Button */}
          <div className="mb-6">
            <button
              onClick={() => setShowAddForm(true)}
              className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Recurring Transaction
            </button>
          </div>

          {/* Add Form */}
          {showAddForm && (
            <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
              <h3 className="font-medium text-gray-900 mb-4">Add Recurring Transaction</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="e.g., Monthly Rent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Amount *</label>
                  <input
                    type="number"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="25000"
                    min="0"
                    step="0.01"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type *</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      type: e.target.value as 'income' | 'expense' | 'saving',
                      category: ''
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="expense">Expense</option>
                    <option value="income">Income</option>
                    <option value="saving">Saving</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">Select Category</option>
                    {getAvailableCategories(formData.type).map(cat => (
                      <option key={cat.id} value={cat.name}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Frequency *</label>
                  <select
                    value={formData.frequency}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      frequency: e.target.value as 'daily' | 'weekly' | 'monthly' | 'yearly'
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date *</label>
                  <input
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Date (Optional)</label>
                  <input
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <input
                    type="text"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Optional description"
                  />
                </div>
              </div>
              <div className="flex space-x-3 mt-4">
                <button
                  onClick={handleAddRecurringTransaction}
                  className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                >
                  Add Recurring Transaction
                </button>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Recurring Transactions List */}
          <div className="space-y-4">
            {recurringTransactions.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Repeat className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p className="text-lg font-medium">No recurring transactions set up</p>
                <p>Add recurring transactions to automate your financial tracking!</p>
              </div>
            ) : (
              recurringTransactions.map((transaction) => {
                const daysUntilDue = getDaysUntilDue(transaction.next_due_date);
                const isOverdue = daysUntilDue < 0;
                const isDueSoon = daysUntilDue <= 3 && daysUntilDue >= 0;
                
                return (
                  <div 
                    key={transaction.id} 
                    className={`bg-white border rounded-lg p-6 shadow-sm ${
                      !transaction.is_active ? 'opacity-60' : ''
                    } ${
                      isOverdue ? 'border-red-300 bg-red-50' : 
                      isDueSoon ? 'border-yellow-300 bg-yellow-50' : 
                      'border-gray-200'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="text-lg font-semibold text-gray-900">{transaction.name}</h3>
                          {!transaction.is_active && (
                            <span className="px-2 py-1 text-xs bg-gray-200 text-gray-600 rounded">Paused</span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 capitalize">
                          {transaction.type} • {transaction.category} • {getFrequencyText(transaction.frequency)}
                        </p>
                        {transaction.description && (
                          <p className="text-sm text-gray-500 mt-1">{transaction.description}</p>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`text-lg font-semibold ${
                          transaction.type === 'income' ? 'text-green-600' :
                          transaction.type === 'expense' ? 'text-red-600' :
                          'text-blue-600'
                        }`}>
                          {formatCurrency(transaction.amount)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>
                            Next: {new Date(transaction.next_due_date).toLocaleDateString()}
                          </span>
                        </div>
                        {isOverdue && (
                          <span className="text-red-600 font-medium">
                            Overdue by {Math.abs(daysUntilDue)} days
                          </span>
                        )}
                        {isDueSoon && !isOverdue && (
                          <span className="text-yellow-600 font-medium">
                            Due in {daysUntilDue} days
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleToggleActive(transaction.id)}
                          className={`p-2 rounded-lg transition-colors ${
                            transaction.is_active 
                              ? 'text-orange-600 hover:bg-orange-50' 
                              : 'text-green-600 hover:bg-green-50'
                          }`}
                          title={transaction.is_active ? 'Pause' : 'Resume'}
                        >
                          {transaction.is_active ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                        </button>
                        <button
                          onClick={() => handleDeleteRecurring(transaction.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
