# FinBoss Web

A modern personal finance management application built with React, TypeScript, and Vite.

## Features

- **User Authentication**: Register, login, logout, and session management with JWT
- **Profile Management**: Update profile, change password, delete account
- **User Preferences**: Save and manage notification and alert settings
- **Transaction Management**: Track, filter, and analyze income and expenses
- **Budget Planning**: Create and monitor spending budgets with alerts
- **Advanced Analytics**: View spending trends, forecasts, and budget comparisons
- **Data Export**: Export financial data as JSON
- **Responsive Design**: Mobile-friendly interface with Tailwind CSS
- **Real-time Sync**: Automatic synchronization with backend API

## Tech Stack

- **Frontend Framework**: React 18
- **Language**: TypeScript 5.x
- **Build Tool**: Vite 7.x
- **State Management**: Zustand
- **HTTP Client**: Axios
- **Styling**: Custom CSS
- **UI Components**: Custom reusable components
- **Testing**: Jest + React Testing Library
- **Charts**: Recharts for analytics visualization

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn

## Getting Started

### Installation

1. Clone the repository:
```bash
git clone https://github.com/preetanshumishra/FinBossWeb.git
cd FinBossWeb
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
VITE_API_BASE_URL=http://localhost:3000
```

### Development

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Build

Build for production:
```bash
npm run build
```

### Preview

Preview the production build locally:
```bash
npm run preview
```

## API Endpoints

The application communicates with the FinBoss API backend:

- **Base URL**: `http://localhost:3000/api/v1`
- **Authentication**: Bearer token in Authorization header
- **Health Check**: `http://localhost:3000/health`
- **API Docs**: `http://localhost:3000/api-docs`

### Auth Routes
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `POST /auth/refresh` - Refresh access token
- `GET /auth/profile` - Get user profile (protected)
- `PUT /auth/profile` - Update user profile (protected)
- `POST /auth/change-password` - Change password (protected)
- `DELETE /auth/account` - Delete account (protected)
- `GET /auth/preferences` - Get user preferences (protected)
- `POST /auth/preferences` - Save user preferences (protected)

### Transaction Routes
- `GET /transactions` - Get all transactions (with filters and pagination)
- `POST /transactions` - Create new transaction
- `GET /transactions/:id` - Get transaction by ID
- `PUT /transactions/:id` - Update transaction
- `DELETE /transactions/:id` - Delete transaction
- `GET /transactions/summary` - Get income/expense summary
- `GET /transactions/analytics/category` - Get breakdown by category
- `GET /transactions/trends` - Get spending trends (daily/weekly/monthly)
- `GET /transactions/forecast` - Get spending forecast with confidence score

### Analytics Routes
- `GET /analytics/budget-vs-actual` - Compare budgeted vs actual spending by category

### Budget Routes
- `GET /budgets` - Get all budgets
- `POST /budgets` - Create new budget
- `GET /budgets/:id` - Get budget details
- `PUT /budgets/:id` - Update budget
- `DELETE /budgets/:id` - Delete budget
- `GET /budgets/status/overview` - Get budget health status

### Category Routes
- `GET /categories` - Get all categories (default and custom)
- `POST /categories` - Create custom category (protected)
- `PUT /categories/:id` - Update category (protected)
- `DELETE /categories/:id` - Delete custom category (protected)

## Project Structure

```
src/
├── components/
│   ├── common/              # Common UI components
│   │   ├── Header.tsx       # Navigation header
│   │   ├── Sidebar.tsx      # Side navigation
│   │   ├── Toast.tsx        # Toast notifications
│   │   └── Modal.tsx        # Modal dialogs
│   ├── auth/                # Authentication components
│   │   ├── LoginForm.tsx    # Login form
│   │   └── RegisterForm.tsx # Registration form
│   ├── dashboard/           # Dashboard widgets
│   │   ├── SummaryCard.tsx
│   │   ├── RecentTransactions.tsx
│   │   └── BudgetOverview.tsx
│   ├── analytics/           # Analytics visualizations
│   │   ├── BudgetComparisonChart.tsx
│   │   ├── CategoryBreakdown.tsx
│   │   ├── ExpenseTypeBreakdown.tsx
│   │   ├── MonthlyTrendsChart.tsx
│   │   └── SpendingForecast.tsx
│   ├── transactions/        # Transaction management
│   │   ├── TransactionList.tsx
│   │   ├── TransactionForm.tsx
│   │   ├── TransactionFilters.tsx
│   │   └── TransactionModal.tsx
│   ├── budgets/             # Budget management
│   │   ├── BudgetList.tsx
│   │   ├── BudgetForm.tsx
│   │   └── BudgetAlerts.tsx
│   └── settings/            # Settings components
│       ├── ProfileSection.tsx
│       ├── PreferencesSection.tsx
│       └── AccountManagement.tsx
├── pages/
│   ├── Dashboard.tsx        # Main dashboard
│   ├── Transactions.tsx     # Transactions page
│   ├── Budgets.tsx         # Budgets page
│   ├── Analytics.tsx       # Analytics page
│   ├── Settings.tsx        # Settings page
│   ├── Login.tsx           # Login page
│   ├── Register.tsx        # Register page
│   └── __tests__/          # Page tests
├── services/
│   ├── api.ts                  # Axios instance
│   ├── authService.ts          # Authentication API
│   ├── transactionService.ts   # Transactions API
│   ├── budgetService.ts        # Budgets API
│   ├── analyticsService.ts     # Analytics API
│   └── categoryService.ts      # Categories API
├── stores/
│   ├── authStore.ts        # Authentication state
│   ├── transactionStore.ts # Transactions state
│   ├── budgetStore.ts      # Budgets state
│   └── toastStore.ts       # Toast notifications state
├── types/
│   ├── index.ts            # Shared types
│   ├── auth.ts             # Auth types
│   ├── transaction.ts      # Transaction types
│   ├── budget.ts           # Budget types
│   └── category.ts         # Category types
├── styles/
│   ├── App.css             # Global styles
│   ├── variables.css       # CSS variables
│   └── tailwind.css        # Tailwind imports
├── utils/
│   ├── formatters.ts       # Formatting utilities
│   ├── validators.ts       # Validation utilities
│   └── constants.ts        # App constants
├── App.tsx                 # Root component
├── App.test.tsx            # App tests
└── main.tsx                # Entry point
```

## Scripts

- `npm run dev` - Start development server with hot module replacement
- `npm run build` - Build for production (TypeScript compilation and bundling)
- `npm run preview` - Preview production build locally
- `npm run test` - Run Jest test suite
- `npm run test:watch` - Run tests in watch mode
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript compiler check

## Testing

The application includes comprehensive test coverage:

- **Total Tests**: 73 passing tests
- **Testing Framework**: Jest + React Testing Library
- **Test Files**: Located in `__tests__` directories alongside components and pages
- **Coverage Areas**:
  - Authentication components and flows
  - Transaction management and filtering
  - Budget creation and updates
  - Settings and user preferences
  - Form validation and submission
  - Error handling and API integration

### Running Tests

```bash
# Run all tests
npm run test

# Run tests in watch mode (re-run on file changes)
npm run test:watch

# Run tests with coverage
npm run test -- --coverage

# Run specific test file
npm run test -- Settings.test.tsx
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Backend API base URL | `http://localhost:3000` |
| `VITE_APP_NAME` | Application name | `FinBoss` |

## Deployment

### Deployment to Vercel

Vercel is recommended for deploying the FinBoss Web frontend due to excellent React support, automatic optimizations, and generous free tier.

#### Prerequisites

- Vercel account (sign up at https://vercel.com)
- GitHub repository with FinBossWeb code pushed

#### Deployment Steps

1. **Connect Repository**:
   - Go to [Vercel](https://vercel.com) and sign in
   - Click "Add New" → "Project"
   - Select your FinBossWeb repository

2. **Configure Environment Variables**:
   - In Vercel Project Settings, go to Environment Variables
   - Add `VITE_API_BASE_URL` pointing to your deployed API:
     ```
     VITE_API_BASE_URL=https://finbossapi-production.up.railway.app
     ```

3. **Deploy**:
   - Vercel automatically builds and deploys on push to main branch
   - Your app will be available at `https://<your-project>.vercel.app`

#### Environment Variables for Production

| Variable | Example Value |
|----------|---------------|
| `VITE_API_BASE_URL` | `https://finbossapi-production.up.railway.app` |

### Backend API Deployment

The FinBoss API is already deployed on Railway:
- **Live URL**: `https://finbossapi-production.up.railway.app`
- **API Docs**: `https://finbossapi-production.up.railway.app/api-docs`

See [FinBossAPI README](https://github.com/preetanshumishra/FinBossAPI) for backend deployment details.

### Production Deployment Checklist

- [ ] Environment variables configured correctly in Vercel
- [ ] Frontend API base URL points to deployed backend
- [ ] Backend CORS configuration allows frontend domain
- [ ] API tokens and secrets are securely managed
- [ ] Build succeeds without errors (`npm run build`)
- [ ] All tests pass (`npm run test`)
- [ ] TypeScript compilation passes (`npm run type-check`)

## Troubleshooting

### CORS Issues

If you encounter CORS errors, ensure:
1. Backend API is running or deployed
2. Frontend `.env` has correct `VITE_API_BASE_URL`
3. Backend CORS configuration allows requests from your frontend domain

### Port Already in Use

If port 5173 is already in use, you can change it:
```bash
npm run dev -- --port 5174
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is private and proprietary.

## Support

For issues and questions, please reach out to the development team.
