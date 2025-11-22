import api from './api';
import type {
  Transaction,
  TransactionRequest,
  TransactionSummary,
  CategoryBreakdown,
} from '../types';

export const transactionService = {
  getAll: async (filters?: {
    type?: 'income' | 'expense';
    category?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<Transaction[]> => {
    const response = await api.get<Transaction[]>('/transactions', { params: filters });
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
};
