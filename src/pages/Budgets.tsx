import { useEffect, useState } from 'react';
import { Navbar } from '../components/Navbar';
import { budgetService } from '../services/budgetService';
import { useToastStore } from '../stores/toastStore';
import type { Budget, BudgetRequest, BudgetStatus } from '../types';
import { BudgetForm } from '../components/BudgetForm';
import { BudgetList } from '../components/BudgetList';
import { ExportMenu } from '../components/ExportMenu';
import { generateBudgetCSV, downloadCSV, generateBudgetPDF } from '../utils/exportUtils';
import '../styles/Budgets.css';

export const Budgets = () => {
  const { addToast } = useToastStore();
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [budgetStatus, setBudgetStatus] = useState<BudgetStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);

  const fetchBudgets = async () => {
    try {
      setLoading(true);
      setError('');
      const [allBudgets, statusData] = await Promise.all([
        budgetService.getAll(),
        budgetService.getOverview(),
      ]);
      setBudgets(allBudgets);
      setBudgetStatus(statusData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load budgets');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, []);

  const handleAdd = () => {
    setEditingBudget(null);
    setShowForm(true);
  };

  const handleEdit = (category: string) => {
    const budget = budgets.find((b) => b.category === category);
    if (budget) {
      setEditingBudget(budget);
      setShowForm(true);
    }
  };

  const handleDelete = async (category: string) => {
    if (!confirm(`Are you sure you want to delete the budget for ${category}?`)) {
      return;
    }

    try {
      // Find the budget by category and delete it by ID
      const budget = budgets.find((b) => b.category === category);
      if (budget) {
        await budgetService.delete(budget._id);
        setBudgets(budgets.filter((b) => b._id !== budget._id));
        setBudgetStatus(budgetStatus.filter((s) => s.category !== category));
        setError('');
        addToast({
          type: 'success',
          message: `Budget for ${category} deleted successfully`,
        });
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to delete budget';
      setError(errorMsg);
      addToast({
        type: 'error',
        message: errorMsg,
      });
    }
  };

  const handleSubmit = async (data: BudgetRequest) => {
    try {
      if (editingBudget) {
        const updated = await budgetService.update(editingBudget._id, data);
        setBudgets(budgets.map((b) => (b._id === editingBudget._id ? updated : b)));
        addToast({
          type: 'success',
          message: 'Budget updated successfully',
        });
      } else {
        const created = await budgetService.create(data);
        setBudgets([...budgets, created]);
        addToast({
          type: 'success',
          message: 'Budget created successfully',
        });
      }

      // Refresh budget status
      const statusData = await budgetService.getOverview();
      setBudgetStatus(statusData);

      setShowForm(false);
      setEditingBudget(null);
      setError('');
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to save budget';
      setError(errorMsg);
      addToast({
        type: 'error',
        message: errorMsg,
      });
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingBudget(null);
  };

  const handleExportCSV = () => {
    try {
      const csv = generateBudgetCSV(budgetStatus);
      const filename = `budgets-${new Date().toISOString().split('T')[0]}.csv`;
      downloadCSV(csv, filename);
      addToast({
        type: 'success',
        message: 'Budgets exported to CSV successfully',
      });
    } catch {
      addToast({
        type: 'error',
        message: 'Failed to export budgets to CSV',
      });
    }
  };

  const handleExportPDF = () => {
    try {
      generateBudgetPDF(budgetStatus);
      addToast({
        type: 'success',
        message: 'Opening print dialog for PDF export',
      });
    } catch {
      addToast({
        type: 'error',
        message: 'Failed to export budgets to PDF',
      });
    }
  };

  return (
    <div className="budgets-layout">
      <Navbar />

      <div className="budgets-container">
        {error && (
          <div className="error-banner">
            {error}
          </div>
        )}

        {!showForm && (
          <div className="budgets-header">
            <h1>Budgets</h1>
            <div className="header-actions">
              <ExportMenu
                onExportCSV={handleExportCSV}
                onExportPDF={handleExportPDF}
                disabled={budgetStatus.length === 0}
              />
              <button className="btn-primary" onClick={handleAdd}>
                + Create Budget
              </button>
            </div>
          </div>
        )}

        {showForm ? (
          <BudgetForm
            budget={editingBudget || undefined}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        ) : (
          <>
            {loading ? (
              <div className="loading-spinner">
                <div className="spinner"></div>
                <p>Loading budgets...</p>
              </div>
            ) : budgetStatus.length === 0 ? (
              <div className="empty-state">
                <p>No budgets yet. Create one to start tracking your spending!</p>
              </div>
            ) : (
              <>
                <div className="budgets-summary">
                  <div className="summary-stat">
                    <span className="stat-label">Total Budgets</span>
                    <span className="stat-value">{budgetStatus.length}</span>
                  </div>
                  <div className="summary-stat">
                    <span className="stat-label">On Track</span>
                    <span className="stat-value on-track">
                      {budgetStatus.filter((b) => b.status === 'on-track').length}
                    </span>
                  </div>
                  <div className="summary-stat">
                    <span className="stat-label">Warning</span>
                    <span className="stat-value warning">
                      {budgetStatus.filter((b) => b.status === 'warning').length}
                    </span>
                  </div>
                  <div className="summary-stat">
                    <span className="stat-label">Exceeded</span>
                    <span className="stat-value exceeded">
                      {budgetStatus.filter((b) => b.status === 'exceeded').length}
                    </span>
                  </div>
                </div>

                <BudgetList
                  budgets={budgetStatus}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};
