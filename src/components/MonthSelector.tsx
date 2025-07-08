'use client';

import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

interface MonthSelectorProps {
  selectedMonth: string;
  selectedYear: number;
  onMonthChange: (month: string) => void;
  onYearChange: (year: number) => void;
}

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export function MonthSelector({ selectedMonth, selectedYear, onMonthChange, onYearChange }: MonthSelectorProps) {
  const currentMonthIndex = MONTHS.indexOf(selectedMonth);

  const goToPreviousMonth = () => {
    if (currentMonthIndex === 0) {
      onMonthChange(MONTHS[11]);
      onYearChange(selectedYear - 1);
    } else {
      onMonthChange(MONTHS[currentMonthIndex - 1]);
    }
  };

  const goToNextMonth = () => {
    if (currentMonthIndex === 11) {
      onMonthChange(MONTHS[0]);
      onYearChange(selectedYear + 1);
    } else {
      onMonthChange(MONTHS[currentMonthIndex + 1]);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <button
          onClick={goToPreviousMonth}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ChevronLeft className="h-5 w-5 text-gray-600" />
        </button>
        
        <div className="flex items-center space-x-4">
          <Calendar className="h-5 w-5 text-blue-600" />
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900">{selectedMonth} {selectedYear}</h2>
            <p className="text-sm text-gray-600">Selected Period</p>
          </div>
        </div>
        
        <button
          onClick={goToNextMonth}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ChevronRight className="h-5 w-5 text-gray-600" />
        </button>
      </div>
      
      {/* Quick month selector */}
      <div className="mt-4 grid grid-cols-6 gap-2">
        {MONTHS.map((month) => (
          <button
            key={month}
            onClick={() => onMonthChange(month)}
            className={`px-3 py-1 text-xs rounded transition-colors border ${
              month === selectedMonth
                ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-200'
            }`}
          >
            {month.substring(0, 3)}
          </button>
        ))}
      </div>
    </div>
  );
}
