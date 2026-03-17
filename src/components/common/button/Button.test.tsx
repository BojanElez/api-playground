import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Button from './Button';
import type { IButtonProps } from './Button.types';

const defaultProps: IButtonProps = {
  text: 'Click me',
  variant: 'primary',
  size: 'medium',
  type: 'button',
  hasIcon: false,
  disabled: false,
  loading: false,
};

describe('Button', () => {
  describe('Rendering', () => {
    it('renders the button text', () => {
      render(<Button {...defaultProps} />);
      expect(screen.getByText('Click me')).toBeInTheDocument();
    });

    it('renders a <button> element', () => {
      render(<Button {...defaultProps} />);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('renders with default props without crashing', () => {
      render(<Button text="Default" />);
      expect(screen.getByText('Default')).toBeInTheDocument();
    });
  });

  describe('type prop', () => {
    it('sets type="button" by default', () => {
      render(<Button {...defaultProps} />);
      expect(screen.getByRole('button')).toHaveAttribute('type', 'button');
    });

    it('sets type="submit" when specified', () => {
      render(<Button {...defaultProps} type="submit" />);
      expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');
    });
  });

  describe('variant prop', () => {
    const variants = ['primary', 'secondary', 'success', 'danger'] as const;

    variants.forEach((variant) => {
      it(`applies btn--${variant} class for variant="${variant}"`, () => {
        render(<Button {...defaultProps} variant={variant} />);
        expect(screen.getByRole('button')).toHaveClass(`btn--${variant}`);
      });
    });
  });

  describe('size prop', () => {
    const sizes = ['small', 'medium', 'large'] as const;

    sizes.forEach((size) => {
      it(`applies btn--${size} class for size="${size}"`, () => {
        render(<Button {...defaultProps} size={size} />);
        expect(screen.getByRole('button')).toHaveClass(`btn--${size}`);
      });
    });
  });

  describe('hasIcon prop', () => {
    it('does not render icon container when hasIcon is false', () => {
      render(<Button {...defaultProps} hasIcon={false} />);
      expect(document.querySelector('.btn__icon')).not.toBeInTheDocument();
    });

    it('renders icon container when hasIcon is true', () => {
      render(<Button {...defaultProps} hasIcon={true} />);
      expect(document.querySelector('.btn__icon')).toBeInTheDocument();
    });

    it('renders a custom icon when provided', () => {
      const customIcon = <svg data-testid="custom-icon" />;
      render(<Button {...defaultProps} hasIcon={true} icon={customIcon} />);
      expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
    });
  });

  describe('disabled prop', () => {
    it('disables the button when disabled=true', () => {
      render(<Button {...defaultProps} disabled={true} />);
      expect(screen.getByRole('button')).toBeDisabled();
    });

    it('sets aria-disabled when disabled', () => {
      render(<Button {...defaultProps} disabled={true} />);
      expect(screen.getByRole('button')).toHaveAttribute('aria-disabled', 'true');
    });

    it('does not call onClick when disabled', () => {
      const onClick = jest.fn();
      render(<Button {...defaultProps} disabled={true} onClick={onClick} />);
      fireEvent.click(screen.getByRole('button'));
      expect(onClick).not.toHaveBeenCalled();
    });
  });

  describe('loading prop', () => {
    it('shows a spinner when loading=true', () => {
      render(<Button {...defaultProps} loading={true} />);
      expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    it('hides icon when loading=true', () => {
      render(<Button {...defaultProps} hasIcon={true} loading={true} />);
      expect(document.querySelector('.btn__icon')).not.toBeInTheDocument();
    });

    it('sets aria-busy when loading', () => {
      render(<Button {...defaultProps} loading={true} />);
      expect(screen.getByRole('button')).toHaveAttribute('aria-busy', 'true');
    });

    it('disables the button when loading=true', () => {
      render(<Button {...defaultProps} loading={true} />);
      expect(screen.getByRole('button')).toBeDisabled();
    });
  });

  describe('onClick interaction', () => {
    it('calls onClick when clicked', () => {
      const onClick = jest.fn();
      render(<Button {...defaultProps} onClick={onClick} />);
      fireEvent.click(screen.getByRole('button'));
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('passes the click event to onClick', () => {
      const onClick = jest.fn();
      render(<Button {...defaultProps} onClick={onClick} />);
      fireEvent.click(screen.getByRole('button'));
      expect(onClick).toHaveBeenCalledWith(expect.any(Object));
    });
  });

  describe('className prop', () => {
    it('appends custom className to the button', () => {
      render(<Button {...defaultProps} className="custom-class" />);
      expect(screen.getByRole('button')).toHaveClass('custom-class');
    });
  });
});
