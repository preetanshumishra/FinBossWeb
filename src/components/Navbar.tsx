import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { ThemeToggle } from './ThemeToggle';
import '../styles/Navbar.css';

export const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/dashboard" className="navbar-brand">
          <span className="brand-icon">💰</span>
          FinBoss
        </Link>

        <button className="menu-toggle" onClick={toggleMenu}>
          <span className={`hamburger ${isMenuOpen ? 'open' : ''}`}></span>
        </button>

        <div className={`navbar-menu ${isMenuOpen ? 'open' : ''}`}>
          <div className="navbar-links">
            <Link to="/dashboard" className="nav-link" onClick={() => setIsMenuOpen(false)}>
              Dashboard
            </Link>
            <Link to="/transactions" className="nav-link" onClick={() => setIsMenuOpen(false)}>
              Transactions
            </Link>
            <Link to="/budgets" className="nav-link" onClick={() => setIsMenuOpen(false)}>
              Budgets
            </Link>
            <Link to="/analytics" className="nav-link" onClick={() => setIsMenuOpen(false)}>
              Analytics
            </Link>
          </div>

          <div className="navbar-user">
            <ThemeToggle />
            <div className="user-info">
              <div className="user-avatar">
                {user?.firstName?.[0]?.toUpperCase()}
              </div>
              <div className="user-details">
                <span className="user-name">
                  {user?.firstName} {user?.lastName}
                </span>
                <span className="user-email">{user?.email}</span>
              </div>
            </div>
            <Link to="/settings" className="nav-link settings-link" onClick={() => setIsMenuOpen(false)}>
              Settings
            </Link>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
