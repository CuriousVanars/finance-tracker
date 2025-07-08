'use client';

import { useState } from 'react';
import { Category } from '@/types';
import { X, Plus, Trash2, Edit2, Save, Palette } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface SettingsProps {
  categories: Category[];
  onUpdateCategories: (categories: Category[]) => void;
  onClose: () => void;
}

const PREDEFINED_COLORS = [
  '#10B981', '#059669', '#047857', '#065F46', '#064E3B',
  '#EF4444', '#DC2626', '#B91C1C', '#991B1B', '#7F1D1D',
  '#F97316', '#EA580C', '#C2410C', '#9A3412', '#7C2D12',
  '#8B5CF6', '#7C3AED', '#6D28D9', '#5B21B6', '#4C1D95',
  '#2563EB', '#1D4ED8', '#1E40AF', '#1E3A8A', '#1E293B',
  '#06B6D4', '#0891B2', '#0E7490', '#155E75', '#164E63',
  '#84CC16', '#65A30D', '#4D7C0F', '#365314', '#1A2E05',
];

export function Settings({ categories, onUpdateCategories, onClose }: SettingsProps) {
  const [activeTab, setActiveTab] = useState<'income' | 'expense' | 'saving'>('income');
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryColor, setNewCategoryColor] = useState(PREDEFINED_COLORS[0]);
  const [showColorPicker, setShowColorPicker] = useState<string | null>(null);

  const getCategoriesByType = (type: 'income' | 'expense' | 'saving') => {
    return categories.filter(cat => cat.type === type);
  };

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) {
      alert('Please enter a category name');
      return;
    }

    const newCategory: Category = {
      id: uuidv4(),
      name: newCategoryName.trim(),
      type: activeTab,
      budgeted_amount: 0,
      color: newCategoryColor
    };

    const updatedCategories = [...categories, newCategory];
    onUpdateCategories(updatedCategories);
    setNewCategoryName('');
    setNewCategoryColor(PREDEFINED_COLORS[0]);
  };

  const handleUpdateCategory = (categoryId: string, updatedData: Partial<Category>) => {
    const updatedCategories = categories.map(cat =>
      cat.id === categoryId ? { ...cat, ...updatedData } : cat
    );
    onUpdateCategories(updatedCategories);
    setEditingCategory(null);
  };

  const handleDeleteCategory = (categoryId: string) => {
    if (window.confirm('Are you sure you want to delete this category? This action cannot be undone.')) {
      const updatedCategories = categories.filter(cat => cat.id !== categoryId);
      onUpdateCategories(updatedCategories);
    }
  };

  const CategoryRow = ({ category }: { category: Category }) => {
    const [editName, setEditName] = useState(category.name);
    const [editColor, setEditColor] = useState(category.color || PREDEFINED_COLORS[0]);
    const isEditing = editingCategory === category.id;

    return (
      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
        <div className="flex items-center space-x-3 flex-1">
          <div 
            className="w-4 h-4 rounded-full border-2 border-gray-300 cursor-pointer"
            style={{ backgroundColor: isEditing ? editColor : category.color }}
            onClick={() => setShowColorPicker(showColorPicker === category.id ? null : category.id)}
          />
          {isEditing ? (
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleUpdateCategory(category.id, { name: editName, color: editColor });
                } else if (e.key === 'Escape') {
                  setEditingCategory(null);
                  setEditName(category.name);
                  setEditColor(category.color || PREDEFINED_COLORS[0]);
                }
              }}
            />
          ) : (
            <span className="text-sm font-medium text-gray-900">{category.name}</span>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          {isEditing ? (
            <button
              onClick={() => handleUpdateCategory(category.id, { name: editName, color: editColor })}
              className="p-1 text-green-600 hover:text-green-800 transition-colors"
              title="Save changes"
            >
              <Save className="h-4 w-4" />
            </button>
          ) : (
            <button
              onClick={() => {
                setEditingCategory(category.id);
                setEditName(category.name);
                setEditColor(category.color || PREDEFINED_COLORS[0]);
              }}
              className="p-1 text-blue-600 hover:text-blue-800 transition-colors"
              title="Edit category"
            >
              <Edit2 className="h-4 w-4" />
            </button>
          )}
          <button
            onClick={() => handleDeleteCategory(category.id)}
            className="p-1 text-red-600 hover:text-red-800 transition-colors"
            title="Delete category"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>

        {/* Color Picker */}
        {showColorPicker === category.id && (
          <div className="absolute z-10 mt-2 p-3 bg-white border border-gray-300 rounded-lg shadow-lg">
            <div className="grid grid-cols-5 gap-2">
              {PREDEFINED_COLORS.map((color) => (
                <button
                  key={color}
                  className="w-6 h-6 rounded-full border-2 border-gray-300 hover:scale-110 transition-transform"
                  style={{ backgroundColor: color }}
                  onClick={() => {
                    if (isEditing) {
                      setEditColor(color);
                    } else {
                      handleUpdateCategory(category.id, { color });
                    }
                    setShowColorPicker(null);
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Settings</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {(['income', 'expense', 'saving'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-1 border-b-2 font-medium text-sm capitalize transition-colors ${
                  activeTab === tab
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab} Categories
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {/* Add New Category */}
          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-3">Add New {activeTab} Category</h3>
            <div className="flex items-center space-x-3">
              <div 
                className="w-6 h-6 rounded-full border-2 border-gray-300 cursor-pointer"
                style={{ backgroundColor: newCategoryColor }}
                onClick={() => setShowColorPicker(showColorPicker === 'new' ? null : 'new')}
              />
              <input
                type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder={`Enter ${activeTab} category name`}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleAddCategory();
                  }
                }}
              />
              <button
                onClick={handleAddCategory}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Add</span>
              </button>
            </div>

            {/* Color Picker for New Category */}
            {showColorPicker === 'new' && (
              <div className="mt-3 p-3 bg-white border border-gray-300 rounded-lg shadow-lg">
                <div className="grid grid-cols-5 gap-2">
                  {PREDEFINED_COLORS.map((color) => (
                    <button
                      key={color}
                      className="w-6 h-6 rounded-full border-2 border-gray-300 hover:scale-110 transition-transform"
                      style={{ backgroundColor: color }}
                      onClick={() => {
                        setNewCategoryColor(color);
                        setShowColorPicker(null);
                      }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Existing Categories */}
          <div>
            <h3 className="font-medium text-gray-900 mb-3">
              Existing {activeTab} Categories ({getCategoriesByType(activeTab).length})
            </h3>
            <div className="space-y-2">
              {getCategoriesByType(activeTab).map((category) => (
                <CategoryRow key={category.id} category={category} />
              ))}
              {getCategoriesByType(activeTab).length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Palette className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                  <p>No {activeTab} categories found.</p>
                  <p className="text-sm">Add your first category above!</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-6">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">
              Manage your transaction categories. Changes will be saved automatically.
            </p>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
