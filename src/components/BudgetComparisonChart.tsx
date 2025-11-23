import type { BudgetStatus } from '../types';

interface BudgetComparisonChartProps {
  budgets: BudgetStatus[];
}

export const BudgetComparisonChart = ({ budgets }: BudgetComparisonChartProps) => {
  if (budgets.length === 0) {
    return <div className="chart-empty">No budget data available</div>;
  }

  // Sort by spent amount (descending) to show highest spenders first
  const sortedBudgets = [...budgets].sort((a, b) => b.spent - a.spent);

  // Find max budget limit for scaling
  const maxLimit = Math.max(...sortedBudgets.map((b) => b.budgetLimit));
  const padding = maxLimit * 0.1;
  const scaledMax = maxLimit + padding;

  return (
    <div className="budget-comparison-container">
      <div className="comparison-chart">
        <div className="chart-y-axis">
          <div className="y-axis-label">${(scaledMax / 1).toFixed(0)}</div>
          <div className="y-axis-label">${(scaledMax / 2).toFixed(0)}</div>
          <div className="y-axis-label">$0</div>
        </div>
        <div className="comparison-bars">
          {sortedBudgets.map((budget) => (
            <div key={budget.category} className="comparison-bar-group">
              <div className="bar-wrapper-comparison">
                {/* Limit bar (background) */}
                <div
                  className="bar comparison-bar limit-bar"
                  style={{
                    height: `${((budget.budgetLimit || 0) / scaledMax) * 100}%`,
                  }}
                  title={`Budget: $${(budget.budgetLimit || 0).toFixed(2)}`}
                ></div>
                {/* Spent bar (foreground) */}
                <div
                  className={`bar comparison-bar spent-bar ${budget.status}`}
                  style={{
                    height: `${((budget.spent || 0) / scaledMax) * 100}%`,
                  }}
                  title={`Spent: $${(budget.spent || 0).toFixed(2)}`}
                ></div>
              </div>
              <div className="bar-label">{budget.category}</div>
              <div className="bar-percentage">
                {(budget.budgetLimit || 0) > 0 ? (((budget.spent || 0) / (budget.budgetLimit || 0)) * 100).toFixed(0) : 0}%
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="comparison-legend">
        <div className="legend-item">
          <div className="legend-color limit"></div>
          <span>Budget Limit</span>
        </div>
        <div className="legend-item">
          <div className="legend-color on-track"></div>
          <span>On Track (≤80%)</span>
        </div>
        <div className="legend-item">
          <div className="legend-color warning"></div>
          <span>Warning (80-100%)</span>
        </div>
        <div className="legend-item">
          <div className="legend-color exceeded"></div>
          <span>Exceeded (&gt;100%)</span>
        </div>
      </div>
    </div>
  );
};
