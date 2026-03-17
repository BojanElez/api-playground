import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Modal from './Modal';

describe('Modal', () => {
  it('does not render when closed', () => {
    render(
      <Modal
        isOpen={false}
        message="Delete this item?"
        onConfirm={jest.fn()}
        onCancel={jest.fn()}
      />
    );

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renders title and message when open', () => {
    render(
      <Modal
        isOpen={true}
        title="Delete"
        message="Delete this item?"
        onConfirm={jest.fn()}
        onCancel={jest.fn()}
      />
    );

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Delete')).toBeInTheDocument();
    expect(screen.getByText('Delete this item?')).toBeInTheDocument();
  });

  it('calls onCancel when cancel button is clicked', () => {
    const onCancel = jest.fn();

    render(
      <Modal isOpen={true} message="Delete this item?" onConfirm={jest.fn()} onCancel={onCancel} />
    );

    fireEvent.click(screen.getByRole('button', { name: 'No' }));

    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('calls onConfirm when confirm button is clicked', () => {
    const onConfirm = jest.fn();

    render(
      <Modal isOpen={true} message="Delete this item?" onConfirm={onConfirm} onCancel={jest.fn()} />
    );

    fireEvent.click(screen.getByRole('button', { name: 'Yes' }));

    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it('calls onCancel when escape key is pressed', () => {
    const onCancel = jest.fn();

    render(
      <Modal isOpen={true} message="Delete this item?" onConfirm={jest.fn()} onCancel={onCancel} />
    );

    fireEvent.keyDown(document, { key: 'Escape' });

    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('calls onCancel when backdrop is clicked', () => {
    const onCancel = jest.fn();

    render(
      <Modal isOpen={true} message="Delete this item?" onConfirm={jest.fn()} onCancel={onCancel} />
    );

    const backdrop = document.querySelector('.modal-backdrop');
    expect(backdrop).toBeInTheDocument();
    if (!backdrop) {
      return;
    }

    fireEvent.click(backdrop);

    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('does not close when modal card is clicked', () => {
    const onCancel = jest.fn();

    render(
      <Modal isOpen={true} message="Delete this item?" onConfirm={jest.fn()} onCancel={onCancel} />
    );

    fireEvent.click(screen.getByRole('dialog'));

    expect(onCancel).not.toHaveBeenCalled();
  });
});
