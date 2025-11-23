import { useEffect, useState } from 'react';
import { Navbar } from '../components/Navbar';
import { transactionService } from '../services/transactionService';
import { budgetService } from '../services/budgetService';
import type { CategoryBreakdown, TransactionSummary, BudgetStatus, Transaction } from '../types';
import { CategoryBreakdownChart } from '../components/CategoryBreakdown';
import { ExpenseTypeBreakdown } from '../components/ExpenseTypeBreakdown';
import { MonthlyTrendsChart } from '../components/MonthlyTrendsChart';
import { BudgetComparisonChart } from '../components/BudgetComparisonChart';
import '../styles/Analytics.css';

export const Analytics = () => {
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
      .toISOString()
      .split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
  });

  const [summary, setSummary] = useState<TransactionSummary | null>(null);
  const [categoryBreakdown, setCategoryBreakdown] = useState<CategoryBreakdown[]>([]);
  const [monthlyTrends, setMonthlyTrends] = useState<Transaction[]>([]);
  const [budgetStatus, setBudgetStatus] = useState<BudgetStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      setError('');

      const filters = {
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
      };

      // Fetch all data in parallel
      const [summaryData, categoryData, budgets] = await Promise.all([
        transactionService.getSummary(filters),
        transactionService.getByCategory(filters),
        budgetService.getOverview(),
      ]);

      // Fetch all transactions for monthly trends
      const { transactions } = await transactionService.getAll({
        ...filters,
        limit: 1000,
      });

      setSummary(summaryData);
      setCategoryBreakdown(categoryData);
      setMonthlyTrends(transactions);
      setBudgetStatus(budgets);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalyticsData();
  }, [dateRange]);

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDateRange((prev) => ({
      ...prev,
      startDate: e.target.value,
    }));
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDateRange((prev) => ({
      ...prev,
      endDate: e.target.value,
    }));
  };

  const handleResetDates = () => {
    setDateRange({
      startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
        .toISOString()
        .split('T')[0],
      endDate: new Date().toISOString().split('T')[0],
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const totalBudgetLimit = budgetStatus.reduce((sum, b) => sum + b.budgetLimit, 0);
  const totalBudgetSpent = budgetStatus.reduce((sum, b) => sum + b.spent, 0);
  const totalCategorySpending = categoryBreakdown.reduce((sum, c) => sum + c.amount, 0);
  const avgCategorySpending =
    categoryBreakdown.length > 0
      ? totalCategorySpending / categoryBreakdown.length
      : 0;

  return (
    <div className="analytics-layout">
      <Navbar />

      <div className="analytics-container">
        {error && <div className="error-banner">{error}</div>}

        {!loading && (
          <div className="analytics-header">
            <h1>Analytics</h1>
            <div className="date-range-filter">
              <div className="form-group">
                <label className="form-label">From</label>
                <input
                  type="date"
                  className="form-input"
                  value={dateRange.startDate}
                  onChange={handleStartDateChange}
                  max={dateRange.endDate}
                />
              </div>
              <div className="form-group">
                <label className="form-label">To</label>
                <input
                  type="date"
                  className="form-input"
                  value={dateRange.endDate}
                  onChange={handleEndDateChange}
                  min={dateRange.startDate}
                  max={new Date().toISOString().split('T')[0]}
                />
              </div>
              <button className="btn-secondary" onClick={handleResetDates}>
                Reset
              </button>
            </div>
          </div>
        )}

        {loading ? (
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Loading analytics...</p>
          </div>
        ) : (
          <>
            {/* Key Metrics */}
            <div className="metrics-section">
              <div className="metric-card">
                <span className="metric-label">Total Income</span>
                <span className="metric-value income">{formatCurrency(summary?.totalIncome || 0)}</span>
              </div>
              <div className="metric-card">
                <span className="metric-label">Total Expenses</span>
                <span className="metric-value expense">{formatCurrency(summary?.totalExpense || 0)}</span>
              </div>
              <div className="metric-card">
                <span className="metric-label">Net Balance</span>
                <span className={`metric-value ${(summary?.netIncome || 0) >= 0 ? 'positive' : 'negative'}`}>
                  {formatCurrency(summary?.netIncome || 0)}
                </span>
              </div>
              <div className="metric-card">
                <span className="metric-label">Avg Category Spend</span>
                <span className="metric-value">{formatCurrency(avgCategorySpending)}</span>
              </div>
              <div className="metric-card">
                <span className="metric-label">Budget Utilization</span>
                <span className="metric-value">
                  {totalBudgetLimit > 0
                    ? `${((totalBudgetSpent / totalBudgetLimit) * 100).toFixed(1)}%`
                    : 'N/A'}
                </span>
              </div>
            </div>

            {/* Charts Grid */}
            <div className="charts-grid">
              {/* Income vs Expense */}
              <div className="chart-card">
                <h3>Income vs Expenses</h3>
                <ExpenseTypeBreakdown transactions={monthlyTrends} loading={false} />
              </div>

              {/* Monthly Trends */}
              <div className="chart-card">
                <h3>Monthly Trends</h3>
                <MonthlyTrendsChart transactions={monthlyTrends} />
              </div>

              {/* Category Breakdown */}
              {categoryBreakdown.length > 0 && (
                <div className="chart-card">
                  <h3>Spending by Category</h3>
                  <CategoryBreakdownChart data={categoryBreakdown} />
                </div>
              )}

              {/* Budget Comparison */}
              {budgetStatus.length > 0 && (
                <div className="chart-card">
                  <h3>Budget Performance</h3>
                  <BudgetComparisonChart budgets={budgetStatus} />
                </div>
              )}
            </div>

            {/* Top Spending Categories */}
            {categoryBreakdown.length > 0 && (
              <div className="top-categories-section">
                <h2>Top Spending Categories</h2>
                <div className="categories-table">
                  <div className="table-header">
                    <div className="col-rank">#</div>
                    <div className="col-category">Category</div>
                    <div className="col-amount">Amount</div>
                    <div className="col-percentage">% of Total</div>
                    <div className="col-transactions">Transactions</div>
                  </div>
                  {categoryBreakdown.map((cat, idx) => (
                    <div key={cat.category} className="table-row">
                      <div className="col-rank">{idx + 1}</div>
                      <div className="col-category">{cat.category}</div>
                      <div className="col-amount">{formatCurrency(cat.amount)}</div>
                      <div className="col-percentage">
                        {totalCategorySpending > 0 ? ((cat.amount / totalCategorySpending) * 100).toFixed(1) : 0}%
                      </div>
                      <div className="col-transactions">{cat.transactionCount}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Budget Status Summary */}
            {budgetStatus.length > 0 && (
              <div className="budget-summary-section">
                <h2>Budget Status</h2>
                <div className="budget-summary-grid">
                  {budgetStatus.map((budget) => (
                    <div key={budget.category} className="budget-summary-card">
                      <div className="budget-summary-header">
                        <span className="budget-category">{budget.category}</span>
                        <span className={`budget-badge ${budget.status}`}>{budget.status}</span>
                      </div>
                      <div className="budget-progress-bar">
                        <div
                          className={`budget-progress-fill ${budget.status}`}
                          style={{ width: `${Math.min(budget.percentageUsed, 100)}%` }}
                        ></div>
                      </div>
                      <div className="budget-summary-details">
                        <div className="detail">
                          <span className="detail-label">Spent</span>
                          <span className="detail-value">{formatCurrency(budget.spent)}</span>
                        </div>
                        <div className="detail">
                          <span className="detail-label">Limit</span>
                          <span className="detail-value">{formatCurrency(budget.budgetLimit)}</span>
                        </div>
                        <div className="detail">
                          <span className="detail-label">Remaining</span>
                          <span className={`detail-value ${budget.remaining >= 0 ? 'positive' : 'negative'}`}>
                            {formatCurrency(budget.remaining)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
