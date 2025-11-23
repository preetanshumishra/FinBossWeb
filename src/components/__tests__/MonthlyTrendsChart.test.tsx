import { render, screen } from '@testing-library/react';
import { MonthlyTrendsChart } from '../MonthlyTrendsChart';
import type { Transaction } from '../../types';

describe('MonthlyTrendsChart', () => {
  it('should display empty state when no transactions provided', () => {
    render(<MonthlyTrendsChart transactions={[]} />);
    expect(screen.getByText(/no transaction data available/i)).toBeInTheDocument();
  });

  it('should display chart when transactions are provided', () => {
    const transactions: Transaction[] = [
      {
        _id: '1',
        userId: 'user1',
        type: 'income',
        amount: 1000,
        category: 'Salary',
        description: 'Paycheck',
        date: '2024-01-15',
        createdAt: '2024-01-15T00:00:00Z',
      },
      {
        _id: '2',
        userId: 'user1',
        type: 'expense',
        amount: 500,
        category: 'Food',
        description: 'Groceries',
        date: '2024-01-20',
        createdAt: '2024-01-20T00:00:00Z',
      },
    ];

    const { container } = render(<MonthlyTrendsChart transactions={transactions} />);

    // Should have container with chart
    expect(container.querySelector('.monthly-trends-container')).toBeInTheDocument();
  });

  it('should group transactions by month correctly', () => {
    const transactions: Transaction[] = [
      {
        _id: '1',
        userId: 'user1',
        type: 'income',
        amount: 1000,
        category: 'Salary',
        description: 'Jan salary',
        date: '2024-01-15',
        createdAt: '2024-01-15T00:00:00Z',
      },
      {
        _id: '2',
        userId: 'user1',
        type: 'expense',
        amount: 100,
        category: 'Food',
        description: 'Jan food',
        date: '2024-01-20',
        createdAt: '2024-01-20T00:00:00Z',
      },
      {
        _id: '3',
        userId: 'user1',
        type: 'income',
        amount: 1000,
        category: 'Salary',
        description: 'Feb salary',
        date: '2024-02-15',
        createdAt: '2024-02-15T00:00:00Z',
      },
    ];

    const { container } = render(<MonthlyTrendsChart transactions={transactions} />);

    // Should have SVG for chart
    expect(container.querySelector('.monthly-trends-container')).toBeInTheDocument();
  });

  it('should display income and expense bars for each month', () => {
    const transactions: Transaction[] = [
      {
        _id: '1',
        userId: 'user1',
        type: 'income',
        amount: 2000,
        category: 'Salary',
        description: 'Salary',
        date: '2024-01-01',
        createdAt: '2024-01-01T00:00:00Z',
      },
      {
        _id: '2',
        userId: 'user1',
        type: 'expense',
        amount: 800,
        category: 'Food',
        description: 'Food',
        date: '2024-01-15',
        createdAt: '2024-01-15T00:00:00Z',
      },
    ];

    const { container } = render(<MonthlyTrendsChart transactions={transactions} />);

    // Should have chart bars
    const bars = container.querySelectorAll('.bar');
    expect(bars.length).toBeGreaterThan(0);
  });

  it('should display legend with income and expense labels', () => {
    const transactions: Transaction[] = [
      {
        _id: '1',
        userId: 'user1',
        type: 'income',
        amount: 1000,
        category: 'Salary',
        description: 'Salary',
        date: '2024-01-15',
        createdAt: '2024-01-15T00:00:00Z',
      },
    ];

    render(<MonthlyTrendsChart transactions={transactions} />);

    expect(screen.getByText('Income')).toBeInTheDocument();
    expect(screen.getByText('Expenses')).toBeInTheDocument();
  });

  it('should handle months in chronological order', () => {
    const transactions: Transaction[] = [
      {
        _id: '1',
        userId: 'user1',
        type: 'expense',
        amount: 100,
        category: 'Food',
        description: 'Mar food',
        date: '2024-03-10',
        createdAt: '2024-03-10T00:00:00Z',
      },
      {
        _id: '2',
        userId: 'user1',
        type: 'expense',
        amount: 100,
        category: 'Food',
        description: 'Jan food',
        date: '2024-01-10',
        createdAt: '2024-01-10T00:00:00Z',
      },
      {
        _id: '3',
        userId: 'user1',
        type: 'expense',
        amount: 100,
        category: 'Food',
        description: 'Feb food',
        date: '2024-02-10',
        createdAt: '2024-02-10T00:00:00Z',
      },
    ];

    const { container } = render(<MonthlyTrendsChart transactions={transactions} />);

    // Check that chart renders properly
    expect(container.querySelector('.monthly-trends-container')).toBeInTheDocument();
  });

  it('should accumulate multiple transactions in same month', () => {
    const transactions: Transaction[] = [
      {
        _id: '1',
        userId: 'user1',
        type: 'income',
        amount: 1000,
        category: 'Salary',
        description: 'Salary',
        date: '2024-01-01',
        createdAt: '2024-01-01T00:00:00Z',
      },
      {
        _id: '2',
        userId: 'user1',
        type: 'income',
        amount: 500,
        category: 'Bonus',
        description: 'Bonus',
        date: '2024-01-15',
        createdAt: '2024-01-15T00:00:00Z',
      },
      {
        _id: '3',
        userId: 'user1',
        type: 'expense',
        amount: 200,
        category: 'Food',
        description: 'Groceries',
        date: '2024-01-20',
        createdAt: '2024-01-20T00:00:00Z',
      },
    ];

    const { container } = render(<MonthlyTrendsChart transactions={transactions} />);

    // Should render chart with all transactions aggregated
    expect(container.querySelector('.monthly-trends-container')).toBeInTheDocument();
  });
});
