import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Notify from './Notify';

describe('Notify', () => {
  describe('Rendering', () => {
    it('renders provided message', () => {
      render(<Notify message="Saved successfully" />);
      expect(screen.getByText('Saved successfully')).toBeInTheDocument();
    });

    it('uses info type by default', () => {
      const { container } = render(<Notify message="Info message" />);
      expect(container.querySelector('.notification')).toHaveClass('info');
    });

    it('applies provided type class', () => {
      const { container } = render(<Notify message="Error message" type="error" />);
      expect(container.querySelector('.notification')).toHaveClass('error');
    });
  });

  describe('interaction', () => {
    it('calls onClose when close icon is clicked', () => {
      const onClose = jest.fn();
      const { container } = render(<Notify message="Closable" onClose={onClose} />);

      const closeButton = container.querySelector('.notification-close');
      expect(closeButton).toBeInTheDocument();

      if (closeButton) {
        fireEvent.click(closeButton);
      }

      expect(onClose).toHaveBeenCalledTimes(1);
    });
  });
});
