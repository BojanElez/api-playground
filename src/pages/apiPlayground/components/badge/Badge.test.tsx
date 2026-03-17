import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Badge from './Badge';

describe('Badge', () => {
  it('renders uppercase method value for known HTTP methods', () => {
    render(<Badge type="method" value="get" />);

    expect(screen.getByText('GET')).toBeInTheDocument();
  });

  it('keeps original value when method is unknown', () => {
    render(<Badge type="method" value="custom" />);

    expect(screen.getByText('custom')).toBeInTheDocument();
  });

  it('keeps original value for state badges', () => {
    render(<Badge type="state" value="Success" />);

    expect(screen.getByText('Success')).toBeInTheDocument();
  });

  it('applies base and type classes', () => {
    render(<Badge type="state" value="Success" />);

    const badge = screen.getByText('Success');
    expect(badge).toHaveClass('badge');
    expect(badge).toHaveClass('badge-state');
    expect(badge).toHaveClass('badge-state-success');
  });

  it('normalizes class suffix by trimming and lowercasing value', () => {
    render(<Badge type="method" value="  Post  " />);

    const badge = screen.getByText('Post');
    expect(badge).toHaveClass('badge-method-post');
  });

  it('builds classes with normalized value for unknown methods too', () => {
    render(<Badge type="method" value="  CuStOm-Verb  " />);

    const badge = screen.getByText('CuStOm-Verb');
    expect(badge).toHaveClass('badge');
    expect(badge).toHaveClass('badge-method');
    expect(badge).toHaveClass('badge-method-custom-verb');
  });
});
