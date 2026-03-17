import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import RequestDetail from './RequestDetail';
import { STORAGE_KEY } from '../apiPlayground/ApiPlayground.utils';
import { useAuthStore } from '../../store/authStore';

jest.mock('../../store/authStore', () => ({
  useAuthStore: jest.fn(),
}));

jest.mock('../../layout/header/Header', () => ({
  __esModule: true,
  default: ({ userName, theme }: { userName?: string; theme: string }) => (
    <div data-testid="header">{`${userName ?? 'Guest'}|${theme}`}</div>
  ),
}));

jest.mock('../../layout/footer/Footer', () => ({
  __esModule: true,
  default: ({ name }: { name: string }) => <div data-testid="footer">{name}</div>,
}));

jest.mock('../../layout/title/Title', () => ({
  __esModule: true,
  default: ({ title }: { title: string }) => <h1>{title}</h1>,
}));

jest.mock('../../components/common/widget/Widget', () => ({
  __esModule: true,
  default: ({
    title,
    isEmpty,
    emptyContent,
    children,
  }: {
    title?: string;
    isEmpty?: boolean;
    emptyContent?: React.ReactNode;
    children?: React.ReactNode;
  }) => (
    <section>
      {title && <h2>{title}</h2>}
      <div>{isEmpty ? emptyContent : children}</div>
    </section>
  ),
}));

jest.mock('../../components/common/button/Button', () => ({
  __esModule: true,
  default: ({ text }: { text: string }) => <button type="button">{text}</button>,
}));

jest.mock('../apiPlayground/components/badge/Badge', () => ({
  __esModule: true,
  default: ({ type, value }: { type: string; value: string }) => <span>{`${type}:${value}`}</span>,
}));

const mockedUseAuthStore = jest.mocked(useAuthStore);

const requestItem = {
  id: 'request-1',
  url: 'https://api.example.com/users/1',
  method: 'GET',
  body: '{"expand":true}',
  requestState: 'success',
  statusCode: 200,
  contentType: 'application/json',
  createdAt: '2026-03-17T09:30:00.000Z',
} as const;

const renderRequestDetail = (requestId = requestItem.id) => {
  return render(
    <MemoryRouter initialEntries={[`/api-playground/requests/${requestId}`]}>
      <Routes>
        <Route
          path="/api-playground/requests/:requestId"
          element={<RequestDetail theme="midnight" onThemeChange={jest.fn()} />}
        />
      </Routes>
    </MemoryRouter>
  );
};

describe('RequestDetail', () => {
  beforeEach(() => {
    localStorage.clear();
    mockedUseAuthStore.mockReturnValue({
      user: { name: 'Vanja Tester', picture: 'avatar.png' },
    } as ReturnType<typeof useAuthStore>);
  });

  afterEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  it('renders request details when the request exists', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([requestItem]));

    renderRequestDetail();

    expect(screen.getByTestId('header')).toHaveTextContent('Vanja Tester|midnight');
    expect(
      screen.getByRole('heading', { level: 1, name: 'Inspect request detail' })
    ).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: 'Request details' })).toBeInTheDocument();
    expect(screen.getByText('state:success')).toBeInTheDocument();
    expect(screen.getByText('method:GET')).toBeInTheDocument();
    expect(screen.getByText('Status Code: 200')).toBeInTheDocument();
    expect(screen.getByText('Content Type: application/json')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: 'URL' })).toBeInTheDocument();
    expect(screen.getByText('https://api.example.com/users/1')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: 'Body' })).toBeInTheDocument();
    expect(screen.getByText('{"expand":true}')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Back to request list' })).toHaveAttribute(
      'href',
      '/api-playground'
    );
    expect(screen.getByTestId('footer')).toHaveTextContent('Develop by RequestDetails');
  });
});
