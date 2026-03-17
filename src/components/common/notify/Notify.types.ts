export type TNotifyType = 'success' | 'info' | 'warning' | 'error';

export interface INotifyProps {
  type?: TNotifyType;
  message: string;
  onClose?: () => void;
}
