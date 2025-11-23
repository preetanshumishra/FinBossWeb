import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import * as authStore from '../../stores/authStore';
import * as toastStore from '../../stores/toastStore';
import { authService } from '../../services/authService';

// Mock the services and stores BEFORE importing the component
jest.mock('../../services/authService');
jest.mock('../../services/transactionService');
jest.mock('../../services/api', () => ({
  default: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  },
}));

// Import after mocking
import { Settings } from '../Settings';

const mockUser = {
  userId: 'user1',
  email: 'test@example.com',
  firstName: 'John',
  lastName: 'Doe',
  createdAt: '2024-01-01T00:00:00Z',
};

const renderSettings = () => {
  return render(
    <Router>
      <Settings />
    </Router>
  );
};

describe('Settings Page', () => {
  beforeEach(() => {
    // Mock auth store
    jest.spyOn(authStore, 'useAuthStore').mockReturnValue({
      user: mockUser,
      accessToken: 'test-token',
      refreshToken: 'test-refresh',
      isLoading: false,
      error: null,
      login: jest.fn(),
      register: jest.fn(),
      logout: jest.fn(),
      setUser: jest.fn(),
      setTokens: jest.fn(),
      clearError: jest.fn(),
    } as any);

    // Mock toast store
    jest.spyOn(toastStore, 'useToastStore').mockReturnValue({
      messages: [],
      addToast: jest.fn(),
      removeToast: jest.fn(),
      clearAll: jest.fn(),
    } as any);

    // Mock auth service methods
    (authService.getPreferences as jest.Mock).mockResolvedValue({
      emailNotifications: true,
      budgetAlerts: true,
      weeklyReport: false,
    });

    (authService.savePreferences as jest.Mock).mockResolvedValue({
      emailNotifications: true,
      budgetAlerts: true,
      weeklyReport: false,
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Profile Section', () => {
    it('should render profile section with user information', () => {
      renderSettings();

      expect(screen.getByText('Profile Information')).toBeInTheDocument();
      // Should have inputs for firstName, lastName, email
      expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    });

    it('should populate profile fields with user data', () => {
      renderSettings();

      expect((screen.getByLabelText(/first name/i) as HTMLInputElement).value).toBe('John');
      expect((screen.getByLabelText(/last name/i) as HTMLInputElement).value).toBe('Doe');
      expect((screen.getByLabelText(/email address/i) as HTMLInputElement).value).toBe(
        'test@example.com'
      );
    });

    it('should update profile fields when user types', () => {
      renderSettings();

      const firstNameInput = screen.getByLabelText(/first name/i) as HTMLInputElement;
      fireEvent.change(firstNameInput, { target: { value: 'Jane' } });

      expect(firstNameInput.value).toBe('Jane');
    });

    it('should have a save button', () => {
      renderSettings();

      const saveButton = screen.getByRole('button', { name: /save changes/i });
      expect(saveButton).toBeInTheDocument();
      expect((saveButton as HTMLButtonElement).type).toBe('submit');
    });
  });

  describe('Password Section', () => {
    it('should render password change section', () => {
      renderSettings();

      expect(screen.getByText('Change Password')).toBeInTheDocument();
      expect(screen.getByLabelText(/current password/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/^new password/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/confirm new password/i)).toBeInTheDocument();
    });

    it('should accept password inputs', () => {
      renderSettings();

      const currentPasswordInput = screen.getByLabelText(/current password/i) as HTMLInputElement;
      const newPasswordInput = screen.getByLabelText(/^new password/i) as HTMLInputElement;
      const confirmPasswordInput = screen.getByLabelText(/confirm new password/i) as HTMLInputElement;

      fireEvent.change(currentPasswordInput, { target: { value: 'oldpassword123' } });
      fireEvent.change(newPasswordInput, { target: { value: 'newpassword123' } });
      fireEvent.change(confirmPasswordInput, { target: { value: 'newpassword123' } });

      expect(currentPasswordInput.value).toBe('oldpassword123');
      expect(newPasswordInput.value).toBe('newpassword123');
      expect(confirmPasswordInput.value).toBe('newpassword123');
    });
  });

  describe('Preferences Section', () => {
    it('should render preferences section with toggle switches', () => {
      renderSettings();

      expect(screen.getByText('Preferences')).toBeInTheDocument();
      expect(screen.getByText('Email Notifications')).toBeInTheDocument();
      expect(screen.getByText('Budget Alerts')).toBeInTheDocument();
      expect(screen.getByText('Weekly Report')).toBeInTheDocument();
    });

    it('should toggle preference switches', () => {
      renderSettings();

      const checkboxes = screen.getAllByRole('checkbox');
      const emailNotificationsCheckbox = checkboxes[0];

      expect((emailNotificationsCheckbox as HTMLInputElement).checked).toBe(true);

      fireEvent.click(emailNotificationsCheckbox);

      expect((emailNotificationsCheckbox as HTMLInputElement).checked).toBe(false);
    });

    it('should call savePreferences API when preference is changed', async () => {
      renderSettings();

      // Wait for initial load
      await waitFor(() => {
        expect(authService.getPreferences).toHaveBeenCalled();
      });

      const checkboxes = screen.getAllByRole('checkbox');
      fireEvent.click(checkboxes[0]);

      // Wait for the save API call
      await waitFor(() => {
        expect(authService.savePreferences).toHaveBeenCalledWith(
          expect.objectContaining({ emailNotifications: false })
        );
      });
    });
  });

  describe('Data & Privacy Section', () => {
    it('should render data export section', () => {
      renderSettings();

      expect(screen.getByText('Data & Privacy')).toBeInTheDocument();
      expect(screen.getByText('Export Your Data')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /export data/i })).toBeInTheDocument();
    });

    it('should have export button', () => {
      renderSettings();

      const exportButton = screen.getByRole('button', { name: /export data/i });
      expect(exportButton).toBeInTheDocument();
    });
  });

  describe('Account Management Section', () => {
    it('should render account management section', () => {
      renderSettings();

      const headings = screen.getAllByText('Delete Account');
      expect(headings.length).toBeGreaterThan(0);
      expect(screen.getByText('Account Management')).toBeInTheDocument();
    });

    it('should show delete account button', () => {
      renderSettings();

      const deleteButtons = screen.getAllByRole('button', { name: /delete account/i });
      const deleteButton = deleteButtons[0];
      expect(deleteButton).toBeInTheDocument();
      expect(deleteButton.className).toContain('btn-danger');
    });

    it('should show confirmation modal when delete button is clicked', () => {
      renderSettings();

      const deleteButtons = screen.getAllByRole('button', { name: /delete account/i });
      fireEvent.click(deleteButtons[0]);

      expect(screen.getByText(/are you sure you want to delete your account/i)).toBeInTheDocument();
    });

    it('should allow canceling account deletion', () => {
      renderSettings();

      const deleteButtons = screen.getAllByRole('button', { name: /delete account/i });
      fireEvent.click(deleteButtons[0]);

      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      fireEvent.click(cancelButton);

      expect(screen.queryByText(/are you sure you want to delete your account/i)).not.toBeInTheDocument();
    });
  });

  describe('Header', () => {
    it('should render settings page header', () => {
      renderSettings();

      expect(screen.getByText('Account Settings')).toBeInTheDocument();
      expect(screen.getByText('Manage your account, preferences, and privacy')).toBeInTheDocument();
    });
  });

  describe('Form Submission', () => {
    it('should handle profile form submission', async () => {
      const mockSetUser = jest.fn();
      const mockAddToast = jest.fn();

      jest.spyOn(authStore, 'useAuthStore').mockReturnValue({
        user: mockUser,
        accessToken: 'test-token',
        refreshToken: 'test-refresh',
        isLoading: false,
        error: null,
        login: jest.fn(),
        register: jest.fn(),
        logout: jest.fn(),
        setUser: mockSetUser,
        setTokens: jest.fn(),
        clearError: jest.fn(),
      } as any);

      jest.spyOn(toastStore, 'useToastStore').mockReturnValue({
        messages: [],
        addToast: mockAddToast,
        removeToast: jest.fn(),
        clearAll: jest.fn(),
      } as any);

      (authService.updateProfile as jest.Mock).mockResolvedValue(mockUser);

      renderSettings();

      const saveButton = screen.getByRole('button', { name: /save changes/i });
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(authService.updateProfile).toHaveBeenCalled();
      });
    });

    it('should handle errors during profile update', async () => {
      const mockAddToast = jest.fn();

      jest.spyOn(toastStore, 'useToastStore').mockReturnValue({
        messages: [],
        addToast: mockAddToast,
        removeToast: jest.fn(),
        clearAll: jest.fn(),
      } as any);

      (authService.updateProfile as jest.Mock).mockRejectedValue(
        new Error('Update failed')
      );

      renderSettings();

      const saveButton = screen.getByRole('button', { name: /save changes/i });
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(mockAddToast).toHaveBeenCalledWith({
          message: expect.stringContaining('Update failed'),
          type: 'error',
        });
      });
    });
  });
});
