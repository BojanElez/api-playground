import type { TThemeName } from '../../theme/themes';

export interface IHeaderProps {
  userName?: string;
  userPicture?: string;
  theme: TThemeName;
  onThemeChange: (theme: TThemeName) => void;
}
