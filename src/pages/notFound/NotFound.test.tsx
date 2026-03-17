import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import NotFound from './NotFound';

const renderNotFound = () => {
  return render(
    <MemoryRouter>
      <NotFound />
    </MemoryRouter>
  );
};

describe('NotFound', () => {
  it('renders the 404 message and supporting copy', () => {
    renderNotFound();

    expect(screen.getByRole('heading', { level: 1, name: '404' })).toBeInTheDocument();
    expect(
      screen.getByRole('heading', {
        level: 2,
        name: 'Page Not Found. Alert, you are looking for wrong hook',
      })
    ).toBeInTheDocument();
    expect(
      screen.getByText("The page you are looking for doesn't exist or has been moved.")
    ).toBeInTheDocument();
  });

  it('renders a link back to the login page', () => {
    renderNotFound();

    expect(screen.getByRole('link', { name: 'Go Back Home' })).toHaveAttribute('href', '/login');
  });

  it('applies the expected not-found wrapper classes', () => {
    const { container } = renderNotFound();

    expect(container.firstChild).toHaveClass('not-found');
    expect(container.firstChild).toHaveClass('container');
  });
});
