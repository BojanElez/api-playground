import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Loader from './Loader';

describe('Loader', () => {
  describe('Rendering', () => {
    it('renders with status role and default label', () => {
      render(<Loader />);
      expect(screen.getByRole('status')).toBeInTheDocument();
      expect(screen.getByRole('status')).toHaveAttribute('aria-label', 'Loading');
    });

    it('does not render text label by default', () => {
      render(<Loader />);
      expect(screen.queryByText('Loading')).not.toBeInTheDocument();
    });

    it('renders text label when showLabel is true', () => {
      render(<Loader showLabel label="Please wait" />);
      expect(screen.getByText('Please wait')).toBeInTheDocument();
    });
  });

  describe('props', () => {
    it('applies medium size class by default', () => {
      render(<Loader />);
      expect(screen.getByRole('status')).toHaveClass('md-loader--medium');
    });

    it('applies provided size class', () => {
      render(<Loader size="large" />);
      expect(screen.getByRole('status')).toHaveClass('md-loader--large');
    });

    it('applies inline class when inline is true', () => {
      render(<Loader inline />);
      expect(screen.getByRole('status')).toHaveClass('md-loader--inline');
    });

    it('applies custom className', () => {
      render(<Loader className="custom-loader" />);
      expect(screen.getByRole('status')).toHaveClass('custom-loader');
    });

    it('applies custom CSS color variable', () => {
      render(<Loader color="#ff0000" />);
      expect(screen.getByRole('status')).toHaveStyle('--md-loader-color: #ff0000');
    });
  });
});
