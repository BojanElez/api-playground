import './App.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Suspense, lazy, useEffect, useState } from 'react';
import Login from './pages/login/Login';
import ApiPlayground from './pages/apiPlayground/ApiPlayground';
import NotFound from './pages/notFound/NotFound';
import ProtectedRoute from './components/protectedRoute/ProtectedRoute';
import ErrorBoundary from './components/errorBoundary/ErrorBoundary';
import { DEFAULT_THEME, isThemeName, THEME_STORAGE_KEY, type TThemeName } from './theme/themes';
import Loader from './components/common/loader/Loader';

const RequestDetails = lazy(() => import('./pages/requestDetail/RequestDetail'));
const googleClientId = import.meta.env?.VITE_GOOGLE_CLIENT_ID;

const App = () => {
  const [theme, setTheme] = useState<TThemeName>(() => {
    const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    return storedTheme && isThemeName(storedTheme) ? storedTheme : DEFAULT_THEME;
  });

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  if (!googleClientId) {
    return <div>Missing OAuth configuration. Please set VITE_GOOGLE_CLIENT_ID.</div>;
  }

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <ErrorBoundary>
        <Suspense fallback={<Loader size="large" showLabel={true} />}>
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/api-playground/requests/:requestId"
              element={
                <ProtectedRoute>
                  <RequestDetails theme={theme} onThemeChange={setTheme} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/api-playground"
              element={
                <ProtectedRoute>
                  <ApiPlayground theme={theme} onThemeChange={setTheme} />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </GoogleOAuthProvider>
  );
};

export default App;
