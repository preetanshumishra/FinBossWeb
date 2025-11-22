# FinBoss Web

A modern personal finance management application built with React, TypeScript, and Vite.

## Features

- User authentication (Register, Login, Logout)
- Transaction tracking and management
- Budget planning and monitoring
- Financial analytics and insights
- Real-time data synchronization with backend API

## Tech Stack

- **Frontend Framework**: React 18
- **Language**: TypeScript
- **Build Tool**: Vite
- **State Management**: Zustand
- **HTTP Client**: Axios
- **Styling**: Tailwind CSS
- **UI Components**: Custom components

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
- `POST /auth/logout` - Logout user

### Transaction Routes
- `GET /transactions` - Get all transactions
- `POST /transactions` - Create new transaction
- `PUT /transactions/:id` - Update transaction
- `DELETE /transactions/:id` - Delete transaction

### Budget Routes
- `GET /budgets` - Get all budgets
- `POST /budgets` - Create new budget
- `PUT /budgets/:id` - Update budget
- `DELETE /budgets/:id` - Delete budget

## Project Structure

```
src/
├── components/       # Reusable UI components
├── pages/           # Page components
├── services/        # API client and services
├── stores/          # Zustand state management
├── styles/          # Global styles
├── types/           # TypeScript type definitions
├── utils/           # Utility functions
└── App.tsx          # Root component
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Backend API base URL | `http://localhost:3000` |

## Troubleshooting

### CORS Issues

If you encounter CORS errors, ensure:
1. Backend API is running on `http://localhost:3000`
2. Frontend `.env` is configured correctly
3. Backend CORS configuration allows requests from `http://localhost:5173`

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
