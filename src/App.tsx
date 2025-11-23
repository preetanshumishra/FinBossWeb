import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';
import { useToastStore } from './stores/toastStore';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ToastContainer } from './components/ToastContainer';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { Transactions } from './pages/Transactions';
import { Budgets } from './pages/Budgets';
import { Analytics } from './pages/Analytics';
import { Settings } from './pages/Settings';

function App() {
  const { user, accessToken } = useAuthStore();
  const { messages, removeToast } = useToastStore();

  // Protected route wrapper
  const ProtectedRoute = ({ element }: { element: React.ReactNode }) => {
    return accessToken && user ? element : <Navigate to="/login" replace />;
  };

  return (
    <ErrorBoundary>
      <Router>
        <ToastContainer messages={messages} onClose={removeToast} />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected routes */}
          <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} />} />
          <Route path="/transactions" element={<ProtectedRoute element={<Transactions />} />} />
          <Route path="/budgets" element={<ProtectedRoute element={<Budgets />} />} />
          <Route path="/analytics" element={<ProtectedRoute element={<Analytics />} />} />
          <Route path="/settings" element={<ProtectedRoute element={<Settings />} />} />

          {/* Default route */}
          <Route
            path="/"
            element={
              accessToken && user ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
        </Routes>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
