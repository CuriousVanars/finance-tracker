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
  return (
    <div className={`${bgColor} rounded-lg shadow p-4 sm:p-6 border border-gray-200`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className={`text-xl sm:text-2xl font-bold ${textColor}`}>
            {formatCurrency(amount)}
          </p>
        </div>
        {icon && (
          <div className={`${textColor} opacity-80`}>
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
