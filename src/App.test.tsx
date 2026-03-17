import { render, screen, waitFor } from '@testing-library/react';
import App from './App';
import { DEFAULT_THEME, THEME_STORAGE_KEY } from './theme/themes';

jest.mock('./pages/login/Login', () => () => <div>Login</div>);
jest.mock('./pages/apiPlayground/ApiPlayground', () => () => <div>ApiPlayground</div>);
jest.mock('./pages/notFound/NotFound', () => () => <div>NotFound</div>);
jest.mock('./components/protectedRoute/ProtectedRoute', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));
jest.mock('./components/errorBoundary/ErrorBoundary', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe('App', () => {
  beforeEach(() => {
    localStorage.clear();
    delete document.documentElement.dataset.theme;
  });

  afterEach(() => {
    localStorage.clear();
    delete document.documentElement.dataset.theme;
  });

  it('shows a configuration warning when OAuth client id is missing', () => {
    render(<App />);

    expect(
      screen.getByText('Missing OAuth configuration. Please set VITE_GOOGLE_CLIENT_ID.')
    ).toBeInTheDocument();
  });

  it('falls back to default theme when no theme is stored', async () => {
    render(<App />);

    await waitFor(() => {
      expect(document.documentElement.dataset.theme).toBe(DEFAULT_THEME);
    });

    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe(DEFAULT_THEME);
  });

  it('restores a valid saved theme from localStorage', async () => {
    localStorage.setItem(THEME_STORAGE_KEY, 'midnight');

    render(<App />);

    await waitFor(() => {
      expect(document.documentElement.dataset.theme).toBe('midnight');
    });

    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('midnight');
  });

  it('ignores an invalid saved theme and resets to default', async () => {
    localStorage.setItem(THEME_STORAGE_KEY, 'invalid-theme');

    render(<App />);

    await waitFor(() => {
      expect(document.documentElement.dataset.theme).toBe(DEFAULT_THEME);
    });

    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe(DEFAULT_THEME);
  });
});
