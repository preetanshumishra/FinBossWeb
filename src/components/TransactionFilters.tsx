import { FormSelect } from './FormSelect';
import { FormInput } from './FormInput';

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

interface TransactionFiltersProps {
  filters: {
    type: '' | 'income' | 'expense';
    category: string;
    startDate: string;
    endDate: string;
    search: string;
  };
  onFilterChange: (filters: {
    type: '' | 'income' | 'expense';
    category: string;
    startDate: string;
    endDate: string;
    search: string;
  }) => void;
}

export const TransactionFilters = ({
  filters,
  onFilterChange,
}: TransactionFiltersProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    onFilterChange({
      ...filters,
      [name]: value,
    });
  };

  const handleReset = () => {
    onFilterChange({
      type: '',
      category: '',
      startDate: '',
      endDate: '',
      search: '',
    });
  };

  return (
    <div className="filters-container">
      <div className="filters-header">
        <FormInput
          label="Search"
          name="search"
          type="text"
          value={filters.search}
          onChange={handleChange}
          placeholder="Search by description or category..."
        />
      </div>

      <div className="filters-grid">
        <FormSelect
          label="Type"
          name="type"
          value={filters.type}
          onChange={handleChange}
          options={[
            { value: '', label: 'All Types' },
            { value: 'expense', label: 'Expenses' },
            { value: 'income', label: 'Income' },
          ]}
        />

        <FormSelect
          label="Category"
          name="category"
          value={filters.category}
          onChange={handleChange}
          options={[
            { value: '', label: 'All Categories' },
            ...CATEGORIES.map((cat) => ({ value: cat, label: cat })),
          ]}
        />

        <FormInput
          label="Start Date"
          name="startDate"
          type="date"
          value={filters.startDate}
          onChange={handleChange}
        />

        <FormInput
          label="End Date"
          name="endDate"
          type="date"
          value={filters.endDate}
          onChange={handleChange}
        />
      </div>

      <button className="btn-secondary" onClick={handleReset}>
        Clear Filters
      </button>
    </div>
  );
};
