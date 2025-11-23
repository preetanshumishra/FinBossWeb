import { useState } from 'react';
import { FormInput } from './FormInput';
import { FormSelect } from './FormSelect';
import type { Budget, BudgetRequest } from '../types';

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

interface BudgetFormProps {
  budget?: Budget;
  onSubmit: (data: BudgetRequest) => Promise<void>;
  onCancel: () => void;
}

export const BudgetForm = ({
  budget,
  onSubmit,
  onCancel,
}: BudgetFormProps) => {
  const [formData, setFormData] = useState<BudgetRequest>({
    category: budget?.category || '',
    limit: budget?.limit || 0,
    period: budget?.period || 'monthly',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.category) newErrors.category = 'Category is required';
    if (formData.limit <= 0) newErrors.limit = 'Limit must be greater than 0';
    if (!formData.period) newErrors.period = 'Period is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'limit' ? parseFloat(value) || 0 : value,
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
    <div className="budget-form-container">
      <div className="form-card">
        <h2>{budget ? 'Edit Budget' : 'Create New Budget'}</h2>

        <form onSubmit={handleSubmit}>
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

          <FormInput
            label="Budget Limit"
            name="limit"
            type="number"
            value={formData.limit}
            onChange={handleChange}
            placeholder="0.00"
            required
            error={errors.limit}
          />

          <FormSelect
            label="Period"
            name="period"
            value={formData.period}
            onChange={handleChange}
            options={[
              { value: 'monthly', label: 'Monthly' },
              { value: 'yearly', label: 'Yearly' },
            ]}
            required
            error={errors.period}
          />

          <div className="form-actions">
            <button
              type="submit"
              className="btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? 'Saving...'
                : budget
                  ? 'Update Budget'
                  : 'Create Budget'}
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
