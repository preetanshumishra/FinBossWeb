import { generateTransactionCSV, generateBudgetCSV, downloadCSV } from '../exportUtils';
import type { Transaction, BudgetStatus } from '../../types';

describe('exportUtils', () => {
  describe('generateTransactionCSV', () => {
    it('should return a message when given empty transactions array', () => {
      const csv = generateTransactionCSV([]);
      expect(csv).toBe('No transactions to export');
    });

    it('should generate CSV with headers when given transactions', () => {
      const transactions: Transaction[] = [
        {
          _id: '1',
          userId: 'user1',
          type: 'expense',
          amount: 100.5,
          category: 'Food',
          description: 'Lunch',
          date: '2024-01-15',
          createdAt: '2024-01-15T10:00:00Z',
        },
      ];

      const csv = generateTransactionCSV(transactions);

      expect(csv).toContain('Date');
      expect(csv).toContain('Description');
      expect(csv).toContain('Category');
      expect(csv).toContain('Type');
      expect(csv).toContain('Amount');
      expect(csv).toContain('Recurring');
      expect(csv).toContain('Pattern');
    });

    it('should format amount with 2 decimal places', () => {
      const transactions: Transaction[] = [
        {
          _id: '1',
          userId: 'user1',
          type: 'income',
          amount: 1000,
          category: 'Salary',
          description: 'Monthly salary',
          date: '2024-01-01',
          createdAt: '2024-01-01T09:00:00Z',
        },
      ];

      const csv = generateTransactionCSV(transactions);
      expect(csv).toContain('1000.00');
    });

    it('should escape quotes in CSV fields', () => {
      const transactions: Transaction[] = [
        {
          _id: '1',
          userId: 'user1',
          type: 'expense',
          amount: 50,
          category: 'Entertainment',
          description: 'Movie "Avatar"',
          date: '2024-01-10',
          createdAt: '2024-01-10T19:00:00Z',
        },
      ];

      const csv = generateTransactionCSV(transactions);
      // Double quotes should be escaped
      expect(csv).toContain('Movie ""Avatar""');
    });

    it('should wrap fields with commas in quotes', () => {
      const transactions: Transaction[] = [
        {
          _id: '1',
          userId: 'user1',
          type: 'expense',
          amount: 75,
          category: 'Food',
          description: 'Lunch at Bob, Joe\'s Diner',
          date: '2024-01-12',
          createdAt: '2024-01-12T12:00:00Z',
        },
      ];

      const csv = generateTransactionCSV(transactions);
      expect(csv).toContain('"Lunch at Bob, Joe\'s Diner"');
    });

    it('should handle recurring transactions', () => {
      const transactions: Transaction[] = [
        {
          _id: '1',
          userId: 'user1',
          type: 'expense',
          amount: 50,
          category: 'Subscriptions',
          description: 'Netflix',
          date: '2024-01-01',
          isRecurring: true,
          recurringPattern: 'monthly',
          createdAt: '2024-01-01T00:00:00Z',
        },
      ];

      const csv = generateTransactionCSV(transactions);
      expect(csv).toContain('Yes');
      expect(csv).toContain('Monthly');
    });

    it('should handle non-recurring transactions', () => {
      const transactions: Transaction[] = [
        {
          _id: '1',
          userId: 'user1',
          type: 'expense',
          amount: 50,
          category: 'Food',
          description: 'One-time meal',
          date: '2024-01-15',
          isRecurring: false,
          createdAt: '2024-01-15T19:00:00Z',
        },
      ];

      const csv = generateTransactionCSV(transactions);
      expect(csv).toContain('No');
      expect(csv).toContain('N/A');
    });

    it('should correctly format dates', () => {
      const transactions: Transaction[] = [
        {
          _id: '1',
          userId: 'user1',
          type: 'expense',
          amount: 100,
          category: 'Test',
          description: 'Test',
          date: '2024-12-25',
          createdAt: '2024-12-25T00:00:00Z',
        },
      ];

      const csv = generateTransactionCSV(transactions);
      // Date formatting depends on timezone, so just check that a date is present
      expect(csv).toContain('2024');
      expect(csv).toMatch(/\d{1,2}\/\d{1,2}\/2024/);
    });

    it('should distinguish between income and expense types', () => {
      const transactions: Transaction[] = [
        {
          _id: '1',
          userId: 'user1',
          type: 'income',
          amount: 1000,
          category: 'Salary',
          description: 'Paycheck',
          date: '2024-01-01',
          createdAt: '2024-01-01T00:00:00Z',
        },
        {
          _id: '2',
          userId: 'user1',
          type: 'expense',
          amount: 100,
          category: 'Food',
          description: 'Groceries',
          date: '2024-01-02',
          createdAt: '2024-01-02T00:00:00Z',
        },
      ];

      const csv = generateTransactionCSV(transactions);
      expect(csv).toContain('Income');
      expect(csv).toContain('Expense');
    });
  });

  describe('generateBudgetCSV', () => {
    it('should return a message when given empty budgets array', () => {
      const csv = generateBudgetCSV([]);
      expect(csv).toBe('No budgets to export');
    });

    it('should generate CSV with headers when given budgets', () => {
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

      const csv = generateBudgetCSV(budgets);

      expect(csv).toContain('Category');
      expect(csv).toContain('Budget Limit');
      expect(csv).toContain('Spent');
      expect(csv).toContain('Remaining');
      expect(csv).toContain('Percentage Used');
      expect(csv).toContain('Status');
    });

    it('should format currency values with 2 decimal places', () => {
      const budgets: BudgetStatus[] = [
        {
          category: 'Food',
          budgetLimit: 500.5,
          spent: 300.25,
          remaining: 200.25,
          percentageUsed: 60,
          status: 'on-track',
        },
      ];

      const csv = generateBudgetCSV(budgets);
      expect(csv).toContain('500.50');
      expect(csv).toContain('300.25');
      expect(csv).toContain('200.25');
    });

    it('should format percentage with 1 decimal place and % sign', () => {
      const budgets: BudgetStatus[] = [
        {
          category: 'Food',
          budgetLimit: 500,
          spent: 350,
          remaining: 150,
          percentageUsed: 70.5,
          status: 'warning',
        },
      ];

      const csv = generateBudgetCSV(budgets);
      expect(csv).toContain('70.5%');
    });

    it('should escape quotes in category names', () => {
      const budgets: BudgetStatus[] = [
        {
          category: 'Entertainment "Movies"',
          budgetLimit: 100,
          spent: 50,
          remaining: 50,
          percentageUsed: 50,
          status: 'on-track',
        },
      ];

      const csv = generateBudgetCSV(budgets);
      expect(csv).toContain('Entertainment ""Movies""');
    });

    it('should handle different budget statuses', () => {
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

      const csv = generateBudgetCSV(budgets);
      expect(csv).toContain('on-track');
      expect(csv).toContain('warning');
      expect(csv).toContain('exceeded');
    });
  });

  describe('downloadCSV', () => {
    beforeEach(() => {
      // Mock URL.createObjectURL
      URL.createObjectURL = jest.fn(() => 'blob:mock-url');
      URL.revokeObjectURL = jest.fn();
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('should not throw error when called', () => {
      // downloadCSV has side effects that are hard to test in jsdom
      // Just ensure it doesn't throw
      expect(() => {
        downloadCSV('test,content', 'test.csv');
      }).not.toThrow();
    });
  });
});
