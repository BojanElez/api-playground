import './Button.css';
import type { IButtonProps } from './Button.types';

const DEFAULT_ICON = (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path
      d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 
      10-4.48 10-10S17.52 2 12 2zm-1 
      14H9V8h2v8zm4 0h-2V8h2v8z"
    />
  </svg>
);

const Button = ({
  text,
  type = 'button',
  hasIcon = false,
  size = 'medium',
  variant = 'primary',
  disabled = false,
  loading = false,
  onClick,
  className = '',
  icon,
}: IButtonProps) => {
  const btnClasses = [
    'btn',
    `btn--${size}`,
    `btn--${variant}`,
    loading ? 'btn--loading' : '',
    disabled ? 'btn--disabled' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const resolvedIcon = icon ?? DEFAULT_ICON;

  return (
    <button
      type={type}
      className={btnClasses}
      disabled={disabled || loading}
      onClick={onClick}
      aria-busy={loading}
      aria-disabled={disabled || loading}
    >
      {loading ? (
        <span className="btn__spinner" role="progressbar" aria-label="Loading" />
      ) : (
        hasIcon && <span className="btn__icon">{resolvedIcon}</span>
      )}
      <span className="btn__text">{text}</span>
    </button>
  );
};

export default Button;
