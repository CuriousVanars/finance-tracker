'use client';

import { Goal } from '@/types';
import { Target, Calendar, TrendingUp } from 'lucide-react';
import { formatCurrency } from '@/utils/calculations';

interface GoalsProgressProps {
  goals: Goal[];
}

export function GoalsProgress({ goals }: GoalsProgressProps) {
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

  if (goals.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900 flex items-center">
          <Target className="h-5 w-5 mr-2 text-blue-600" />
          Goal Progress
        </h3>
        <span className="text-sm text-gray-600">{goals.length} active goals</span>
      </div>

      <div className="space-y-4">
        {goals.slice(0, 3).map((goal) => {
          const progress = getProgressPercentage(goal);
          const daysRemaining = getDaysRemaining(goal.deadline);
          const isOverdue = daysRemaining < 0;
          
          return (
            <div key={goal.id} className="border border-gray-100 rounded-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="font-medium text-gray-900">{goal.name}</h4>
                  <p className="text-sm text-gray-600 capitalize">{goal.type} Goal • {goal.category}</p>
                </div>
                <span className={`text-sm font-medium ${
                  progress >= 100 ? 'text-green-600' : 
                  progress >= 75 ? 'text-blue-600' : 
                  progress >= 50 ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {progress.toFixed(1)}%
                </span>
              </div>
              
              <div className="mb-3">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>{formatCurrency(goal.current_amount)}</span>
                  <span>{formatCurrency(goal.target_amount)}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${
                      progress >= 100 ? 'bg-green-500' : 
                      progress >= 75 ? 'bg-blue-500' : 
                      progress >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${Math.min(progress, 100)}%` }}
                  />
                </div>
              </div>
              
              <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center space-x-1">
                  <Calendar className="h-3 w-3" />
                  <span className={isOverdue ? 'text-red-600 font-medium' : ''}>
                    {isOverdue 
                      ? `Overdue by ${Math.abs(daysRemaining)} days`
                      : `${daysRemaining} days left`
                    }
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <TrendingUp className="h-3 w-3" />
                  <span>
                    {formatCurrency((goal.target_amount - goal.current_amount) / Math.max(daysRemaining, 1))} per day
                  </span>
                </div>
              </div>
            </div>
          );
        })}
        
        {goals.length > 3 && (
          <div className="text-center pt-2">
            <span className="text-sm text-gray-500">
              and {goals.length - 3} more goals...
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
