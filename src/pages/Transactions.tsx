import { useEffect, useState } from 'react';
import { Navbar } from '../components/Navbar';
import { transactionService } from '../services/transactionService';
import { useToastStore } from '../stores/toastStore';
import type { Transaction, TransactionRequest } from '../types';
import { TransactionForm } from '../components/TransactionForm';
import { TransactionList } from '../components/TransactionList';
import { TransactionFilters } from '../components/TransactionFilters';
import { Pagination } from '../components/Pagination';
import { ExportMenu } from '../components/ExportMenu';
import { generateTransactionCSV, downloadCSV, generateTransactionPDF } from '../utils/exportUtils';
import '../styles/Transactions.css';

export const Transactions = () => {
  const { addToast } = useToastStore();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  // Filter states
  const [filters, setFilters] = useState({
    type: '' as '' | 'income' | 'expense',
    category: '',
    startDate: '',
    endDate: '',
    search: '',
  });

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      setError('');
      const filterParams = {
        type: filters.type || undefined,
        category: filters.category || undefined,
        startDate: filters.startDate || undefined,
        endDate: filters.endDate || undefined,
        search: filters.search || undefined,
        page: currentPage,
        limit: pageSize,
      };
      const { transactions: data, pagination } = await transactionService.getAll(filterParams);
      setTransactions(data);
      setTotalPages(pagination.pages);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load transactions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  useEffect(() => {
    fetchTransactions();
  }, [filters, currentPage, pageSize]);

  const handleAdd = () => {
    setEditingId(null);
    setEditingTransaction(null);
    setShowForm(true);
  };

  const handleEdit = (transaction: Transaction) => {
    setEditingId(transaction._id);
    setEditingTransaction(transaction);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this transaction?')) {
      return;
    }

    try {
      await transactionService.delete(id);
      addToast({
        type: 'success',
        message: 'Transaction deleted successfully',
      });
      // Refresh transactions
      fetchTransactions();
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to delete transaction';
      setError(errorMsg);
      addToast({
        type: 'error',
        message: errorMsg,
      });
    }
  };

  const handleSubmit = async (data: TransactionRequest) => {
    try {
      if (editingId) {
        await transactionService.update(editingId, data);
        addToast({
          type: 'success',
          message: 'Transaction updated successfully',
        });
      } else {
        await transactionService.create(data);
        addToast({
          type: 'success',
          message: 'Transaction created successfully',
        });
      }
      setShowForm(false);
      setEditingId(null);
      setEditingTransaction(null);
      setError('');
      // Refresh to get updated list
      setCurrentPage(1);
      fetchTransactions();
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to save transaction';
      setError(errorMsg);
      addToast({
        type: 'error',
        message: errorMsg,
      });
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setEditingTransaction(null);
  };

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
  };

  const handleExportCSV = () => {
    try {
      const csv = generateTransactionCSV(transactions);
      const filename = `transactions-${new Date().toISOString().split('T')[0]}.csv`;
      downloadCSV(csv, filename);
      addToast({
        type: 'success',
        message: 'Transactions exported to CSV successfully',
      });
    } catch (err) {
      addToast({
        type: 'error',
        message: 'Failed to export transactions to CSV',
      });
    }
  };

  const handleExportPDF = () => {
    try {
      generateTransactionPDF(transactions);
      addToast({
        type: 'success',
        message: 'Opening print dialog for PDF export',
      });
    } catch (err) {
      addToast({
        type: 'error',
        message: 'Failed to export transactions to PDF',
      });
    }
  };

  return (
    <div className="transactions-layout">
      <Navbar />

      <div className="transactions-container">
        {error && (
          <div className="error-banner">
            {error}
          </div>
        )}

        {!showForm && (
          <div className="transactions-header">
            <h1>Transactions</h1>
            <div className="header-actions">
              <ExportMenu
                onExportCSV={handleExportCSV}
                onExportPDF={handleExportPDF}
                disabled={transactions.length === 0}
              />
              <button className="btn-primary" onClick={handleAdd}>
                + Add Transaction
              </button>
            </div>
          </div>
        )}

        {showForm ? (
          <TransactionForm
            transaction={editingTransaction || undefined}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        ) : (
          <>
            <TransactionFilters filters={filters} onFilterChange={handleFilterChange} />

            {loading ? (
              <div className="loading-spinner">
                <div className="spinner"></div>
                <p>Loading transactions...</p>
              </div>
            ) : transactions.length === 0 ? (
              <div className="empty-state">
                <p>
                  No transactions found.{' '}
                  {!Object.values(filters).some((v) => v)
                    ? 'Start by adding your first transaction!'
                    : 'Try adjusting your filters.'}
                </p>
              </div>
            ) : (
              <>
                <TransactionList
                  transactions={transactions}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
                {totalPages > 1 && (
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                    disabled={loading}
                  />
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};
