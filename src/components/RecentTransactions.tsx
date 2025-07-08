import { Transaction } from '@/types';
import { formatCurrency } from '@/utils/calculations';
import { Trash2, Calendar, DollarSign } from 'lucide-react';

interface RecentTransactionsProps {
  transactions: Transaction[];
  onDeleteTransaction: (id: string) => void;
}

export function RecentTransactions({ transactions, onDeleteTransaction }: RecentTransactionsProps) {
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'income':
        return 'text-green-600 bg-green-50';
      case 'expense':
        return 'text-red-600 bg-red-50';
      case 'saving':
        return 'text-blue-600 bg-blue-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-900">Recent Transactions</h2>
        <div className="flex items-center text-sm text-gray-600">
          <Calendar className="h-4 w-4 mr-1" />
          Last 10 transactions
        </div>
      </div>

      {transactions.length === 0 ? (
        <div className="text-center py-8">
          <DollarSign className="h-12 w-12 mx-auto text-gray-400 mb-3" />
          <p className="text-gray-600">No transactions yet</p>
          <p className="text-sm text-gray-500">Start by adding your first transaction</p>
        </div>
      ) : (
        <div className="space-y-3">
          {transactions.map((transaction) => (
            <div key={transaction.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
              <div className="flex items-center space-x-3">
                <span className={`px-2 py-1 rounded text-xs font-medium capitalize ${getTypeColor(transaction.type)}`}>
                  {transaction.type}
                </span>
                <div>
                  <p className="font-medium text-gray-900">{transaction.category}</p>
                  <p className="text-sm text-gray-600">
                    {formatDate(transaction.date)}
                    {transaction.description && ` • ${transaction.description}`}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <span className={`font-bold ${
                  transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                </span>
                <button
                  onClick={() => onDeleteTransaction(transaction.id)}
                  className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                  title="Delete transaction"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
