import { useId } from 'react';
import './Input.css';
import type { IInputProps } from './Input.types';

const Input = ({
  placeholder,
  type = 'text',
  size = 'large',
  value,
  id,
  name,
  disabled = false,
  error,
  required = false,
  className = '',
  onChange,
  onBlur,
  onFocus,
}: IInputProps) => {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  const inputClasses = [
    'input-wrapper',
    error ? 'input-wrapper--error' : '',
    disabled ? 'input-wrapper--disabled' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const fieldClasses = ['input-field', `input-field--${size}`].filter(Boolean).join(' ');

  return (
    <div className={inputClasses}>
      <>
        {name && (
          <label
            htmlFor={inputId}
            className={`input-label${required ? ' input-label--required' : ''}`}
          >
            {name.toUpperCase()}
          </label>
        )}
        <input
          id={inputId}
          name={name}
          type={type}
          placeholder={placeholder}
          value={value}
          disabled={disabled}
          required={required}
          aria-required={required}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : undefined}
          className={fieldClasses}
          onChange={onChange}
          onBlur={onBlur}
          onFocus={onFocus}
        />
      </>

      {error && (
        <span id={`${inputId}-error`} className="input-error-text" role="alert">
          {error}
        </span>
      )}
    </div>
  );
};

export default Input;
