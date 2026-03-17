import './LoginForm.css';
import Input from '../../../components/common/input/Input';
import Button from '../../../components/common/button/Button';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { ILoginFormProps, ILoginForm } from './LoginForm.types';
import { fetchMockUsers, WRONG_CREDENTIALS_MESSAGE } from '../Login.utils';

const LoginForm = ({ onLoginSuccess, onLoginError }: ILoginFormProps) => {
  const [formValues, setFormValues] = useState<ILoginForm>({
    email: '',
    password: '',
  });

  const { data, isLoading, isError } = useQuery({
    queryKey: ['mock-users'],
    queryFn: fetchMockUsers,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  const validateForm = (): boolean => {
    return Boolean(formValues.email.trim() && formValues.password.trim());
  };

  const handleInputChange = (field: keyof ILoginForm, value: string): void => {
    setFormValues((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    if (!validateForm()) {
      onLoginError(WRONG_CREDENTIALS_MESSAGE);
      return;
    }

    if (isError || !data) {
      onLoginError(WRONG_CREDENTIALS_MESSAGE);
      return;
    }

    const matchedUser = data.users.find(
      (user) => user.email.toLowerCase() === formValues.email.trim().toLowerCase()
    );

    if (!matchedUser || matchedUser.password !== formValues.password) {
      onLoginError(WRONG_CREDENTIALS_MESSAGE);
      return;
    }

    onLoginSuccess({
      email: matchedUser.email,
      name: `${matchedUser.firstName} ${matchedUser.lastName}`,
      picture: '',
    });
  };

  return (
    <form className="login-form" data-testid="login-form" onSubmit={handleSubmit} noValidate>
      <div className="form-group">
        <Input
          id="email"
          placeholder="your@email.com"
          type="email"
          name="email"
          value={formValues.email}
          onChange={(event) => handleInputChange('email', event.target.value)}
          className="form-input"
          data-testid="email-input"
        />
      </div>

      <div className="form-group">
        <Input
          id="password"
          placeholder="Enter your password"
          type="password"
          name="password"
          value={formValues.password}
          onChange={(event) => handleInputChange('password', event.target.value)}
          className="form-input"
          data-testid="password-input"
        />
      </div>

      <Button
        text={isLoading ? 'Loading Users...' : 'Sign In'}
        type="submit"
        loading={isLoading}
        disabled={isLoading}
        className="form-submit"
        data-testid="sign-in-button"
      />
    </form>
  );
};

export default LoginForm;
