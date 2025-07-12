'use client';

import { Bell } from 'lucide-react';
import { Alert } from '@/types';

interface NotificationBellProps {
  alerts: Alert[];
  onClick: () => void;
  className?: string;
  variant?: 'button' | 'icon-only';
  showText?: boolean;
  badgePosition?: 'top-right' | 'right';
  size?: 'sm' | 'md' | 'lg';
}

export function NotificationBell({ 
  alerts, 
  onClick, 
  className = '',
  variant = 'button',
  showText = true,
  badgePosition = 'top-right',
  size = 'md'
}: NotificationBellProps) {
  // Calculate unread count using both new and legacy fields for backward compatibility
  const unreadCount = alerts.filter(alert => !(alert.isRead || alert.is_read)).length;
  
  // Size configurations
  const sizeConfig = {
    sm: {
      icon: 'h-3 w-3',
      badge: 'h-3 w-3 text-[10px]',
      padding: 'px-2 py-1',
      text: 'text-xs'
    },
    md: {
      icon: 'h-4 w-4',
      badge: 'h-4 w-4 text-xs',
      padding: 'px-3 py-2',
      text: 'text-sm'
    },
    lg: {
      icon: 'h-5 w-5',
      badge: 'h-5 w-5 text-sm',
      padding: 'px-4 py-2',
      text: 'text-base'
    }
  };

  const config = sizeConfig[size];

  // Badge positioning
  const badgePositionClass = badgePosition === 'top-right' 
    ? 'absolute -top-1 -right-1' 
    : 'ml-auto';

  if (variant === 'icon-only') {
    return (
      <button
        onClick={onClick}
        className={`relative inline-flex items-center justify-center ${config.padding} rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-700 ${className}`}
        title={`${unreadCount} unread notifications`}
        aria-label={`Notifications ${unreadCount > 0 ? `(${unreadCount} unread)` : ''}`}
      >
        <Bell className={`${config.icon} text-gray-600 dark:text-gray-400`} />
        {unreadCount > 0 && (
          <span 
            className={`${badgePositionClass} ${config.badge} bg-red-500 text-white font-medium rounded-full flex items-center justify-center min-w-fit px-1 animate-pulse`}
            aria-hidden="true"
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      className={`relative inline-flex items-center ${config.padding} border border-gray-300 dark:border-gray-600 rounded-md ${config.text} font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors ${className}`}
      aria-label={`Notifications ${unreadCount > 0 ? `(${unreadCount} unread)` : ''}`}
    >
      <Bell className={`${config.icon} ${showText ? 'mr-2' : ''}`} />
      {showText && 'Alerts'}
      {unreadCount > 0 && (
        <span 
          className={`${badgePositionClass} ${config.badge} bg-red-500 text-white font-medium rounded-full flex items-center justify-center min-w-fit px-1 animate-pulse`}
          aria-hidden="true"
        >
          {unreadCount > 99 ? '99+' : unreadCount}
        </span>
      )}
    </button>
  );
}

// Optional: Create a simple wrapper for just the icon with badge
export function NotificationIcon({ 
  alerts, 
  onClick, 
  className = '',
  size = 'md' 
}: Pick<NotificationBellProps, 'alerts' | 'onClick' | 'className' | 'size'>) {
  return (
    <NotificationBell
      alerts={alerts}
      onClick={onClick}
      className={className}
      variant="icon-only"
      size={size}
    />
  );
}
