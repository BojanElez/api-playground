export interface ITextareaProps {
  placeholder?: string;
  value?: string;
  label?: string;
  id?: string;
  name?: string;
  required?: boolean;
  error?: string;
  rows?: number;
  className?: string;
  onChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLTextAreaElement>) => void;
  onFocus?: (event: React.FocusEvent<HTMLTextAreaElement>) => void;
  onKeyDown?: (event: React.KeyboardEvent<HTMLTextAreaElement>) => void;
}
