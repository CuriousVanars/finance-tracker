'use client';

import { useState } from 'react';
import { Alert } from '@/types';
import { X, Bell, AlertTriangle, Info, CheckCircle, Trash2, Plus } from 'lucide-react';
import { formatCurrency } from '@/utils/calculations';

interface AlertsProps {
  alerts: Alert[];
  onUpdateAlerts: (alerts: Alert[]) => void;
  onClose: () => void;
  onCreateRecurringTransaction?: (alertId: string) => void;
}

export function Alerts({ alerts, onUpdateAlerts, onClose, onCreateRecurringTransaction }: AlertsProps) {
  const [filter, setFilter] = useState<'all' | 'unread' | 'high' | 'medium' | 'low'>('all');

  const handleMarkAsRead = (alertId: string) => {
    const updatedAlerts = alerts.map(alert =>
      alert.id === alertId ? { ...alert, is_read: true } : alert
    );
    onUpdateAlerts(updatedAlerts);
  };

  const handleDeleteAlert = (alertId: string) => {
    const updatedAlerts = alerts.filter(alert => alert.id !== alertId);
    onUpdateAlerts(updatedAlerts);
  };

  const handleMarkAllAsRead = () => {
    const updatedAlerts = alerts.map(alert => ({ ...alert, is_read: true }));
    onUpdateAlerts(updatedAlerts);
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all alerts?')) {
      onUpdateAlerts([]);
    }
  };

  const getFilteredAlerts = () => {
    let filtered = alerts;
    
    switch (filter) {
      case 'unread':
        filtered = alerts.filter(alert => !alert.is_read);
        break;
      case 'high':
      case 'medium':
      case 'low':
        filtered = alerts.filter(alert => alert.severity === filter);
        break;
      default:
        filtered = alerts;
    }
    
    return filtered.sort((a, b) => {
      // Sort by unread first, then by severity, then by date
      if (a.is_read !== b.is_read) {
        return a.is_read ? 1 : -1;
      }
      
      const severityOrder = { high: 3, medium: 2, low: 1 };
      if (a.severity !== b.severity) {
        return severityOrder[b.severity] - severityOrder[a.severity];
      }
      
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
  };

  const getAlertIcon = (type: string, severity: string) => {
    const iconClass = `h-5 w-5 ${
      severity === 'high' ? 'text-red-500' :
      severity === 'medium' ? 'text-yellow-500' :
      'text-blue-500'
    }`;

    switch (type) {
      case 'budget_warning':
        return <AlertTriangle className={iconClass} />;
      case 'goal_reminder':
        return <Info className={iconClass} />;
      case 'recurring_due':
        return <Bell className={iconClass} />;
      case 'unusual_expense':
        return <AlertTriangle className={iconClass} />;
      default:
        return <Bell className={iconClass} />;
    }
  };

  const getAlertTypeText = (type: string) => {
    const typeMap = {
      budget_warning: 'Budget Warning',
      goal_reminder: 'Goal Reminder',
      recurring_due: 'Recurring Due',
      unusual_expense: 'Unusual Expense'
    };
    return typeMap[type as keyof typeof typeMap] || 'Alert';
  };

  const filteredAlerts = getFilteredAlerts();
  const unreadCount = alerts.filter(alert => !alert.is_read).length;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <Bell className="h-6 w-6 text-orange-600" />
            <div>
              <h2 className="text-xl font-bold text-gray-900">Alerts</h2>
              {unreadCount > 0 && (
                <p className="text-sm text-gray-600">{unreadCount} unread notifications</p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        {/* Filters and Actions */}
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">Filter:</span>
              <select
                value={filter}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                  const value = e.target.value;
                  if (value === 'all' || value === 'unread' || value === 'high' || value === 'medium' || value === 'low') {
                    setFilter(value);
                  }
                }}
                className="text-sm border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="all">All Alerts</option>
                <option value="unread">Unread Only</option>
                <option value="high">High Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="low">Low Priority</option>
              </select>
            </div>
            <div className="flex items-center space-x-2">
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="text-sm px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Mark All Read
                </button>
              )}
              {alerts.length > 0 && (
                <button
                  onClick={handleClearAll}
                  className="text-sm px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Clear All
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Alerts List */}
        <div className="overflow-y-auto max-h-[60vh]">
          {filteredAlerts.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Bell className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p className="text-lg font-medium">No alerts to show</p>
              <p>
                {filter === 'unread' 
                  ? "You're all caught up!"
                  : "When you have financial alerts, they'll appear here."
                }
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredAlerts.map((alert) => (
                <div 
                  key={alert.id}
                  className={`p-4 hover:bg-gray-50 transition-colors ${
                    !alert.is_read ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      {getAlertIcon(alert.type, alert.severity)}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                            alert.severity === 'high' ? 'bg-red-100 text-red-800' :
                            alert.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {alert.severity.toUpperCase()}
                          </span>
                          <span className="text-xs text-gray-500">
                            {getAlertTypeText(alert.type)}
                          </span>
                          {!alert.is_read && (
                            <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded-full">
                              NEW
                            </span>
                          )}
                        </div>
                        <p className="text-gray-900 text-sm font-medium mb-1">
                          {alert.message}
                        </p>
                        {alert.category && (
                          <p className="text-xs text-gray-600 mb-1">
                            Category: {alert.category}
                          </p>
                        )}
                        {alert.amount && (
                          <p className="text-xs text-gray-600 mb-1">
                            Amount: {formatCurrency(alert.amount)}
                          </p>
                        )}
                        <p className="text-xs text-gray-500">
                          {new Date(alert.created_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      {alert.type === 'recurring_due' && onCreateRecurringTransaction && (
                        <button
                          onClick={() => {
                            onCreateRecurringTransaction(alert.id);
                            handleMarkAsRead(alert.id);
                          }}
                          className="p-1 text-green-600 hover:bg-green-100 rounded transition-colors"
                          title="Create transaction"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      )}
                      {!alert.is_read && (
                        <button
                          onClick={() => handleMarkAsRead(alert.id)}
                          className="p-1 text-blue-600 hover:bg-blue-100 rounded transition-colors"
                          title="Mark as read"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteAlert(alert.id)}
                        className="p-1 text-red-600 hover:bg-red-100 rounded transition-colors"
                        title="Delete alert"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-4 bg-gray-50">
          <div className="flex justify-between items-center text-sm text-gray-600">
            <span>
              Showing {filteredAlerts.length} of {alerts.length} alerts
            </span>
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
