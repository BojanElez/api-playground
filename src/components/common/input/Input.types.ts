export type TInputType = 'number' | 'text' | 'date' | 'email' | 'search' | 'password';

export type TInputSize = 'small' | 'large';

export interface IInputProps {
  placeholder: string;
  type: TInputType;
  size?: TInputSize;
  value?: string | number;
  label?: string;
  id?: string;
  name: string;
  disabled?: boolean;
  error?: string | null;
  required?: boolean;
  className?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
}
