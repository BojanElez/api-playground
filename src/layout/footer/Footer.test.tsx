import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Footer from './Footer';

describe('Footer', () => {
  it('renders provided name', () => {
    render(<Footer name="Develop by Bojan Elez" />);

    expect(screen.getByText('Develop by Bojan Elez')).toBeInTheDocument();
  });

  it('renders the current date', () => {
    render(<Footer name="Footer Name" />);

    const expectedDate = new Date().toLocaleDateString();
    expect(screen.getByText(expectedDate)).toBeInTheDocument();
  });
});
