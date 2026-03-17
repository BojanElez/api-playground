import {
  AiOutlineCheckCircle,
  AiOutlineClose,
  AiOutlineCloseCircle,
  AiOutlineInfoCircle,
  AiOutlineWarning,
} from 'react-icons/ai';
import type { JSX } from 'react';
import './Notify.css';
import type { TNotifyType, INotifyProps } from './Notify.types';

const icons: Record<TNotifyType, JSX.Element> = {
  success: <AiOutlineCheckCircle className="notification-icon" />,
  info: <AiOutlineInfoCircle className="notification-icon" />,
  warning: <AiOutlineWarning className="notification-icon" />,
  error: <AiOutlineCloseCircle className="notification-icon" />,
};

const Notify = ({ type = 'info', message, onClose = () => {} }: INotifyProps) => {
  return (
    <div className="notification-wrap">
      <div className={`notification ${type}`}>
        {icons[type]}
        <span className="notification-message">{message}</span>
        <AiOutlineClose className="notification-close" onClick={onClose} />
      </div>
    </div>
  );
};

export default Notify;
