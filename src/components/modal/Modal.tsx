import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import Button from '../common/button/Button';
import './Modal.css';
import type { IModalProps } from './Modal.types';

const Modal = ({ isOpen, title = 'Confirm action', message, onConfirm, onCancel }: IModalProps) => {
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleModal = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onCancel();
      }
    };

    document.addEventListener('keydown', handleModal);
    return () => document.removeEventListener('keydown', handleModal);
  }, [isOpen, onCancel]);

  if (!isOpen) {
    return null;
  }

  return createPortal(
    <div className="modal-backdrop" role="presentation" onClick={onCancel}>
      <div
        className="modal-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-modal-title"
        aria-describedby="confirm-modal-message"
        onClick={(event) => event.stopPropagation()}
      >
        <h3 id="confirm-modal-title" className="modal-title">
          {title}
        </h3>
        <p id="confirm-modal-message" className="modal-message">
          {message}
        </p>
        <div className="modal-actions">
          <Button type="button" text="No" variant="secondary" onClick={onCancel} />
          <Button type="button" text="Yes" variant="danger" onClick={onConfirm} />
        </div>
      </div>
    </div>,
    document.body
  );
};

export default Modal;
