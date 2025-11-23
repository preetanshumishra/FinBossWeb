import api from './api';
import type {
  Transaction,
  TransactionRequest,
  TransactionSummary,
  CategoryBreakdown,
} from '../types';

export interface PaginationInfo {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface PaginatedTransactions {
  transactions: Transaction[];
  pagination: PaginationInfo;
}

export interface TransactionTrend {
  date: string;
  income: number;
  expense: number;
  balance: number;
}

export interface SpendingForecast {
  historical_average: number;
  projected_spending: number;
  confidence: number;
  months: number;
}

export const transactionService = {
  getAll: async (filters?: {
    type?: 'income' | 'expense';
    category?: string;
    startDate?: string;
    endDate?: string;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<PaginatedTransactions> => {
    const response = await api.get<PaginatedTransactions>('/transactions', { params: filters });
    return response.data;
  },

  getById: async (id: string): Promise<Transaction> => {
    const response = await api.get<Transaction>(`/transactions/${id}`);
    return response.data;
  },

  create: async (data: TransactionRequest): Promise<Transaction> => {
    const response = await api.post<Transaction>('/transactions', data);
    return response.data;
  },

  update: async (id: string, data: Partial<TransactionRequest>): Promise<Transaction> => {
    const response = await api.put<Transaction>(`/transactions/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/transactions/${id}`);
  },

  getSummary: async (filters?: { startDate?: string; endDate?: string }): Promise<TransactionSummary> => {
    const response = await api.get<TransactionSummary>('/transactions/summary', {
      params: filters,
    });
    return response.data;
  },

  getByCategory: async (filters?: { startDate?: string; endDate?: string }): Promise<CategoryBreakdown[]> => {
    const response = await api.get<CategoryBreakdown[]>(
      '/transactions/analytics/category',
      { params: filters }
    );
    return response.data;
  },

  getTrends: async (filters?: {
    startDate?: string;
    endDate?: string;
    groupBy?: 'day' | 'week' | 'month';
    type?: 'income' | 'expense';
  }): Promise<TransactionTrend[]> => {
    const response = await api.get<{ status: string; data: TransactionTrend[] }>(
      '/transactions/trends',
      { params: filters }
    );
    return response.data.data;
  },

  getForecast: async (filters?: {
    months?: number;
    category?: string;
  }): Promise<SpendingForecast> => {
    const response = await api.get<{ status: string; data: SpendingForecast }>(
      '/transactions/forecast',
      { params: filters }
    );
    return response.data.data;
  },
};
