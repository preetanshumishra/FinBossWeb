import type { Transaction } from '../types';

interface ExpenseTypeBreakdownProps {
  transactions: Transaction[];
  loading?: boolean;
}

export const ExpenseTypeBreakdown = ({ transactions, loading }: ExpenseTypeBreakdownProps) => {
  if (loading) {
    return <div className="type-breakdown-container">Loading...</div>;
  }

  // Calculate income vs expense
  const income = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const expense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const total = income + expense;

  if (total === 0) {
    return <div className="type-breakdown-container empty">No transaction data</div>;
  }

  const incomePercent = (income / total) * 100;
  const expensePercent = (expense / total) * 100;

  return (
    <div className="type-breakdown-container">
      <div className="type-breakdown-chart">
        {/* Donut-style visualization using CSS */}
        <svg viewBox="0 0 100 100" className="donut-svg">
          {/* Income segment */}
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke="#10b981"
            strokeWidth="10"
            strokeDasharray={`${(incomePercent / 100) * 251.2} 251.2`}
            strokeDashoffset="0"
            transform="rotate(-90 50 50)"
          />
          {/* Expense segment */}
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke="#ef4444"
            strokeWidth="10"
            strokeDasharray={`${(expensePercent / 100) * 251.2} 251.2`}
            strokeDashoffset={`-${(incomePercent / 100) * 251.2}`}
            transform="rotate(-90 50 50)"
          />
          {/* Center text */}
          <text
            x="50"
            y="50"
            textAnchor="middle"
            dy="0.3em"
            className="donut-text"
          >
            100%
          </text>
        </svg>
      </div>

      <div className="type-breakdown-legend">
        <div className="legend-item income">
          <div className="legend-color"></div>
          <div className="legend-content">
            <span className="legend-label">Income</span>
            <span className="legend-value">
              ${income.toFixed(2)} ({incomePercent.toFixed(1)}%)
            </span>
          </div>
        </div>

        <div className="legend-item expense">
          <div className="legend-color"></div>
          <div className="legend-content">
            <span className="legend-label">Expense</span>
            <span className="legend-value">
              ${expense.toFixed(2)} ({expensePercent.toFixed(1)}%)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
