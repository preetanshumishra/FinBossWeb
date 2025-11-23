import type { CategoryBreakdown } from '../types';

interface CategoryBreakdownProps {
  data: CategoryBreakdown[];
  loading?: boolean;
}

export const CategoryBreakdownChart = ({ data, loading }: CategoryBreakdownProps) => {
  if (loading) {
    return (
      <div className="category-breakdown-container">
        <div className="chart-loading">Loading...</div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="category-breakdown-container">
        <div className="empty-chart">No category data available</div>
      </div>
    );
  }

  // Get the max amount for scaling
  const maxAmount = Math.max(...data.map((d) => d.amount));

  return (
    <div className="category-breakdown-container">
      <div className="breakdown-list">
        {data.map((item) => (
          <div key={item.category} className="breakdown-item">
            <div className="breakdown-label">
              <span className="category-name">{item.category}</span>
              <span className="category-amount">
                ${item.amount.toFixed(2)}
              </span>
            </div>
            <div className="breakdown-bar-container">
              <div
                className="breakdown-bar"
                style={{
                  width: `${(item.amount / maxAmount) * 100}%`,
                }}
              ></div>
            </div>
            <div className="breakdown-meta">
              <span className="percentage">{item.percentage.toFixed(1)}%</span>
              <span className="count">{item.transactionCount} txns</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
