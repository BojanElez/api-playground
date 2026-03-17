import { act, renderHook } from '@testing-library/react';
import { useNotification } from './useNotification';

describe('useNotification', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    act(() => {
      jest.runOnlyPendingTimers();
    });
    jest.useRealTimers();
  });

  it('starts with no notification', () => {
    const { result } = renderHook(() => useNotification());

    expect(result.current.notification).toBeNull();
  });

  it('shows and hides notification manually', () => {
    const { result } = renderHook(() => useNotification());

    act(() => {
      result.current.showNotification({ type: 'success', message: 'Saved.' });
    });

    expect(result.current.notification).toEqual({ type: 'success', message: 'Saved.' });

    act(() => {
      result.current.hideNotification();
    });

    expect(result.current.notification).toBeNull();
  });

  it('auto-hides notification after default timeout (4000ms)', () => {
    const { result } = renderHook(() => useNotification());

    act(() => {
      result.current.showNotification({ type: 'warning', message: 'Be careful.' });
    });

    expect(result.current.notification).toEqual({ type: 'warning', message: 'Be careful.' });

    act(() => {
      jest.advanceTimersByTime(3999);
    });

    expect(result.current.notification).toEqual({ type: 'warning', message: 'Be careful.' });

    act(() => {
      jest.advanceTimersByTime(1);
    });

    expect(result.current.notification).toBeNull();
  });

  it('uses custom timeout value when provided', () => {
    const { result } = renderHook(() => useNotification(1000));

    act(() => {
      result.current.showNotification({ type: 'error', message: 'Failed.' });
    });

    act(() => {
      jest.advanceTimersByTime(999);
    });

    expect(result.current.notification).toEqual({ type: 'error', message: 'Failed.' });

    act(() => {
      jest.advanceTimersByTime(1);
    });

    expect(result.current.notification).toBeNull();
  });
});
