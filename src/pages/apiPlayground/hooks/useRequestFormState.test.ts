import { act, renderHook } from '@testing-library/react';
import { useRequestFormState } from './useRequestFormState';
import { TIMEOUT_ERROR_VISIBLE_MS } from './useRequestForm.utils';

describe('useRequestFormState', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    act(() => {
      jest.runOnlyPendingTimers();
    });
    jest.useRealTimers();
  });

  it('clears timeout validation errors after 1500ms', () => {
    const { result } = renderHook(() => useRequestFormState());

    act(() => {
      result.current.handleTimeoutChange('1');
    });

    expect(result.current.timeoutError).toBe('Minimum timeout is 2s.');

    act(() => {
      jest.advanceTimersByTime(TIMEOUT_ERROR_VISIBLE_MS - 1);
    });

    expect(result.current.timeoutError).toBe('Minimum timeout is 2s.');

    act(() => {
      jest.advanceTimersByTime(1);
    });

    expect(result.current.timeoutError).toBeNull();
  });
});
