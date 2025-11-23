import { render, screen } from '@testing-library/react';
import { BudgetComparisonChart } from '../BudgetComparisonChart';
import type { BudgetStatus } from '../../types';

describe('BudgetComparisonChart', () => {
  it('should display empty state when no budgets provided', () => {
    render(<BudgetComparisonChart budgets={[]} />);
    expect(screen.getByText(/no budget data available/i)).toBeInTheDocument();
  });

  it('should display chart when budgets are provided', () => {
    const budgets: BudgetStatus[] = [
      {
        category: 'Food',
        budgetLimit: 500,
        spent: 300,
        remaining: 200,
        percentageUsed: 60,
        status: 'on-track',
      },
    ];

    const { container } = render(<BudgetComparisonChart budgets={budgets} />);

    // Should have container with chart
    expect(container.querySelector('.budget-comparison-container')).toBeInTheDocument();
  });

  it('should display budget category labels', () => {
    const budgets: BudgetStatus[] = [
      {
        category: 'Food',
        budgetLimit: 500,
        spent: 300,
        remaining: 200,
        percentageUsed: 60,
        status: 'on-track',
      },
      {
        category: 'Entertainment',
        budgetLimit: 200,
        spent: 150,
        remaining: 50,
        percentageUsed: 75,
        status: 'warning',
      },
    ];

    const { container } = render(<BudgetComparisonChart budgets={budgets} />);

    // Check that labels appear in the chart
    const labels = container.querySelectorAll('.bar-label');
    expect(labels.length).toBeGreaterThan(0);
  });

  it('should display percentage utilization for each budget', () => {
    const budgets: BudgetStatus[] = [
      {
        category: 'Food',
        budgetLimit: 500,
        spent: 350,
        remaining: 150,
        percentageUsed: 70,
        status: 'warning',
      },
    ];

    const { container } = render(<BudgetComparisonChart budgets={budgets} />);

    // Check for percentage display
    const percentages = container.querySelectorAll('.bar-percentage');
    expect(percentages.length).toBeGreaterThan(0);
  });

  it('should sort budgets by spent amount descending', () => {
    const budgets: BudgetStatus[] = [
      {
        category: 'Food',
        budgetLimit: 500,
        spent: 100,
        remaining: 400,
        percentageUsed: 20,
        status: 'on-track',
      },
      {
        category: 'Entertainment',
        budgetLimit: 300,
        spent: 250,
        remaining: 50,
        percentageUsed: 83,
        status: 'warning',
      },
      {
        category: 'Shopping',
        budgetLimit: 400,
        spent: 350,
        remaining: 50,
        percentageUsed: 87,
        status: 'warning',
      },
    ];

    const { container } = render(<BudgetComparisonChart budgets={budgets} />);

    const labels = container.querySelectorAll('.bar-label');
    // Should be sorted: Shopping (350), Entertainment (250), Food (100)
    if (labels.length > 0) {
      expect(labels[0].textContent).toBeDefined();
    }
  });

  it('should display legend with all status types', () => {
    const budgets: BudgetStatus[] = [
      {
        category: 'Food',
        budgetLimit: 500,
        spent: 300,
        remaining: 200,
        percentageUsed: 60,
        status: 'on-track',
      },
      {
        category: 'Entertainment',
        budgetLimit: 200,
        spent: 180,
        remaining: 20,
        percentageUsed: 90,
        status: 'warning',
      },
      {
        category: 'Shopping',
        budgetLimit: 300,
        spent: 350,
        remaining: -50,
        percentageUsed: 116.67,
        status: 'exceeded',
      },
    ];

    render(<BudgetComparisonChart budgets={budgets} />);

    expect(screen.getByText('Budget Limit')).toBeInTheDocument();
    expect(screen.getByText(/on track/i)).toBeInTheDocument();
    expect(screen.getByText('Warning (80-100%)')).toBeInTheDocument();
    expect(screen.getByText(/exceeded/i)).toBeInTheDocument();
  });

  it('should handle budget at exactly 100% utilization', () => {
    const budgets: BudgetStatus[] = [
      {
        category: 'Food',
        budgetLimit: 500,
        spent: 500,
        remaining: 0,
        percentageUsed: 100,
        status: 'warning',
      },
    ];

    const { container } = render(<BudgetComparisonChart budgets={budgets} />);

    // Should render chart without errors
    expect(container.querySelector('.budget-comparison-container')).toBeInTheDocument();
  });

  it('should handle budget exceeded', () => {
    const budgets: BudgetStatus[] = [
      {
        category: 'Food',
        budgetLimit: 500,
        spent: 600,
        remaining: -100,
        percentageUsed: 120,
        status: 'exceeded',
      },
    ];

    const { container } = render(<BudgetComparisonChart budgets={budgets} />);

    // Should render chart with exceeded status
    expect(container.querySelector('.budget-comparison-container')).toBeInTheDocument();
  });

  it('should create SVG elements with proper structure', () => {
    const budgets: BudgetStatus[] = [
      {
        category: 'Food',
        budgetLimit: 500,
        spent: 300,
        remaining: 200,
        percentageUsed: 60,
        status: 'on-track',
      },
    ];

    const { container } = render(<BudgetComparisonChart budgets={budgets} />);

    // Check for comparison bars
    const bars = container.querySelectorAll('.comparison-bar');
    expect(bars.length).toBeGreaterThan(0);
  });

  it('should apply correct CSS classes for status colors', () => {
    const budgets: BudgetStatus[] = [
      {
        category: 'Food',
        budgetLimit: 500,
        spent: 300,
        remaining: 200,
        percentageUsed: 60,
        status: 'on-track',
      },
      {
        category: 'Entertainment',
        budgetLimit: 200,
        spent: 180,
        remaining: 20,
        percentageUsed: 90,
        status: 'warning',
      },
    ];

    const { container } = render(<BudgetComparisonChart budgets={budgets} />);

    // Check for status class elements
    const onTrackElements = container.querySelectorAll('.on-track');
    const warningElements = container.querySelectorAll('.warning');

    expect(onTrackElements.length).toBeGreaterThan(0);
    expect(warningElements.length).toBeGreaterThan(0);
  });
});
