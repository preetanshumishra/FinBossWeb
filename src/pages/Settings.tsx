import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { FormInput } from '../components/FormInput';
import { useAuthStore } from '../stores/authStore';
import { useToastStore } from '../stores/toastStore';
import { authService } from '../services/authService';
import { transactionService } from '../services/transactionService';
import '../styles/Settings.css';

export const Settings = () => {
  const navigate = useNavigate();
  const { user, setUser, logout } = useAuthStore();
  const { addToast } = useToastStore();

  // Profile state
  const [profileForm, setProfileForm] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
  });
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileErrors, setProfileErrors] = useState<Record<string, string>>({});

  // Password change state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>({});

  // Preferences state
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    budgetAlerts: true,
    weeklyReport: false,
  });

  // Account state
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Export state
  const [exportLoading, setExportLoading] = useState(false);

  useEffect(() => {
    // Load preferences from server
    const loadPreferences = async () => {
      try {
        const userPreferences = await authService.getPreferences();
        setPreferences(userPreferences);
      } catch (error) {
        // If error, use defaults (already set in state)
        console.error('Failed to load preferences:', error);
      }
    };
    loadPreferences();
  }, []);

  // Profile form handlers
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileForm((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field
    setProfileErrors((prev) => ({
      ...prev,
      [name]: '',
    }));
  };

  const validateProfileForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!profileForm.firstName.trim()) {
      errors.firstName = 'First name is required';
    }
    if (!profileForm.lastName.trim()) {
      errors.lastName = 'Last name is required';
    }
    if (!profileForm.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileForm.email)) {
      errors.email = 'Invalid email format';
    }

    setProfileErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateProfileForm()) {
      return;
    }

    setProfileLoading(true);
    try {
      const updatedUser = await authService.updateProfile({
        firstName: profileForm.firstName,
        lastName: profileForm.lastName,
        email: profileForm.email,
      });

      setUser(updatedUser);
      addToast({ message: 'Profile updated successfully', type: 'success' });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update profile';
      addToast({ message: errorMessage, type: 'error' });
    } finally {
      setProfileLoading(false);
    }
  };

  // Password change handlers
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field
    setPasswordErrors((prev) => ({
      ...prev,
      [name]: '',
    }));
  };

  const validatePasswordForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!passwordForm.currentPassword) {
      errors.currentPassword = 'Current password is required';
    }
    if (!passwordForm.newPassword) {
      errors.newPassword = 'New password is required';
    } else if (passwordForm.newPassword.length < 8) {
      errors.newPassword = 'Password must be at least 8 characters';
    }
    if (!passwordForm.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validatePasswordForm()) {
      return;
    }

    setPasswordLoading(true);
    try {
      await authService.changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });

      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      addToast({ message: 'Password changed successfully', type: 'success' });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to change password';
      addToast({ message: errorMessage, type: 'error' });
    } finally {
      setPasswordLoading(false);
    }
  };

  // Preferences handlers
  const handlePreferenceChange = async (preference: string) => {
    const previousPreferences = preferences;
    const updatedPreferences = {
      ...preferences,
      [preference]: !preferences[preference as keyof typeof preferences],
    };
    setPreferences(updatedPreferences);

    try {
      await authService.savePreferences({
        [preference]: updatedPreferences[preference as keyof typeof updatedPreferences],
      });
      addToast({ message: 'Preferences updated', type: 'success' });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update preferences';
      // Revert the local change
      setPreferences(previousPreferences);
      addToast({ message: errorMessage, type: 'error' });
    }
  };

  // Data export handler
  const handleExportData = async () => {
    setExportLoading(true);
    try {
      const { transactions } = await transactionService.getAll({});
      const dataToExport = {
        exportDate: new Date().toISOString(),
        user: {
          name: `${user?.firstName} ${user?.lastName}`,
          email: user?.email,
        },
        transactions,
      };

      const dataStr = JSON.stringify(dataToExport, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `finboss-data-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      addToast({ message: 'Data exported successfully', type: 'success' });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to export data';
      addToast({ message: errorMessage, type: 'error' });
    } finally {
      setExportLoading(false);
    }
  };

  // Account deletion handler
  const handleDeleteAccount = async () => {
    setDeleteLoading(true);
    try {
      await authService.deleteAccount();
      logout();
      addToast({ message: 'Account deleted successfully', type: 'success' });
      navigate('/login');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete account';
      addToast({ message: errorMessage, type: 'error' });
    } finally {
      setDeleteLoading(false);
      setShowDeleteConfirm(false);
    }
  };

  return (
    <div className="settings-page">
      <Navbar />
      <div className="settings-container">
        <div className="settings-header">
          <h1>Account Settings</h1>
          <p>Manage your account, preferences, and privacy</p>
        </div>

        <div className="settings-content">
          {/* Profile Section */}
          <section className="settings-section">
            <div className="section-header">
              <h2>Profile Information</h2>
              <p>Update your personal information</p>
            </div>

            <form onSubmit={handleProfileSubmit} className="settings-form">
              <div className="form-row">
                <div className="form-group">
                  <FormInput
                    label="First Name"
                    type="text"
                    name="firstName"
                    value={profileForm.firstName}
                    onChange={handleProfileChange}
                    error={profileErrors.firstName}
                    required
                  />
                </div>
                <div className="form-group">
                  <FormInput
                    label="Last Name"
                    type="text"
                    name="lastName"
                    value={profileForm.lastName}
                    onChange={handleProfileChange}
                    error={profileErrors.lastName}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <FormInput
                  label="Email Address"
                  type="email"
                  name="email"
                  value={profileForm.email}
                  onChange={handleProfileChange}
                  error={profileErrors.email}
                  required
                />
              </div>

              <div className="form-actions">
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={profileLoading}
                >
                  {profileLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </section>

          {/* Password Section */}
          <section className="settings-section">
            <div className="section-header">
              <h2>Change Password</h2>
              <p>Secure your account with a strong password</p>
            </div>

            <form onSubmit={handlePasswordSubmit} className="settings-form">
              <div className="form-group">
                <FormInput
                  label="Current Password"
                  type="password"
                  name="currentPassword"
                  value={passwordForm.currentPassword}
                  onChange={handlePasswordChange}
                  error={passwordErrors.currentPassword}
                  required
                />
              </div>

              <div className="form-group">
                <FormInput
                  label="New Password"
                  type="password"
                  name="newPassword"
                  value={passwordForm.newPassword}
                  onChange={handlePasswordChange}
                  error={passwordErrors.newPassword}
                  placeholder="At least 8 characters"
                  required
                />
              </div>

              <div className="form-group">
                <FormInput
                  label="Confirm New Password"
                  type="password"
                  name="confirmPassword"
                  value={passwordForm.confirmPassword}
                  onChange={handlePasswordChange}
                  error={passwordErrors.confirmPassword}
                  required
                />
              </div>

              <div className="form-actions">
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={passwordLoading}
                >
                  {passwordLoading ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </form>
          </section>

          {/* Preferences Section */}
          <section className="settings-section">
            <div className="section-header">
              <h2>Preferences</h2>
              <p>Customize your experience</p>
            </div>

            <div className="preferences-list">
              <div className="preference-item">
                <div className="preference-info">
                  <h3>Email Notifications</h3>
                  <p>Receive email updates about your account</p>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={preferences.emailNotifications}
                    onChange={() => handlePreferenceChange('emailNotifications')}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              <div className="preference-item">
                <div className="preference-info">
                  <h3>Budget Alerts</h3>
                  <p>Get notified when you're close to budget limits</p>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={preferences.budgetAlerts}
                    onChange={() => handlePreferenceChange('budgetAlerts')}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              <div className="preference-item">
                <div className="preference-info">
                  <h3>Weekly Report</h3>
                  <p>Receive a weekly summary of your finances</p>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={preferences.weeklyReport}
                    onChange={() => handlePreferenceChange('weeklyReport')}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>
          </section>

          {/* Data Export Section */}
          <section className="settings-section">
            <div className="section-header">
              <h2>Data & Privacy</h2>
              <p>Manage your data and download your information</p>
            </div>

            <div className="data-actions">
              <div className="action-card">
                <h3>Export Your Data</h3>
                <p>Download all your financial data as a JSON file</p>
                <button
                  onClick={handleExportData}
                  disabled={exportLoading}
                  className="btn-secondary"
                >
                  {exportLoading ? 'Exporting...' : 'Export Data'}
                </button>
              </div>
            </div>
          </section>

          {/* Account Management Section */}
          <section className="settings-section danger-zone">
            <div className="section-header">
              <h2>Account Management</h2>
              <p>Dangerous actions - proceed with caution</p>
            </div>

            <div className="danger-actions">
              <div className="action-card danger">
                <h3>Delete Account</h3>
                <p>Permanently delete your account and all associated data</p>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="btn-danger"
                >
                  Delete Account
                </button>
              </div>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
              <div className="confirmation-modal">
                <div className="modal-overlay" onClick={() => setShowDeleteConfirm(false)}></div>
                <div className="modal-content">
                  <h2>Delete Account</h2>
                  <p>
                    Are you sure you want to delete your account? This action cannot be undone.
                    All your data will be permanently deleted.
                  </p>
                  <div className="modal-actions">
                    <button
                      onClick={() => setShowDeleteConfirm(false)}
                      className="btn-secondary"
                      disabled={deleteLoading}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleDeleteAccount}
                      disabled={deleteLoading}
                      className="btn-danger"
                    >
                      {deleteLoading ? 'Deleting...' : 'Yes, Delete My Account'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};
