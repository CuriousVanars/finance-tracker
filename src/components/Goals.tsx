'use client';

import { useState } from 'react';
import { Goal, Category } from '@/types';
import { X, Plus, Target, Calendar, TrendingUp, Edit2, Trash2 } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { formatCurrency } from '@/utils/calculations';

interface GoalsProps {
  goals: Goal[];
  categories: Category[];
  onUpdateGoals: (goals: Goal[]) => void;
  onClose: () => void;
}

export function Goals({ goals, categories, onUpdateGoals, onClose }: GoalsProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState({
    name: '',
    target_amount: '',
    deadline: '',
    category: '',
    type: 'saving' as 'saving' | 'expense' | 'income',
    description: ''
  });
  const [formData, setFormData] = useState({
    name: '',
    target_amount: '',
    deadline: '',
    category: '',
    type: 'saving' as 'saving' | 'expense' | 'income',
    description: ''
  });

  const handleAddGoal = () => {
    if (!formData.name || !formData.target_amount || !formData.deadline || !formData.category) {
      alert('Please fill in all required fields');
      return;
    }

    const newGoal: Goal = {
      id: uuidv4(),
      name: formData.name,
      target_amount: parseFloat(formData.target_amount),
      current_amount: 0,
      deadline: formData.deadline,
      category: formData.category,
      type: formData.type,
      description: formData.description || undefined,
      created_at: new Date().toISOString()
    };

    onUpdateGoals([...goals, newGoal]);
    setFormData({
      name: '',
      target_amount: '',
      deadline: '',
      category: '',
      type: 'saving',
      description: ''
    });
    setShowAddForm(false);
  };

  const handleUpdateGoal = (goalId: string, updates: Partial<Goal>) => {
    const updatedGoals = goals.map(goal =>
      goal.id === goalId ? { ...goal, ...updates } : goal
    );
    onUpdateGoals(updatedGoals);
    setEditingGoal(null);
  };

  const handleDeleteGoal = (goalId: string) => {
    if (window.confirm('Are you sure you want to delete this goal?')) {
      const updatedGoals = goals.filter(goal => goal.id !== goalId);
      onUpdateGoals(updatedGoals);
    }
  };

  const getProgressPercentage = (goal: Goal) => {
    return Math.min((goal.current_amount / goal.target_amount) * 100, 100);
  };

  const getDaysRemaining = (deadline: string) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getAvailableCategories = (type: 'saving' | 'expense' | 'income') => {
    return categories.filter(cat => cat.type === type);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <Target className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-900">Financial Goals</h2>
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
          {/* Add Goal Button */}
          <div className="mb-6">
            <button
              onClick={() => setShowAddForm(true)}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add New Goal
            </button>
          </div>

          {/* Add Goal Form */}
          {showAddForm && (
            <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
              <h3 className="font-medium text-gray-900 mb-4">Add New Goal</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Goal Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Emergency Fund"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Target Amount *</label>
                  <input
                    type="number"
                    value={formData.target_amount}
                    onChange={(e) => setFormData({ ...formData, target_amount: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="100000"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type *</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as 'saving' | 'expense' | 'income', category: '' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="saving">Saving Goal</option>
                    <option value="expense">Expense Goal</option>
                    <option value="income">Income Goal</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Category</option>
                    {getAvailableCategories(formData.type).map(cat => (
                      <option key={cat.id} value={cat.name}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Deadline *</label>
                  <input
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <input
                    type="text"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Optional description"
                  />
                </div>
              </div>
              <div className="flex space-x-3 mt-4">
                <button
                  onClick={handleAddGoal}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Add Goal
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

          {/* Edit Goal Form */}
          {editingGoal && (
            <div className="mb-6 p-4 border border-blue-200 rounded-lg bg-blue-50">
              <h3 className="font-medium text-gray-900 mb-4">Edit Goal</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Goal Name *</label>
                  <input
                    type="text"
                    value={editFormData.name}
                    onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Target Amount *</label>
                  <input
                    type="number"
                    value={editFormData.target_amount}
                    onChange={(e) => setEditFormData({ ...editFormData, target_amount: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type *</label>
                  <select
                    value={editFormData.type}
                    onChange={(e) => setEditFormData({ ...editFormData, type: e.target.value as 'saving' | 'expense' | 'income', category: '' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="saving">Saving Goal</option>
                    <option value="expense">Expense Goal</option>
                    <option value="income">Income Goal</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                  <select
                    value={editFormData.category}
                    onChange={(e) => setEditFormData({ ...editFormData, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Category</option>
                    {getAvailableCategories(editFormData.type).map(cat => (
                      <option key={cat.id} value={cat.name}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Deadline *</label>
                  <input
                    type="date"
                    value={editFormData.deadline}
                    onChange={(e) => setEditFormData({ ...editFormData, deadline: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <input
                    type="text"
                    value={editFormData.description}
                    onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Optional description"
                  />
                </div>
              </div>
              <div className="flex space-x-3 mt-4">
                <button
                  onClick={() => {
                    handleUpdateGoal(editingGoal, {
                      name: editFormData.name,
                      target_amount: parseFloat(editFormData.target_amount),
                      deadline: editFormData.deadline,
                      category: editFormData.category,
                      type: editFormData.type,
                      description: editFormData.description || undefined
                    });
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Update Goal
                </button>
                <button
                  onClick={() => setEditingGoal(null)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Goals List */}
          <div className="space-y-4">
            {goals.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Target className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p className="text-lg font-medium">No goals set yet</p>
                <p>Create your first financial goal to start tracking your progress!</p>
              </div>
            ) : (
              goals.map((goal) => {
                const progress = getProgressPercentage(goal);
                const daysRemaining = getDaysRemaining(goal.deadline);
                const isOverdue = daysRemaining < 0;
                
                return (
                  <div key={goal.id} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{goal.name}</h3>
                        <p className="text-sm text-gray-600 capitalize">{goal.type} Goal • {goal.category}</p>
                        {goal.description && (
                          <p className="text-sm text-gray-500 mt-1">{goal.description}</p>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => {
                            setEditingGoal(goal.id);
                            setEditFormData({
                              name: goal.name,
                              target_amount: goal.target_amount.toString(),
                              deadline: goal.deadline,
                              category: goal.category,
                              type: goal.type,
                              description: goal.description || ''
                            });
                          }}
                          className="p-1 text-blue-600 hover:text-blue-800"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteGoal(goal.id)}
                          className="p-1 text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span>Progress: {formatCurrency(goal.current_amount)} / {formatCurrency(goal.target_amount)}</span>
                        <span className="font-medium">{progress.toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-300 ${
                            progress >= 100 ? 'bg-green-500' : progress >= 75 ? 'bg-blue-500' : progress >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${Math.min(progress, 100)}%` }}
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span className={isOverdue ? 'text-red-600 font-medium' : 'text-gray-600'}>
                          {isOverdue 
                            ? `Overdue by ${Math.abs(daysRemaining)} days`
                            : `${daysRemaining} days remaining`
                          }
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <TrendingUp className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-600">
                          Need {formatCurrency((goal.target_amount - goal.current_amount) / Math.max(daysRemaining, 1))} per day
                        </span>
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
