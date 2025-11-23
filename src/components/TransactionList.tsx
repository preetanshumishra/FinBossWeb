import type { Transaction } from '../types';

interface TransactionListProps {
  transactions: Transaction[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
}

export const TransactionList = ({
  transactions,
  onEdit,
  onDelete,
}: TransactionListProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="transactions-table-container">
      <table className="transactions-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Description</th>
            <th>Category</th>
            <th>Type</th>
            <th>Amount</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction._id} className={`transaction-row ${transaction.type}`}>
              <td className="date-cell">
                {formatDate(transaction.date)}
                {transaction.isRecurring && (
                  <span className="recurring-badge" title={`Repeats ${transaction.recurringPattern}`}>
                    🔄
                  </span>
                )}
              </td>
              <td className="description-cell">{transaction.description}</td>
              <td className="category-cell">{transaction.category}</td>
              <td className="type-cell">
                <span className={`type-badge ${transaction.type}`}>
                  {transaction.type === 'income' ? '+' : '-'}
                  {transaction.type === 'income' ? 'Income' : 'Expense'}
                </span>
              </td>
              <td className={`amount-cell ${transaction.type}`}>
                {formatCurrency(transaction.amount)}
              </td>
              <td className="actions-cell">
                <button
                  className="btn-icon edit"
                  onClick={() => onEdit(transaction)}
                  title="Edit"
                >
                  ✏️
                </button>
                <button
                  className="btn-icon delete"
                  onClick={() => onDelete(transaction._id)}
                  title="Delete"
                >
                  🗑️
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
