import type { KeyboardEventHandler, ReactNode } from 'react';
import './Widget.css';

interface WidgetProps {
  children?: ReactNode;
  width?: 'half' | 'full';
  title?: string;
  widgetClass?: string;
  isEmpty?: boolean;
  emptyMessage?: string;
  emptyContent?: ReactNode;
  onKeyDown?: KeyboardEventHandler;
}

const Widget = ({
  children,
  width = 'full',
  title,
  widgetClass = '',
  isEmpty = false,
  emptyMessage = 'No content available.',
  emptyContent,
  onKeyDown,
}: WidgetProps) => {
  return (
    <div className={`widget widget--${width} ${widgetClass}`}>
      {title && <div className="widget-title">{title}</div>}
      <div className="widget-content" onKeyDown={onKeyDown}>
        {isEmpty
          ? (emptyContent ?? (
              <div className="widget-empty" role="status" aria-live="polite">
                {emptyMessage}
              </div>
            ))
          : children}
      </div>
    </div>
  );
};

export default Widget;
