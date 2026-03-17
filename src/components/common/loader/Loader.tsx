import React from 'react';
import './Loader.css';
import type { ILoaderProps } from './Loader.types';

const Loader = ({
  size = 'medium',
  color = '#1976d2',
  label = 'Loading',
  inline = false,
  showLabel = false,
  className = '',
}: ILoaderProps): React.ReactElement => {
  const loaderClasses = [
    'md-loader',
    `md-loader--${size}`,
    inline ? 'md-loader--inline' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      className={loaderClasses}
      style={{ '--md-loader-color': color } as React.CSSProperties}
      role="status"
      aria-live="polite"
      aria-label={label}
    >
      <svg className="md-loader__svg" viewBox="22 22 44 44" aria-hidden="true" focusable="false">
        <circle
          className="md-loader__circle"
          cx="44"
          cy="44"
          r="20.2"
          fill="none"
          strokeWidth="3.6"
        />
      </svg>
      {showLabel && <span className="md-loader__label">{label}</span>}
    </div>
  );
};

export default Loader;
