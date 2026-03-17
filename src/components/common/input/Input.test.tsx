import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Input from './Input';
import type { IInputProps } from './Input.types';

const defaultProps: IInputProps = {
  placeholder: 'Enter text...',
  type: 'text',
  size: 'large',
  name: '',
};

describe('Input', () => {
  describe('Rendering', () => {
    it('renders an input element', () => {
      render(<Input {...defaultProps} />);
      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('renders the placeholder text', () => {
      render(<Input {...defaultProps} placeholder="Type here..." />);
      expect(screen.getByPlaceholderText('Type here...')).toBeInTheDocument();
    });
  });

  describe('type prop', () => {
    it('defaults to type="text"', () => {
      render(<Input {...defaultProps} />);
      expect(screen.getByRole('textbox')).toHaveAttribute('type', 'text');
    });

    it('sets type="email"', () => {
      render(<Input {...defaultProps} type="email" />);
      expect(screen.getByRole('textbox')).toHaveAttribute('type', 'email');
    });

    it('sets type="search"', () => {
      render(<Input {...defaultProps} type="search" />);
      expect(screen.getByRole('searchbox')).toBeInTheDocument();
    });

    it('sets type="number"', () => {
      render(<Input {...defaultProps} type="number" />);
      expect(screen.getByRole('spinbutton')).toBeInTheDocument();
    });

    it('sets type="date"', () => {
      render(<Input {...defaultProps} type="date" />);
      expect(document.querySelector('input[type="date"]')).toBeInTheDocument();
    });
  });

  describe('size prop', () => {
    it('applies input-field--small class for size="small"', () => {
      render(<Input {...defaultProps} size="small" />);
      expect(document.querySelector('.input-field')).toHaveClass('input-field--small');
    });

    it('applies input-field--large class for size="large"', () => {
      render(<Input {...defaultProps} size="large" />);
      expect(document.querySelector('.input-field')).toHaveClass('input-field--large');
    });
  });

  describe('value prop', () => {
    it('renders with the provided value', () => {
      render(<Input {...defaultProps} value="Hello World" onChange={jest.fn()} />);
      expect(screen.getByRole('textbox')).toHaveValue('Hello World');
    });

    it('renders with a numeric value', () => {
      render(<Input {...defaultProps} type="number" value={42} onChange={jest.fn()} />);
      expect(screen.getByRole('spinbutton')).toHaveValue(42);
    });
  });

  describe('error prop', () => {
    it('renders the error message when error is provided', () => {
      render(<Input {...defaultProps} error="This field is required" />);
      expect(screen.getByText('This field is required')).toBeInTheDocument();
    });

    it('applies error wrapper class when error is provided', () => {
      render(<Input {...defaultProps} error="Invalid input" />);
      expect(document.querySelector('.input-wrapper')).toHaveClass('input-wrapper--error');
    });

    it('sets aria-invalid on the input when error is provided', () => {
      render(<Input {...defaultProps} error="Error!" />);
      expect(document.querySelector('.input-field')).toHaveAttribute('aria-invalid', 'true');
    });

    it('does not render error text when error is not provided', () => {
      render(<Input {...defaultProps} />);
      expect(document.querySelector('.input-error-text')).not.toBeInTheDocument();
    });

    it('error message has role="alert"', () => {
      render(<Input {...defaultProps} error="Something went wrong" />);
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });
  });

  describe('event handlers', () => {
    it('calls onChange when user types', () => {
      const onChange = jest.fn();
      render(<Input {...defaultProps} onChange={onChange} />);
      fireEvent.change(screen.getByRole('textbox'), { target: { value: 'abc' } });
      expect(onChange).toHaveBeenCalledTimes(1);
    });

    it('calls onFocus when input is focused', () => {
      const onFocus = jest.fn();
      render(<Input {...defaultProps} onFocus={onFocus} />);
      fireEvent.focus(screen.getByRole('textbox'));
      expect(onFocus).toHaveBeenCalledTimes(1);
    });

    it('calls onBlur when input loses focus', () => {
      const onBlur = jest.fn();
      render(<Input {...defaultProps} onBlur={onBlur} />);
      fireEvent.blur(screen.getByRole('textbox'));
      expect(onBlur).toHaveBeenCalledTimes(1);
    });
  });

  describe('required prop', () => {
    it('sets required attribute on input', () => {
      render(<Input {...defaultProps} required />);
      expect(document.querySelector('.input-field')).toBeRequired();
    });

    it('sets aria-required on input', () => {
      render(<Input {...defaultProps} required />);
      expect(document.querySelector('.input-field')).toHaveAttribute('aria-required', 'true');
    });
  });

  describe('className prop', () => {
    it('appends custom className to wrapper', () => {
      render(<Input {...defaultProps} className="custom-input" />);
      expect(document.querySelector('.input-wrapper')).toHaveClass('custom-input');
    });
  });
});
