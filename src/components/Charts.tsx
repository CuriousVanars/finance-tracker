'use client';

import { DashboardData } from '@/types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface ChartsProps {
  dashboardData: DashboardData;
}

const COLORS = ['#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#3B82F6', '#F97316'];

export function Charts({ dashboardData }: ChartsProps) {
  // Prepare data for budget vs actual comparison
  const budgetVsActualData = [
    {
      name: 'Income',
      budgeted: dashboardData.summary.expected_income,
      actual: dashboardData.summary.actual_income,
    },
    {
      name: 'Expenses',
      budgeted: dashboardData.summary.expected_expenses,
      actual: dashboardData.summary.actual_expenses,
    },
    {
      name: 'Savings',
      budgeted: dashboardData.summary.expected_savings,
      actual: dashboardData.summary.actual_savings,
    },
  ];

  // Prepare data for expense breakdown pie chart
  const expenseBreakdownData = dashboardData.expense_summary
    .filter(item => item.actual > 0)
    .map((item, index) => ({
      name: item.category,
      value: item.actual,
      color: COLORS[index % COLORS.length],
    }));

  // Prepare data for Income-Expenses-Savings pie chart
  const incomeExpensesSavingsData = [
    {
      name: 'Income',
      value: dashboardData.summary.actual_income,
      color: '#10B981', // Green for income
    },
    {
      name: 'Expenses',
      value: dashboardData.summary.actual_expenses,
      color: '#EF4444', // Red for expenses
    },
    {
      name: 'Savings',
      value: dashboardData.summary.actual_savings,
      color: '#3B82F6', // Blue for savings
    },
  ].filter(item => item.value > 0);

  return (
    <div className="space-y-8">
      {/* Income-Expenses-Savings Overview */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Financial Overview</h3>
        {incomeExpensesSavingsData.length > 0 ? (
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={incomeExpensesSavingsData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent, value }) => 
                  `${name}: ₹${Number(value).toLocaleString()} (${((percent ?? 0) * 100).toFixed(1)}%)`
                }
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
              >
                {incomeExpensesSavingsData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`₹${Number(value).toLocaleString()}`, 'Amount']} />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-[400px] text-gray-500">
            <div className="text-center">
              <p>No financial data available</p>
              <p className="text-sm">Add some transactions to see the overview</p>
            </div>
          </div>
        )}
      </div>

      {/* Budget vs Actual Bar Chart */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Budget vs Actual</h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={budgetVsActualData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis tickFormatter={(value) => `₹${value.toLocaleString()}`} />
            <Tooltip formatter={(value) => [`₹${Number(value).toLocaleString()}`, '']} />
            <Bar dataKey="budgeted" fill="#94A3B8" name="Budgeted" />
            <Bar dataKey="actual" fill="#3B82F6" name="Actual" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
