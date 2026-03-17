import './Header.css';
import { useNavigate } from 'react-router-dom';
import Dropdown from '../../components/common/dropdown/Dropdown';
import { themeOptions, type TThemeName } from '../../theme/themes';
import Button from '../../components/common/button/Button';
import { useAuthStore } from '../../store/authStore';
import type { IHeaderProps } from './Header.types';

const headerThemeOptions: Array<{ label: string; value: string }> = [...themeOptions];

const Header = ({ userName, userPicture, theme, onThemeChange }: IHeaderProps) => {
  const navigate = useNavigate();
  const { logout } = useAuthStore();

  const initials = (userName ?? '')
    .split(' ')
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('');

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <header className="header">
      <div className="container-xl">
        <div className="header-logo-wrap">
          <h1 className="logo">API Playground</h1>
        </div>

        <div className="header-actions">
          <div className="header-theme-picker">
            <Dropdown
              options={headerThemeOptions}
              value={theme}
              className="header-theme-dropdown"
              placeholder="Select theme"
              onChange={(value: string) => onThemeChange(value as TThemeName)}
            />
          </div>
          <div className="header-logout">
            <Button text="Logout" size="small" onClick={handleLogout}></Button>
          </div>

          <div className="header-profile" title={userName ?? 'Guest'}>
            {userPicture ? (
              <img className="profile-image" src={userPicture} alt={userName ?? 'User profile'} />
            ) : (
              <span className="profile-initials">{initials}</span>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
