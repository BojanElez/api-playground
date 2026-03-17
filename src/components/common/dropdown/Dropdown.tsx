import { useId, useRef, useState, useEffect } from 'react';
import './Dropdown.css';
import type { IDropdownProps } from './Dropdown.types';

const Dropdown = ({
  options,
  value,
  label,
  id,
  placeholder = 'Select…',
  disabled = false,
  error,
  className = '',
  onChange,
}: IDropdownProps) => {
  const generatedId = useId();
  const dropdownId = id ?? generatedId;
  const listboxId = `${dropdownId}-listbox`;
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  const close = () => {
    setIsOpen(false);
    setFocusedIndex(-1);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        close();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [close]);

  const toggle = () => {
    if (disabled) {
      return;
    }
    setIsOpen((prev) => !prev);
    if (!isOpen) {
      const idx = options.findIndex((opt) => opt.value === value);
      setFocusedIndex(idx >= 0 ? idx : 0);
    }
  };

  const select = (optionValue: string) => {
    onChange(optionValue);
    close();
  };

  const dropdownClasses = [
    'dropdown',
    isOpen ? 'dropdown--open' : '',
    disabled ? 'dropdown--disabled' : '',
    error ? 'dropdown--error' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={dropdownClasses} ref={containerRef}>
      {label && (
        <label htmlFor={dropdownId} className="dropdown__label">
          {label}
        </label>
      )}

      <button
        id={dropdownId}
        type="button"
        className="dropdown__trigger"
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-controls={listboxId}
        aria-activedescendant={
          isOpen && focusedIndex >= 0 ? `${dropdownId}-opt-${focusedIndex}` : undefined
        }
        aria-invalid={!!error}
        disabled={disabled}
        onClick={toggle}
      >
        <span className="dropdown__value">
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <span className="dropdown__arrow" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
            <path d="M7 10l5 5 5-5z" />
          </svg>
        </span>
      </button>

      {isOpen && (
        <ul
          id={listboxId}
          ref={listRef}
          className="dropdown__menu"
          role="listbox"
          aria-labelledby={dropdownId}
        >
          {options.map((option: any, index: number) => (
            <li
              key={option.value}
              id={`${dropdownId}-opt-${index}`}
              className={[
                'dropdown__option',
                option.value === value ? 'dropdown__option--selected' : '',
                index === focusedIndex ? 'dropdown__option--focused' : '',
              ]
                .filter(Boolean)
                .join(' ')}
              role="option"
              aria-selected={option.value === value}
              onMouseEnter={() => setFocusedIndex(index)}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => select(option.value)}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}

      {error && (
        <span className="dropdown__error" role="alert">
          {error}
        </span>
      )}
    </div>
  );
};

export default Dropdown;
