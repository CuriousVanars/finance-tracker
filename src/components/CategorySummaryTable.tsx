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
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-bold text-gray-900 mb-4">{title}</h2>
      <table className="w-full text-left">
        <thead>
          <tr>
            <th className="text-sm font-medium text-gray-600 pb-2 text-left">Category</th>
            <th className="text-sm font-medium text-gray-600 pb-2 text-center">{budgetColumnHeader}</th>
            <th className="text-sm font-medium text-gray-600 pb-2 text-center">Actual</th>
            <th className="text-sm font-medium text-gray-600 pb-2 text-center">Difference</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index} className="border-t">
              <td className="py-2 pr-4 text-left">
                {item.category}
              </td>
              <td className="py-2 px-2 text-center">
                <input
                  type="number"
                  value={item.budgeted || ''}
                  onChange={(e) => handleBudgetChange(
                    categories.find(cat => cat.name === item.category)?.id || '',
                    e.target.value
                  )}
                  className="w-20 px-2 py-1 border border-gray-300 rounded text-sm text-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="0"
                  min="0"
                  step="0.01"
                  style={{
                    WebkitAppearance: 'none',
                    MozAppearance: 'textfield'
                  }}
                />
              </td>
              <td className="py-2 px-2 text-center">
                {formatCurrency(item.actual)}
              </td>
              <td className="py-2 pl-2 text-center">
                <span className={item.difference >= 0 ? 'text-green-600' : 'text-red-600'}>
                  {formatCurrency(item.difference)}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
