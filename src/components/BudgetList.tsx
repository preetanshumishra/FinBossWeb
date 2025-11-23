import type { BudgetStatus } from '../types';

interface BudgetListProps {
  budgets: BudgetStatus[];
  onEdit: (category: string) => void;
  onDelete: (category: string) => void;
}

export const BudgetList = ({
  budgets,
  onEdit,
  onDelete,
}: BudgetListProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'on-track':
        return '✓';
      case 'warning':
        return '⚠';
      case 'exceeded':
        return '✗';
      default:
        return '•';
    }
  };

  return (
    <div className="budgets-grid-full">
      {budgets.map((budget) => (
        <div key={budget.category} className="budget-card-full">
          <div className="budget-card-header">
            <div className="budget-card-title">
              <h3>{budget.category}</h3>
              <span className={`status-badge ${budget.status}`}>
                {getStatusIcon(budget.status)} {budget.status.replace('-', ' ')}
              </span>
            </div>
            <div className="budget-card-actions">
              <button
                className="btn-icon edit"
                onClick={() => onEdit(budget.category)}
                title="Edit"
              >
                ✏️
              </button>
              <button
                className="btn-icon delete"
                onClick={() => onDelete(budget.category)}
                title="Delete"
              >
                🗑️
              </button>
            </div>
          </div>

          <div className="budget-progress-full">
            <div className="progress-bar-full">
              <div
                className={`progress-fill-full ${budget.status}`}
                style={{ width: `${Math.min(budget.percentageUsed, 100)}%` }}
              ></div>
            </div>
            <div className="progress-labels">
              <span className="progress-percentage">
                {budget.percentageUsed.toFixed(1)}%
              </span>
              <span className="progress-text">
                {formatCurrency(budget.spent)} / {formatCurrency(budget.budgetLimit)}
              </span>
            </div>
          </div>

          <div className="budget-details-full">
            <div className="detail-item">
              <span className="detail-label">Spent</span>
              <span className="detail-value">{formatCurrency(budget.spent)}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Remaining</span>
              <span
                className="detail-value"
                style={{
                  color: budget.remaining >= 0 ? '#10b981' : '#ef4444',
                }}
              >
                {formatCurrency(Math.abs(budget.remaining))}
              </span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Limit</span>
              <span className="detail-value">{formatCurrency(budget.budgetLimit)}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
