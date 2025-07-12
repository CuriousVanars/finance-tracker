import { formatCurrency } from '@/utils/calculations';

interface SummaryCardProps {
  title: string;
  amount: number;
  textColor?: string;
  bgColor?: string;
  icon?: React.ReactNode;
}

export function SummaryCard({ 
  title, 
  amount, 
  textColor = 'text-gray-900', 
  bgColor = 'bg-white',
  icon 
}: SummaryCardProps) {
  // Enhanced dark mode color mapping
  const getDarkModeColors = () => {
    if (bgColor.includes('green')) {
      return 'dark:bg-green-900/20 dark:border-green-800/30';
    } else if (bgColor.includes('red')) {
      return 'dark:bg-red-900/20 dark:border-red-800/30';
    } else if (bgColor.includes('blue')) {
      return 'dark:bg-blue-900/20 dark:border-blue-800/30';
    } else if (bgColor.includes('yellow')) {
      return 'dark:bg-yellow-900/20 dark:border-yellow-800/30';
    }
    return 'dark:bg-gray-800 dark:border-gray-700';
  };

  return (
    <div className={`${bgColor} ${getDarkModeColors()} rounded-lg shadow p-4 sm:p-6 border border-gray-200 transition-colors duration-200`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">{title}</p>
          <p className={`text-xl sm:text-2xl font-bold ${textColor} dark:text-gray-100`}>
            {formatCurrency(amount)}
          </p>
        </div>
        {icon && (
          <div className={`${textColor} dark:text-gray-300 opacity-80`}>
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
