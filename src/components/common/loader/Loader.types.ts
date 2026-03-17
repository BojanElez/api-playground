export type TLoaderSize = 'small' | 'medium' | 'large';

export interface ILoaderProps {
  size?: TLoaderSize;
  color?: string;
  label?: string;
  inline?: boolean;
  showLabel?: boolean;
  className?: string;
}
