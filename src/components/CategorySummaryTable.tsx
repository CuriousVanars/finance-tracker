import { CategorySummary } from '@/types';
import { formatCurrency } from '@/utils/calculations';

interface CategorySummaryTableProps {
  title: string;
  data: CategorySummary[];
  type: 'income' | 'expense' | 'saving';
  categories: { id: string; name: string }[];
  onUpdateBudget: (categoryId: string, amount: number) => void;
}

export function CategorySummaryTable({ title, data, type, categories, onUpdateBudget }: CategorySummaryTableProps) {
  function handleBudgetChange(categoryId: string, value: string) {
    const amount = parseFloat(value) || 0;
    onUpdateBudget(categoryId, amount);
  }

  // Determine the header label based on type
  const budgetColumnHeader = type === 'expense' ? 'Budgeted' : 'Expected';

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 sm:p-6">
      <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">{title}</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr>
              <th className="text-sm font-medium text-gray-600 dark:text-gray-400 pb-3 text-left">Category</th>
              <th className="text-sm font-medium text-gray-600 dark:text-gray-400 pb-3 text-center">{budgetColumnHeader}</th>
              <th className="text-sm font-medium text-gray-600 dark:text-gray-400 pb-3 text-center">Actual</th>
              <th className="text-sm font-medium text-gray-600 dark:text-gray-400 pb-3 text-center">Difference</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index} className="border-t border-gray-200 dark:border-gray-700">
                <td className="py-3 pr-2 sm:pr-4 text-left">
                  <span className="text-sm sm:text-base text-gray-900 dark:text-gray-100">{item.category}</span>
                </td>
                <td className="py-3 px-1 sm:px-2 text-center">
                  <input
                    type="number"
                    value={item.budgeted || ''}
                    onChange={(e) => handleBudgetChange(
                      categories.find(cat => cat.name === item.category)?.id || '',
                      e.target.value
                    )}
                    className="w-16 sm:w-20 px-2 py-2 border border-gray-300 dark:border-gray-600 rounded text-sm text-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 dark:text-gray-100 min-h-[40px]"
                    placeholder="0"
                    min="0"
                    step="0.01"
                    style={{
                      WebkitAppearance: 'none',
                      MozAppearance: 'textfield'
                    }}
                  />
                </td>
                <td className="py-3 px-1 sm:px-2 text-center">
                  <span className="text-sm sm:text-base text-gray-900 dark:text-gray-100">{formatCurrency(item.actual)}</span>
                </td>
                <td className="py-3 pl-1 sm:pl-2 text-center">
                  <span className={`text-sm sm:text-base font-medium ${
                    item.difference >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                  }`}>
                    {formatCurrency(item.difference)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
