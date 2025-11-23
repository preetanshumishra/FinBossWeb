import type { Transaction } from '../types';

interface MonthlyTrendsChartProps {
  transactions: Transaction[];
}

interface MonthlyData {
  month: string;
  income: number;
  expense: number;
}

export const MonthlyTrendsChart = ({ transactions }: MonthlyTrendsChartProps) => {
  // Group transactions by month
  const monthlyData: Record<string, MonthlyData> = {};

  transactions.forEach((t) => {
    const date = new Date(t.date);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    const monthLabel = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

    if (!monthlyData[monthKey]) {
      monthlyData[monthKey] = {
        month: monthLabel,
        income: 0,
        expense: 0,
      };
    }

    if (t.type === 'income') {
      monthlyData[monthKey].income += t.amount;
    } else {
      monthlyData[monthKey].expense += t.amount;
    }
  });

  const data = Object.values(monthlyData).sort((a, b) => {
    const aDate = new Date(a.month);
    const bDate = new Date(b.month);
    return aDate.getTime() - bDate.getTime();
  });

  if (data.length === 0) {
    return <div className="chart-empty">No transaction data available</div>;
  }

  // Find max value for scaling
  const maxValue = Math.max(...data.flatMap((d) => [d.income, d.expense]));
  const padding = maxValue * 0.1; // 10% padding
  const scaledMax = maxValue + padding;

  return (
    <div className="monthly-trends-container">
      <div className="trends-chart">
        <div className="chart-y-axis">
          <div className="y-axis-label">${(scaledMax / 1).toFixed(0)}</div>
          <div className="y-axis-label">${(scaledMax / 2).toFixed(0)}</div>
          <div className="y-axis-label">$0</div>
        </div>
        <div className="chart-bars">
          {data.map((item) => (
            <div key={item.month} className="bar-group">
              <div className="bars-container">
                <div className="bar-wrapper">
                  <div
                    className="bar income-bar"
                    style={{
                      height: `${(item.income / scaledMax) * 100}%`,
                    }}
                    title={`Income: $${item.income.toFixed(2)}`}
                  ></div>
                </div>
                <div className="bar-wrapper">
                  <div
                    className="bar expense-bar"
                    style={{
                      height: `${(item.expense / scaledMax) * 100}%`,
                    }}
                    title={`Expense: $${item.expense.toFixed(2)}`}
                  ></div>
                </div>
              </div>
              <div className="bar-label">{item.month}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="trends-legend">
        <div className="legend-item">
          <div className="legend-color income"></div>
          <span>Income</span>
        </div>
        <div className="legend-item">
          <div className="legend-color expense"></div>
          <span>Expenses</span>
        </div>
      </div>
    </div>
  );
};
