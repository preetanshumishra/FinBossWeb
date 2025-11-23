import { useEffect, useState } from 'react';
import { Navbar } from '../components/Navbar';
import { transactionService } from '../services/transactionService';
import { budgetService } from '../services/budgetService';
import { CategoryBreakdownChart } from '../components/CategoryBreakdown';
import { ExpenseTypeBreakdown } from '../components/ExpenseTypeBreakdown';
import type { Transaction, TransactionSummary, BudgetStatus, CategoryBreakdown } from '../types';
import '../styles/Dashboard.css';

export const Dashboard = () => {
  const [summary, setSummary] = useState<TransactionSummary | null>(null);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  const [budgetStatus, setBudgetStatus] = useState<BudgetStatus[]>([]);
  const [categoryBreakdown, setCategoryBreakdown] = useState<CategoryBreakdown[]>([]);
  const [loading, setLoading] = useState(true);
  const [chartLoading, setChartLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError('');

        // Fetch summary
        const summaryData = await transactionService.getSummary();
        setSummary(summaryData);

        // Fetch recent transactions (limit to 5 by using limit parameter)
        const { transactions } = await transactionService.getAll({ type: undefined, limit: 5 });
        setRecentTransactions(transactions);

        // Fetch budget status
        const budgets = await budgetService.getOverview();
        setBudgetStatus(budgets);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Fetch category breakdown separately with its own loading state
  useEffect(() => {
    const fetchCategoryBreakdown = async () => {
      try {
        setChartLoading(true);
        const breakdown = await transactionService.getByCategory();
        setCategoryBreakdown(breakdown);
      } catch (err) {
        // Silent fail for chart, don't interrupt main dashboard
        console.error('Failed to load category breakdown:', err);
      } finally {
        setChartLoading(false);
      }
    };

    fetchCategoryBreakdown();
  }, []);

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
    <div className="dashboard-layout">
      <Navbar />

      <div className="dashboard-container">
        {error && (
          <div className="error-banner">
            {error}
          </div>
        )}

        {loading ? (
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Loading dashboard...</p>
          </div>
        ) : (
          <>
            {/* Summary Cards */}
            <div className="summary-section">
              <h1>Dashboard</h1>
              <div className="summary-cards">
                <div className="summary-card income">
                  <div className="card-icon">📈</div>
                  <div className="card-content">
                    <span className="card-label">Total Income</span>
                    <span className="card-amount">
                      {formatCurrency(summary?.totalIncome || 0)}
                    </span>
                  </div>
                </div>

                <div className="summary-card expense">
                  <div className="card-icon">📉</div>
                  <div className="card-content">
                    <span className="card-label">Total Expense</span>
                    <span className="card-amount">
                      {formatCurrency(summary?.totalExpense || 0)}
                    </span>
                  </div>
                </div>

                <div className="summary-card net">
                  <div className="card-icon">💰</div>
                  <div className="card-content">
                    <span className="card-label">Net Balance</span>
                    <span className="card-amount">
                      {formatCurrency(summary?.netIncome || 0)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Analytics Section */}
            <div className="analytics-section">
              <div className="analytics-grid">
                {/* Expense Type Breakdown */}
                <div className="analytics-card">
                  <div className="card-title">Income vs Expense</div>
                  <ExpenseTypeBreakdown
                    transactions={recentTransactions}
                    loading={loading}
                  />
                </div>

                {/* Category Breakdown */}
                {categoryBreakdown.length > 0 && (
                  <div className="analytics-card">
                    <div className="card-title">Spending by Category</div>
                    <CategoryBreakdownChart
                      data={categoryBreakdown}
                      loading={chartLoading}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Recent Transactions */}
            <div className="transactions-section">
              <div className="section-header">
                <h2>Recent Transactions</h2>
                <a href="/transactions" className="view-all-link">View All →</a>
              </div>

              {recentTransactions.length === 0 ? (
                <div className="empty-state">
                  <p>No transactions yet. Start by adding your first transaction!</p>
                </div>
              ) : (
                <div className="transactions-list">
                  {recentTransactions.map((transaction) => (
                    <div key={transaction._id} className="transaction-item">
                      <div className="transaction-info">
                        <span className="transaction-category">
                          {transaction.category}
                        </span>
                        <span className="transaction-description">
                          {transaction.description}
                        </span>
                        <span className="transaction-date">
                          {formatDate(transaction.date)}
                        </span>
                      </div>
                      <span className={`transaction-amount ${transaction.type}`}>
                        {transaction.type === 'income' ? '+' : '-'}
                        {formatCurrency(transaction.amount)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Budget Overview */}
            {budgetStatus.length > 0 && (
              <div className="budget-section">
                <div className="section-header">
                  <h2>Budget Overview</h2>
                  <a href="/budgets" className="view-all-link">Manage →</a>
                </div>

                <div className="budgets-grid">
                  {budgetStatus.slice(0, 3).map((budget) => (
                    <div key={budget.category} className="budget-card">
                      <div className="budget-header">
                        <span className="budget-category">{budget.category}</span>
                        <span className={`budget-status ${budget.status}`}>
                          {budget.status}
                        </span>
                      </div>
                      <div className="budget-progress">
                        <div className="progress-bar">
                          <div
                            className={`progress-fill ${budget.status}`}
                            style={{ width: `${Math.min((budget.budgetLimit && budget.spent) ? (budget.spent / budget.budgetLimit) * 100 : 0, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="budget-details">
                        <span>
                          {formatCurrency(budget.spent || 0)} / {formatCurrency(budget.budgetLimit || 0)}
                        </span>
                        <span className="budget-remaining">
                          {(budget.remaining || 0) >= 0 ? '✓' : '✗'} {formatCurrency(Math.abs(budget.remaining || 0))}
                        </span>
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
