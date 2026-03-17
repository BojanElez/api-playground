import type { IAuthUser } from '../../../types/types';

export interface ILoginFormProps {
  onLoginSuccess: (user: IAuthUser) => void;
  onLoginError: (message: string) => void;
}

export interface ILoginForm {
  email: string;
  password: string;
}
