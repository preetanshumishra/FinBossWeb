import { useState } from 'react';
import { FormInput } from './FormInput';
import { FormSelect } from './FormSelect';
import type { Transaction, TransactionRequest } from '../types';

const CATEGORIES = [
  'Food & Dining',
  'Transportation',
  'Entertainment',
  'Shopping',
  'Utilities',
  'Healthcare',
  'Education',
  'Travel',
  'Subscriptions',
  'Salary',
  'Freelance',
  'Investment Returns',
  'Other',
];

interface TransactionFormProps {
  transaction?: Transaction;
  onSubmit: (data: TransactionRequest) => Promise<void>;
  onCancel: () => void;
}

export const TransactionForm = ({
  transaction,
  onSubmit,
  onCancel,
}: TransactionFormProps) => {
  const [formData, setFormData] = useState<TransactionRequest>({
    type: transaction?.type || 'expense',
    amount: transaction?.amount || 0,
    category: transaction?.category || '',
    description: transaction?.description || '',
    date: transaction?.date.split('T')[0] || new Date().toISOString().split('T')[0],
    isRecurring: transaction?.isRecurring || false,
    recurringPattern: transaction?.recurringPattern || 'monthly',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (formData.amount <= 0) newErrors.amount = 'Amount must be greater than 0';
    if (!formData.date) newErrors.date = 'Date is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const isCheckbox = type === 'checkbox' && e.target instanceof HTMLInputElement;

    setFormData((prev) => ({
      ...prev,
      [name]: isCheckbox ? (e.target as HTMLInputElement).checked :
              name === 'amount' ? parseFloat(value) || 0 :
              value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="transaction-form-container">
      <div className="form-card">
        <h2>{transaction ? 'Edit Transaction' : 'Add New Transaction'}</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <FormSelect
              label="Type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              options={[
                { value: 'expense', label: 'Expense' },
                { value: 'income', label: 'Income' },
              ]}
              required
            />
            <FormSelect
              label="Category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              options={CATEGORIES.map((cat) => ({ value: cat, label: cat }))}
              placeholder="Select a category"
              required
              error={errors.category}
            />
          </div>

          <FormInput
            label="Amount"
            name="amount"
            type="number"
            value={formData.amount}
            onChange={handleChange}
            placeholder="0.00"
            required
            error={errors.amount}
          />

          <FormInput
            label="Date"
            name="date"
            type="date"
            value={formData.date}
            onChange={handleChange}
            required
            error={errors.date}
          />

          <div className="form-group">
            <label htmlFor="description" className="form-label">
              Description
              <span className="required">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter transaction description"
              required
              className={`form-textarea ${errors.description ? 'error' : ''}`}
              rows={3}
            />
            {errors.description && <span className="error-text">{errors.description}</span>}
          </div>

          <div className="form-group recurring-checkbox">
            <label htmlFor="isRecurring" className="checkbox-label">
              <input
                id="isRecurring"
                name="isRecurring"
                type="checkbox"
                checked={formData.isRecurring || false}
                onChange={handleChange}
              />
              <span>Make this a recurring transaction</span>
            </label>
          </div>

          {formData.isRecurring && (
            <FormSelect
              label="Recurrence Pattern"
              name="recurringPattern"
              value={formData.recurringPattern || 'monthly'}
              onChange={handleChange}
              options={[
                { value: 'daily', label: 'Daily' },
                { value: 'weekly', label: 'Weekly' },
                { value: 'monthly', label: 'Monthly' },
                { value: 'yearly', label: 'Yearly' },
              ]}
              required
            />
          )}

          <div className="form-actions">
            <button
              type="submit"
              className="btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? 'Saving...'
                : transaction
                  ? 'Update Transaction'
                  : 'Add Transaction'}
            </button>
            <button
              type="button"
              className="btn-secondary"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
