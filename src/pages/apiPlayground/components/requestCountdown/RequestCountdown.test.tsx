import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import RequestCountdown from './RequestCountdown';

describe('RequestCountdown', () => {
  it('does not render when request is not submitting', () => {
    const { container } = render(<RequestCountdown isSubmitting={false} countdown={30} />);

    expect(container).toBeEmptyDOMElement();
  });

  it('does not render when countdown is null', () => {
    const { container } = render(<RequestCountdown isSubmitting={true} countdown={null} />);

    expect(container).toBeEmptyDOMElement();
  });

  it('renders countdown in minutes and zero-padded seconds', () => {
    render(<RequestCountdown isSubmitting={true} countdown={65} />);

    expect(screen.getByText('Timeout in: 1:05')).toBeInTheDocument();
  });

  it('renders seconds below ten with leading zero', () => {
    render(<RequestCountdown isSubmitting={true} countdown={9} />);

    expect(screen.getByText('Timeout in: 0:09')).toBeInTheDocument();
  });

  it('applies expected wrapper and text classes', () => {
    const { container } = render(<RequestCountdown isSubmitting={true} countdown={120} />);

    const wrapper = container.querySelector('.request-controls');
    const text = container.querySelector('.countdown');

    expect(wrapper).toBeInTheDocument();
    expect(text).toBeInTheDocument();
    expect(text).toHaveTextContent('Timeout in: 2:00');
  });
});
