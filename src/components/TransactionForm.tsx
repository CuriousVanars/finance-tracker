'use client';

import { useState } from 'react';
import { Transaction, Category } from '@/types';
import { X } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface TransactionFormProps {
  categories: Category[];
  onSubmit: (transaction: Transaction) => void;
  onClose: () => void;
}

export function TransactionForm({ categories, onSubmit, onClose }: TransactionFormProps) {
  const [type, setType] = useState<'income' | 'expense' | 'saving'>('expense');
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');

  const availableCategories = categories.filter(cat => cat.type === type);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!category || !amount || !date) {
      alert('Please fill in all required fields');
      return;
    }

    const transaction: Transaction = {
      id: uuidv4(),
      type,
      category,
      amount: parseFloat(amount),
      date,
      description: description || undefined,
      created_at: new Date().toISOString()
    };

    onSubmit(transaction);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-black dark:bg-opacity-70 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-lg w-full max-h-[90vh] shadow-2xl flex flex-col border dark:border-gray-700">
        {/* Header */}
        <div className="flex justify-between items-center p-6 sm:p-8 pb-4 sm:pb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">Add Transaction</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
          >
            <X className="h-6 w-6 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Form - Scrollable Content */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="flex-1 overflow-y-auto px-6 sm:px-8">
            <div className="space-y-6 pb-6">
              {/* Transaction Type */}
              <div>
                <label className="block text-base font-medium text-gray-900 dark:text-gray-100 mb-4">
                  Transaction Type *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { key: 'income', label: 'Income' },
                    { key: 'expense', label: 'Expense' },
                    { key: 'saving', label: 'Saving' }
                  ].map((item) => (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => {
                        setType(item.key as 'income' | 'expense' | 'saving');
                        setCategory(''); // Reset category when type changes
                      }}
                      className={`px-4 py-3 rounded-xl text-base font-medium transition-all duration-200 min-h-[48px] ${
                        type === item.key
                          ? 'bg-blue-600 text-white shadow-lg transform scale-105 dark:bg-blue-500'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-102 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Category */}
              <div>
                <label htmlFor="category" className="block text-base font-medium text-gray-900 dark:text-gray-100 mb-3">
                  Category *
                </label>
                <div className="relative">
                  <select
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-4 text-base border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 dark:text-gray-100 appearance-none min-h-[48px]"
                    required
                  >
                    <option value="" className="text-gray-500 dark:text-gray-400">Select a category</option>
                    {availableCategories.map((cat) => (
                      <option key={cat.id} value={cat.name} className="text-gray-900 dark:text-gray-100">
                        {cat.name}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Amount */}
              <div>
                <label htmlFor="amount" className="block text-base font-medium text-gray-900 dark:text-gray-100 mb-3">
                  Amount (₹) *
                </label>
                <input
                  type="number"
                  id="amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full px-4 py-4 text-base border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 dark:text-gray-100 min-h-[48px]"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  required
                />
              </div>

              {/* Date */}
              <div>
                <label htmlFor="date" className="block text-base font-medium text-gray-900 dark:text-gray-100 mb-3">
                  Date *
                </label>
                <div className="relative">
                  <input
                    type="date"
                    id="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-4 py-4 text-base border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 dark:text-gray-100 min-h-[48px]"
                    required
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-base font-medium text-gray-900 dark:text-gray-100 mb-3">
                  Description (Optional)
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-4 text-base border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none bg-white dark:bg-gray-700 dark:text-gray-100"
                  placeholder="Transaction description..."
                />
              </div>
            </div>
          </div>

          {/* Action Buttons - Fixed at bottom */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 p-6 sm:p-8 pt-4 sm:pt-6 border-t border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-b-2xl">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-4 text-base font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors min-h-[48px]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-4 text-base font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors shadow-lg min-h-[48px]"
            >
              Add Transaction
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
