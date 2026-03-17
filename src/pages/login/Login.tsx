import { GoogleLogin } from '@react-oauth/google';
import { useAuthStore } from '../../store/authStore';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import type { IGoogleJwtPayload } from './Login.types';
import type { IAuthUser } from './../../types/types';
import Notify from '../../components/common/notify/Notify';
import LoginForm from './LoginForm/LoginForm';
import { useNotification } from '../../hooks/useNotification';
import './Login.css';

const Login = () => {
  const { login, isAuthenticated, checkAuthFromStorage } = useAuthStore();
  const navigate = useNavigate();
  const { notification: errorNotification, showNotification, hideNotification } = useNotification();

  useEffect(() => {
    checkAuthFromStorage();
    if (isAuthenticated) {
      navigate('/api-playground', { replace: true });
    }
  }, [isAuthenticated, navigate, checkAuthFromStorage]);

  const decode = (credential: string): IAuthUser => {
    const base64Url = credential.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(function (c: string): string {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );

    const decoded: IGoogleJwtPayload = JSON.parse(jsonPayload);
    const { email, name, picture } = decoded;

    return { email, name, picture };
  };

  const responseMessage = (response: { credential?: string }): void => {
    try {
      if (response.credential) {
        const user = decode(response.credential);

        login(user);

        navigate('/api-playground', { replace: true });
      }
    } catch (error) {
      console.error('Failed to decode JWT:', error);
      showNotification({ type: 'error', message: 'Failed to decode JWT:' });
    }
  };

  const errorMessage = () => {
    console.error('Login failed');
    showNotification({ type: 'error', message: 'Google login failed. Please try again.' });
  };

  const handleCredentialsLogin = (user: IAuthUser): void => {
    login(user);
    navigate('/api-playground', { replace: true });
  };

  const handleCredentialsError = (message: string): void => {
    showNotification({ type: 'error', message });
  };

  return (
    <div className="login-container" data-testid="login-container">
      {errorNotification && (
        <div className="login-notification-wrap">
          <Notify
            type={errorNotification.type}
            message={errorNotification.message}
            onClose={hideNotification}
          />
        </div>
      )}
      <div className="login-content">
        <div className="login-header">
          <h1 className="login-title">Welcome Back</h1>
        </div>

        <LoginForm onLoginSuccess={handleCredentialsLogin} onLoginError={handleCredentialsError} />

        <div className="divider">
          <span>or continue with</span>
        </div>

        <div className="google-login-wrapper" data-testid="google-login-wrapper">
          <GoogleLogin onSuccess={responseMessage} onError={errorMessage} />
        </div>
      </div>
    </div>
  );
};

export default Login;
