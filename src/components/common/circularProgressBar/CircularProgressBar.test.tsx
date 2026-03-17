import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import CircularProgressBar from './CircularProgressBar';

describe('CircularProgressBar', () => {
  beforeEach(() => {
    jest.spyOn(window, 'requestAnimationFrame').mockImplementation((cb: FrameRequestCallback) => {
      cb(0);
      return 1;
    });

    jest.spyOn(window, 'cancelAnimationFrame').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders rounded percentage text by default', () => {
    render(<CircularProgressBar value={42.6} />);

    expect(screen.getByText('43%')).toBeInTheDocument();
  });

  it('clamps value below 0 and above 100 for displayed text', () => {
    const { rerender } = render(<CircularProgressBar value={-10} />);
    expect(screen.getByText('0%')).toBeInTheDocument();

    rerender(<CircularProgressBar value={125} />);
    expect(screen.getByText('100%')).toBeInTheDocument();
  });

  it('renders label and custom center text when provided', () => {
    render(<CircularProgressBar value={50} label="Completion" centerText="Done" />);

    expect(screen.getByText('Done')).toBeInTheDocument();
    expect(screen.getByText('Completion')).toBeInTheDocument();
  });

  it('applies custom size and className to the wrapper', () => {
    const { container } = render(<CircularProgressBar value={40} size={180} className="extra" />);
    const wrapper = container.firstChild as HTMLElement;

    expect(wrapper).toHaveClass('circular-progress');
    expect(wrapper).toHaveClass('extra');
    expect(wrapper).toHaveStyle({ width: '180px', height: '180px' });
  });

  it('renders track and single indicator in non-segmented mode', () => {
    const { container } = render(
      <CircularProgressBar value={75} color="#00aa00" trackColor="#111111" strokeWidth={12} />
    );

    const track = container.querySelector('.circular-progress-track');
    const indicators = container.querySelectorAll('.circular-progress-indicator');

    expect(track).toHaveAttribute('stroke', '#111111');
    expect(track).toHaveAttribute('stroke-width', '12');
    expect(indicators).toHaveLength(1);
    expect(indicators[0]).toHaveAttribute('stroke', '#00aa00');
    expect(indicators[0]).toHaveAttribute('stroke-linecap', 'round');
  });

  it('renders only positive segments and their legend entries', () => {
    const { container } = render(
      <CircularProgressBar
        value={10}
        segments={[
          { label: 'Success', value: 30, color: '#00ff00' },
          { label: 'Skipped', value: 0, color: '#aaaaaa' },
          { label: 'Error', value: -10, color: '#ff0000' },
          { label: 'Pending', value: 20, color: '#ffff00' },
        ]}
      />
    );

    const indicators = container.querySelectorAll('.circular-progress-indicator');

    expect(indicators).toHaveLength(2);
    expect(screen.getByText('Success: 30%')).toBeInTheDocument();
    expect(screen.getByText('Pending: 20%')).toBeInTheDocument();
    expect(screen.queryByText('Skipped: 0%')).not.toBeInTheDocument();
    expect(screen.queryByText('Error: 0%')).not.toBeInTheDocument();
  });

  it('normalizes segments when total exceeds 100', () => {
    const { container } = render(
      <CircularProgressBar
        value={0}
        segments={[
          { label: 'A', value: 80, color: '#111111' },
          { label: 'B', value: 80, color: '#222222' },
        ]}
      />
    );

    expect(screen.getByText('A: 50%')).toBeInTheDocument();
    expect(screen.getByText('B: 50%')).toBeInTheDocument();

    const indicators = container.querySelectorAll('.circular-progress-indicator');
    expect(indicators[0]).toHaveAttribute('stroke-dasharray', '50 50');
    expect(indicators[1]).toHaveAttribute('stroke-dasharray', '50 50');
    expect(indicators[1]).toHaveAttribute('stroke-dashoffset', '-50');
  });
});
