import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ApiPlayground from './ApiPlayground';
import { useAuthStore } from '../../store/authStore';
import { useRequestForm } from './hooks/useRequestForm';
import { useNotification } from '../../hooks/useNotification';
import { useRequestStats } from './hooks/useRequestStats';
import { PIPELINE_STAGE_ERROR, PIPELINE_STAGE_IDLE, PIPELINE_STAGE_SUCCESS } from './types';

jest.mock('../../store/authStore', () => ({
  useAuthStore: jest.fn(),
}));

jest.mock('./hooks/useRequestForm', () => ({
  useRequestForm: jest.fn(),
}));

jest.mock('../../hooks/useNotification', () => ({
  useNotification: jest.fn(),
}));

jest.mock('./hooks/useRequestStats', () => ({
  useRequestStats: jest.fn(),
}));

jest.mock('./ApiPlayground.utils', () => ({
  PAGE_SIZE: 5,
  STORAGE_KEY: 'apiPlayground.requests',
  getInitialRequests: jest.fn(() => []),
}));

jest.mock('../../layout/header/Header', () => ({
  __esModule: true,
  default: () => <div data-testid="header" />,
}));

jest.mock('../../layout/footer/Footer', () => ({
  __esModule: true,
  default: () => <div data-testid="footer" />,
}));

jest.mock('../../layout/title/Title', () => ({
  __esModule: true,
  default: ({ title }: { title: string }) => <h1>{title}</h1>,
}));

jest.mock('../../layout/appLayout/AppLayout', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <main>{children}</main>,
}));

jest.mock('../../components/common/widget/Widget', () => ({
  __esModule: true,
  default: ({ children, title }: { children: React.ReactNode; title?: string }) => (
    <section>
      {title && <h2>{title}</h2>}
      {children}
    </section>
  ),
}));

jest.mock('../../components/common/notify/Notify', () => ({
  __esModule: true,
  default: ({ message, onClose }: { message: string; onClose: () => void }) => (
    <div>
      <span>{message}</span>
      <button type="button" onClick={onClose}>
        Close notification
      </button>
    </div>
  ),
}));

jest.mock('./components/requestForm/RequestForm', () => ({
  __esModule: true,
  default: ({ cancelRequest }: { cancelRequest: () => void }) => (
    <button type="button" onClick={cancelRequest}>
      Cancel from form
    </button>
  ),
}));

jest.mock('./components/requestList/RequestList', () => ({
  __esModule: true,
  default: () => <div data-testid="request-list" />,
}));

jest.mock('./components/requestPipeline/RequestPipeline', () => ({
  __esModule: true,
  default: () => <div data-testid="request-pipeline" />,
}));

jest.mock('./components/requestCountdown/RequestCountdown', () => ({
  __esModule: true,
  default: () => <div data-testid="request-countdown" />,
}));

jest.mock('./components/requestPanel/RequestResponsePanel', () => ({
  __esModule: true,
  default: () => <div data-testid="response-panel" />,
}));

jest.mock('../../components/common/circularProgressBar/CircularProgressBar', () => ({
  __esModule: true,
  default: ({ centerText }: { centerText: string }) => <div>{centerText}</div>,
}));

const mockedUseAuthStore = jest.mocked(useAuthStore);
const mockedUseRequestForm = jest.mocked(useRequestForm);
const mockedUseNotification = jest.mocked(useNotification);
const mockedUseRequestStats = jest.mocked(useRequestStats);

const createRequestFormState = (overrides: Record<string, unknown> = {}) => ({
  url: '',
  method: 'GET',
  requestBody: '',
  urlError: undefined,
  requestStage: PIPELINE_STAGE_IDLE,
  responseData: 'No response yet.',
  isSubmitting: false,
  timeoutSeconds: 10,
  timeoutError: undefined,
  countdown: null,
  handleUrlChange: jest.fn(),
  handleMethodChange: jest.fn(),
  handleRequestBodyChange: jest.fn(),
  handleTimeoutChange: jest.fn(),
  addRequest: jest.fn(),
  cancelRequest: jest.fn(),
  ...overrides,
});

const setup = ({
  requestFormOverrides,
  notificationValue,
}: {
  requestFormOverrides?: Record<string, unknown>;
  notificationValue?: { type: 'success' | 'info' | 'warning' | 'error'; message: string } | null;
} = {}) => {
  const hideNotification = jest.fn();
  const showNotification = jest.fn();

  mockedUseAuthStore.mockReturnValue({
    user: { name: 'Vanja', picture: '' },
  } as ReturnType<typeof useAuthStore>);

  mockedUseRequestForm.mockReturnValue(
    createRequestFormState(requestFormOverrides) as unknown as ReturnType<typeof useRequestForm>
  );

  mockedUseNotification.mockReturnValue({
    notification: notificationValue ?? null,
    showNotification,
    hideNotification,
  });

  mockedUseRequestStats.mockReturnValue({
    totalRequests: 0,
    hasRequests: false,
    successPercentage: 0,
    failedPercentage: 0,
  });

  render(<ApiPlayground theme="midnight" onThemeChange={jest.fn()} />);

  return { showNotification, hideNotification };
};

describe('ApiPlayground', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it('shows success stage notification when request succeeds', () => {
    setup({
      requestFormOverrides: {
        requestStage: PIPELINE_STAGE_SUCCESS,
      },
    });

    expect(screen.getByText('Request completed successfully.')).toBeInTheDocument();
  });

  it('shows first error line for error stage notification', () => {
    setup({
      requestFormOverrides: {
        requestStage: PIPELINE_STAGE_ERROR,
        responseData: 'First line error\nSecond line details',
      },
    });

    expect(screen.getByText('First line error')).toBeInTheDocument();
  });

  it('prioritizes manual notification over stage notification', () => {
    setup({
      requestFormOverrides: {
        requestStage: PIPELINE_STAGE_SUCCESS,
      },
      notificationValue: { type: 'warning', message: 'Manual warning' },
    });

    expect(screen.getByText('Manual warning')).toBeInTheDocument();
    expect(screen.queryByText('Request completed successfully.')).not.toBeInTheDocument();
  });

  it('hides manual notification via hideNotification callback', () => {
    const { hideNotification } = setup({
      notificationValue: { type: 'warning', message: 'Manual warning' },
    });

    fireEvent.click(screen.getByRole('button', { name: 'Close notification' }));

    expect(hideNotification).toHaveBeenCalledTimes(1);
  });

  it('dismisses stage notification after close click', () => {
    setup({
      requestFormOverrides: {
        requestStage: PIPELINE_STAGE_SUCCESS,
      },
    });

    fireEvent.click(screen.getByRole('button', { name: 'Close notification' }));

    expect(screen.queryByText('Request completed successfully.')).not.toBeInTheDocument();
  });

  it('cancels in-flight request on Escape and shows warning notification', () => {
    const cancelRequest = jest.fn();
    const { showNotification } = setup({
      requestFormOverrides: {
        isSubmitting: true,
        cancelRequest,
      },
    });

    fireEvent.keyDown(document, { key: 'Escape' });

    expect(cancelRequest).toHaveBeenCalledTimes(1);
    expect(showNotification).toHaveBeenCalledWith({
      type: 'warning',
      message: 'Request cancelled.',
    });
  });
});
