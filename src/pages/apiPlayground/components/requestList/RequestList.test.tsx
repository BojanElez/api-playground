import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import RequestList from './RequestList';
import type { IRequestItem } from '../../types';
import type { IRequestListProps } from './RequestList.types';

jest.mock('../../../../components/common/input/Input', () => ({
  __esModule: true,
  default: ({
    value,
    onChange,
    placeholder,
  }: {
    value: string;
    onChange: (event: { target: { value: string } }) => void;
    placeholder?: string;
  }) => (
    <input
      aria-label="request-search"
      placeholder={placeholder}
      value={value}
      onChange={(event) => onChange({ target: { value: event.target.value } })}
    />
  ),
}));

jest.mock('../../../../components/common/dropdown/Dropdown', () => ({
  __esModule: true,
  default: ({ value, onChange }: { value: string; onChange: (value: string) => void }) => (
    <select aria-label="sort" value={value} onChange={(event) => onChange(event.target.value)}>
      <option value="newest">Newest first</option>
      <option value="oldest">Oldest first</option>
      <option value="failed">Failed first</option>
      <option value="success">Success first</option>
      <option value="method-asc">Method A-Z</option>
      <option value="method-desc">Method Z-A</option>
    </select>
  ),
}));

jest.mock('../../../../components/common/button/Button', () => ({
  __esModule: true,
  default: ({
    text,
    onClick,
    disabled,
    className,
  }: {
    text: string;
    onClick?: () => void;
    disabled?: boolean;
    className?: string;
  }) => (
    <button type="button" disabled={disabled} className={className} onClick={onClick}>
      {text}
    </button>
  ),
}));

jest.mock('../../../../components/modal/Modal', () => ({
  __esModule: true,
  default: ({
    isOpen,
    title,
    message,
    onConfirm,
    onCancel,
  }: {
    isOpen: boolean;
    title?: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
  }) => {
    if (!isOpen) {
      return null;
    }

    return (
      <div role="dialog">
        {title && <h4>{title}</h4>}
        <p>{message}</p>
        <button type="button" onClick={onConfirm}>
          Confirm delete
        </button>
        <button type="button" onClick={onCancel}>
          Cancel delete
        </button>
      </div>
    );
  },
}));

jest.mock('../badge/Badge', () => ({
  __esModule: true,
  default: ({ type, value }: { type: string; value: string }) => <span>{`${type}:${value}`}</span>,
}));

const items: IRequestItem[] = [
  {
    id: '1',
    url: 'https://api.example.com/users',
    method: 'GET',
    body: '',
    requestState: 'success',
    createdAt: '2026-03-01T10:00:00.000Z',
  },
  {
    id: '2',
    url: 'https://api.example.com/orders',
    method: 'POST',
    body: '{"status":"new"}',
    requestState: 'error',
    createdAt: '2026-03-02T12:00:00.000Z',
  },
];

const createProps = (overrides: Partial<IRequestListProps> = {}): IRequestListProps => ({
  items,
  searchTerm: '',
  sortBy: 'newest',
  currentPage: 1,
  totalPages: 3,
  onSearchChange: jest.fn(),
  onSortChange: jest.fn(),
  onPageChange: jest.fn(),
  onDeleteRequest: jest.fn(),
  ...overrides,
});

const renderRequestList = (props: IRequestListProps) => {
  return render(
    <MemoryRouter>
      <RequestList {...props} />
    </MemoryRouter>
  );
};

describe('RequestList', () => {
  it('renders request items and details links', () => {
    const props = createProps();
    renderRequestList(props);

    expect(screen.getByText('List of Requests')).toBeInTheDocument();
    expect(screen.getByText('https://api.example.com/users')).toBeInTheDocument();
    expect(screen.getByText('https://api.example.com/orders')).toBeInTheDocument();

    const links = screen.getAllByRole('link', { name: 'View details' });
    expect(links).toHaveLength(2);
    expect(links[0]).toHaveAttribute('href', '/api-playground/requests/1');
    expect(links[1]).toHaveAttribute('href', '/api-playground/requests/2');
  });

  it('calls search and sort callbacks when controls change', () => {
    const props = createProps();
    renderRequestList(props);

    fireEvent.change(screen.getByLabelText('request-search'), { target: { value: 'users' } });
    fireEvent.change(screen.getByLabelText('sort'), { target: { value: 'oldest' } });

    expect(props.onSearchChange).toHaveBeenCalledWith('users');
    expect(props.onSortChange).toHaveBeenCalledWith('oldest');
  });

  it('renders empty-state text and zeroed page indicator when there are no pages', () => {
    const props = createProps({ items: [], currentPage: 4, totalPages: 0 });
    renderRequestList(props);

    expect(screen.getByText('Page 0 of 0')).toBeInTheDocument();
    expect(screen.getByText('No requests to display.')).toBeInTheDocument();
    expect(screen.queryByText('Next')).not.toBeInTheDocument();
  });

  it('calls onPageChange for next, previous and page number buttons', () => {
    const props = createProps({ currentPage: 2, totalPages: 4 });
    renderRequestList(props);

    fireEvent.click(screen.getByRole('button', { name: 'Previous' }));
    fireEvent.click(screen.getByRole('button', { name: '3' }));
    fireEvent.click(screen.getByRole('button', { name: 'Next' }));

    expect(props.onPageChange).toHaveBeenCalledWith(1);
    expect(props.onPageChange).toHaveBeenCalledWith(3);
    expect(props.onPageChange).toHaveBeenCalledWith(3);
  });

  it('disables previous on first page and next on last page', () => {
    const firstPageProps = createProps({ currentPage: 1, totalPages: 3 });
    const { rerender } = render(
      <MemoryRouter>
        <RequestList {...firstPageProps} />
      </MemoryRouter>
    );

    expect(screen.getByRole('button', { name: 'Previous' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Next' })).not.toBeDisabled();

    const lastPageProps = createProps({ currentPage: 3, totalPages: 3 });
    rerender(
      <MemoryRouter>
        <RequestList {...lastPageProps} />
      </MemoryRouter>
    );

    expect(screen.getByRole('button', { name: 'Previous' })).not.toBeDisabled();
    expect(screen.getByRole('button', { name: 'Next' })).toBeDisabled();
  });

  it('opens delete modal and confirms deletion with selected request id', () => {
    const props = createProps();
    renderRequestList(props);

    fireEvent.click(screen.getAllByRole('button', { name: 'Delete' })[1]);
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Confirm delete' }));
    expect(props.onDeleteRequest).toHaveBeenCalledTimes(1);
    expect(props.onDeleteRequest).toHaveBeenCalledWith('2');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('closes delete modal on cancel without deleting', () => {
    const props = createProps();
    renderRequestList(props);

    fireEvent.click(screen.getAllByRole('button', { name: 'Delete' })[0]);
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Cancel delete' }));
    expect(props.onDeleteRequest).not.toHaveBeenCalled();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
