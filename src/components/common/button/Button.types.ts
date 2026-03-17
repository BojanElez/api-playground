export type TButtonSize = 'small' | 'medium' | 'large';

export type TButtonVariant = 'primary' | 'secondary' | 'success' | 'danger' | 'cancel';

export type TButtonType = 'submit' | 'button';

export interface IButtonProps {
  text: string;
  type?: TButtonType;
  hasIcon?: boolean;
  size?: TButtonSize;
  variant?: TButtonVariant;
  disabled?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  icon?: React.ReactNode;
  loading?: boolean;
}
