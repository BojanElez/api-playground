import { useId } from 'react';
import './Textarea.css';
import type { ITextareaProps } from './Textarea.types';

const Textarea = ({
  placeholder,
  value,
  label,
  id,
  name,
  required = false,
  error,
  rows = 4,
  className = '',
  onChange,
  onBlur,
  onFocus,
  onKeyDown,
}: ITextareaProps) => {
  const generatedId = useId();
  const textareaId = id ?? generatedId;

  const textareaClasses = ['textarea-wrapper', error ? 'textarea-wrapper--error' : '', className]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={textareaClasses}>
      {label && (
        <label
          htmlFor={textareaId}
          className={`textarea-label${required ? ' textarea-label--required' : ''}`}
        >
          {label}
        </label>
      )}
      <textarea
        id={textareaId}
        name={name}
        placeholder={placeholder}
        value={value}
        required={required}
        rows={rows}
        aria-required={required}
        aria-invalid={!!error}
        aria-describedby={error ? `${textareaId}-error` : undefined}
        className="textarea-field"
        onChange={onChange}
        onBlur={onBlur}
        onFocus={onFocus}
        onKeyDown={onKeyDown}
      />
      {error && (
        <span id={`${textareaId}-error`} className="textarea-error-text" role="alert">
          {error}
        </span>
      )}
    </div>
  );
};

export default Textarea;
