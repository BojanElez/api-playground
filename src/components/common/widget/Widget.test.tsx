import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Widget from './Widget';

describe('Widget', () => {
  describe('Rendering', () => {
    it('renders children content', () => {
      render(<Widget>Inner content</Widget>);
      expect(screen.getByText('Inner content')).toBeInTheDocument();
    });

    it('renders title when provided', () => {
      render(<Widget title="Request Form">Content</Widget>);
      expect(screen.getByText('Request Form')).toBeInTheDocument();
    });
  });

  describe('props', () => {
    it('applies full width by default', () => {
      const { container } = render(<Widget>Content</Widget>);
      expect(container.querySelector('.widget')).toHaveClass('widget--full');
    });

    it('applies half width class', () => {
      const { container } = render(<Widget width="half">Content</Widget>);
      expect(container.querySelector('.widget')).toHaveClass('widget--half');
    });

    it('renders empty message when isEmpty is true', () => {
      render(<Widget isEmpty emptyMessage="No data available" />);
      expect(screen.getByText('No data available')).toBeInTheDocument();
      expect(screen.getByRole('status')).toBeInTheDocument();
    });

    it('renders emptyContent instead of emptyMessage when provided', () => {
      render(<Widget isEmpty emptyMessage="No data" emptyContent={<div>Custom Empty</div>} />);
      expect(screen.getByText('Custom Empty')).toBeInTheDocument();
      expect(screen.queryByText('No data')).not.toBeInTheDocument();
    });

    it('applies custom widgetClass', () => {
      const { container } = render(<Widget widgetClass="custom-widget">Content</Widget>);
      expect(container.querySelector('.widget')).toHaveClass('custom-widget');
    });
  });

  describe('interaction', () => {
    it('calls onKeyDown from widget content', () => {
      const onKeyDown = jest.fn();
      const { container } = render(<Widget onKeyDown={onKeyDown}>Content</Widget>);
      const content = container.querySelector('.widget-content');

      expect(content).toBeInTheDocument();
      if (content) {
        fireEvent.keyDown(content, { key: 'Enter' });
      }

      expect(onKeyDown).toHaveBeenCalledTimes(1);
    });
  });
});
