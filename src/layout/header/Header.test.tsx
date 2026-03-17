import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Header from './Header';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));

jest.mock('../../store/authStore', () => ({
  useAuthStore: jest.fn(),
}));

jest.mock('../../components/common/dropdown/Dropdown', () => ({
  __esModule: true,
  default: ({ value, onChange }: { value: string; onChange: (value: string) => void }) => (
    <select aria-label="theme" value={value} onChange={(event) => onChange(event.target.value)}>
      <option value="modern">Modern</option>
      <option value="midnight">Midnight</option>
      <option value="tropical">Tropical</option>
    </select>
  ),
}));

jest.mock('../../components/common/button/Button', () => ({
  __esModule: true,
  default: ({ text, onClick }: { text: string; onClick?: () => void }) => (
    <button type="button" onClick={onClick}>
      {text}
    </button>
  ),
}));

const mockedUseNavigate = jest.mocked(useNavigate);
const mockedUseAuthStore = jest.mocked(useAuthStore);

const setup = (props: Partial<React.ComponentProps<typeof Header>> = {}) => {
  const navigate = jest.fn();
  const logout = jest.fn();
  const onThemeChange = jest.fn();

  mockedUseNavigate.mockReturnValue(navigate);
  mockedUseAuthStore.mockReturnValue({ logout } as ReturnType<typeof useAuthStore>);

  render(
    <Header
      userName="Vanja Elez"
      userPicture=""
      theme="modern"
      onThemeChange={onThemeChange}
      {...props}
    />
  );

  return { navigate, logout, onThemeChange };
};

describe('Header', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the application logo', () => {
    setup();

    expect(screen.getByRole('heading', { level: 1, name: 'API Playground' })).toBeInTheDocument();
  });

  it('renders user initials when no profile image is provided', () => {
    setup({ userPicture: undefined });

    expect(screen.getByText('VE')).toBeInTheDocument();
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  it('renders guest title when user name is missing', () => {
    setup({ userName: undefined, userPicture: undefined });

    expect(screen.getByTitle('Guest')).toBeInTheDocument();
  });

  it('renders profile image when provided', () => {
    setup({ userPicture: 'avatar.png' });

    expect(screen.getByRole('img', { name: 'Vanja Elez' })).toHaveAttribute('src', 'avatar.png');
  });

  it('calls onThemeChange with selected theme', () => {
    const { onThemeChange } = setup({ theme: 'modern' });

    fireEvent.change(screen.getByLabelText('theme'), { target: { value: 'midnight' } });

    expect(onThemeChange).toHaveBeenCalledWith('midnight');
  });

  it('logs out and navigates to login on logout click', () => {
    const { logout, navigate } = setup();

    fireEvent.click(screen.getByRole('button', { name: 'Logout' }));

    expect(logout).toHaveBeenCalledTimes(1);
    expect(navigate).toHaveBeenCalledWith('/login', { replace: true });
  });
});
