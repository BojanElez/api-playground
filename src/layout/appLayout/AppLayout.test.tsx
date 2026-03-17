import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import AppLayout from './AppLayout';

describe('AppLayout', () => {
  it('renders a main landmark', () => {
    render(
      <AppLayout>
        <div>Content</div>
      </AppLayout>
    );

    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('applies expected wrapper classes', () => {
    const { container } = render(
      <AppLayout>
        <div>Content</div>
      </AppLayout>
    );

    const main = container.querySelector('main');
    const innerContainer = container.querySelector('main > div');

    expect(main).toHaveClass('main-page');
    expect(innerContainer).toHaveClass('container');
  });

  it('renders child content inside the container', () => {
    render(
      <AppLayout>
        <p>Dashboard</p>
      </AppLayout>
    );

    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });

  it('renders multiple children in order', () => {
    render(
      <AppLayout>
        <span>First</span>
        <span>Second</span>
      </AppLayout>
    );

    const first = screen.getByText('First');
    const second = screen.getByText('Second');

    expect(first.compareDocumentPosition(second) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });
});
