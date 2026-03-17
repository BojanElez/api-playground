import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Textarea from './Textarea';

describe('Textarea', () => {
  describe('Rendering', () => {
    it('renders textarea with placeholder', () => {
      render(<Textarea placeholder="Enter body" />);
      expect(screen.getByPlaceholderText('Enter body')).toBeInTheDocument();
    });

    it('renders label when provided', () => {
      render(<Textarea label="Request Body" name="requestBody" />);
      expect(screen.getByText('Request Body')).toBeInTheDocument();
    });
  });

  describe('props', () => {
    it('sets required and aria-required when required', () => {
      render(<Textarea required />);
      const textarea = screen.getByRole('textbox');
      expect(textarea).toBeRequired();
      expect(textarea).toHaveAttribute('aria-required', 'true');
    });

    it('renders error text and invalid attributes when error is provided', () => {
      render(<Textarea id="body" error="Invalid JSON" />);
      const textarea = screen.getByRole('textbox');
      expect(screen.getByText('Invalid JSON')).toBeInTheDocument();
      expect(screen.getByRole('alert')).toBeInTheDocument();
      expect(textarea).toHaveAttribute('aria-invalid', 'true');
      expect(textarea).toHaveAttribute('aria-describedby', 'body-error');
    });

    it('applies custom className to wrapper', () => {
      const { container } = render(<Textarea className="custom-textarea" />);
      expect(container.querySelector('.textarea-wrapper')).toHaveClass('custom-textarea');
    });
  });

  describe('event handlers', () => {
    it('calls onChange when value changes', () => {
      const onChange = jest.fn();
      render(<Textarea onChange={onChange} />);
      fireEvent.change(screen.getByRole('textbox'), { target: { value: 'abc' } });
      expect(onChange).toHaveBeenCalledTimes(1);
    });

    it('calls onFocus and onBlur', () => {
      const onFocus = jest.fn();
      const onBlur = jest.fn();
      render(<Textarea onFocus={onFocus} onBlur={onBlur} />);

      fireEvent.focus(screen.getByRole('textbox'));
      fireEvent.blur(screen.getByRole('textbox'));

      expect(onFocus).toHaveBeenCalledTimes(1);
      expect(onBlur).toHaveBeenCalledTimes(1);
    });
  });
});
