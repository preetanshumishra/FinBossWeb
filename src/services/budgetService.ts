import api from './api';
import type { Budget, BudgetRequest, BudgetStatus } from '../types';

export const budgetService = {
  getAll: async (): Promise<Budget[]> => {
    const response = await api.get<Budget[]>('/budgets');
    return response.data;
  },

  getById: async (id: string): Promise<Budget> => {
    const response = await api.get<Budget>(`/budgets/${id}`);
    return response.data;
  },

  create: async (data: BudgetRequest): Promise<Budget> => {
    const response = await api.post<Budget>('/budgets', data);
    return response.data;
  },

  update: async (id: string, data: Partial<BudgetRequest>): Promise<Budget> => {
    const response = await api.put<Budget>(`/budgets/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/budgets/${id}`);
  },

  getOverview: async (): Promise<BudgetStatus[]> => {
    const response = await api.get<BudgetStatus[]>('/budgets/status/overview');
    return response.data;
  },
};
