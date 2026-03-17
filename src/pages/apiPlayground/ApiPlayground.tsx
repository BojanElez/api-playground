import Title from '../../layout/title/Title';
import Footer from '../../layout/footer/Footer';
import Header from '../../layout/header/Header';
import Widget from '../../components/common/widget/Widget';
import Notify from '../../components/common/notify/Notify';
import AppLayout from '../../layout/appLayout/AppLayout';
import RequestForm from './components/requestForm/RequestForm';
import RequestList from './components/requestList/RequestList';
import RequestPipeline from './components/requestPipeline/RequestPipeline';
import RequestCountdown from './components/requestCountdown/RequestCountdown';
import RequestResponsePanel from './components/requestPanel/RequestResponsePanel';
import CircularProgressBar from '../../components/common/circularProgressBar/CircularProgressBar';
import { useAuthStore } from '../../store/authStore';
import { useRequestForm } from './hooks/useRequestForm';
import { useRequestStats } from './hooks/useRequestStats';
import { sortRequests } from './hooks/useSortedRequest/useSortedRequests';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  PIPELINE_STAGE_ERROR,
  PIPELINE_STAGE_SUCCESS,
  type IApiPlaygroundProps,
  type IRequestItem,
  type TSortOption,
} from './types';
import { getInitialRequests, STORAGE_KEY, PAGE_SIZE } from './ApiPlayground.utils';
import { useNotification, type IAppNotification } from '../../hooks/useNotification';

const ApiPlayground = ({ theme, onThemeChange }: IApiPlaygroundProps) => {
  const { user } = useAuthStore();

  const [requestSearch, setRequestSearch] = useState('');
  const [sortBy, setSortBy] = useState<TSortOption>('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [dismissedRequestNotificationKey, setDismissedRequestNotificationKey] = useState('');
  const [progressSize, setProgressSize] = useState(() => (window.innerWidth < 576 ? 300 : 396));
  const { notification, showNotification, hideNotification } = useNotification();

  const [requests, setRequests] = useState<IRequestItem[]>(() => getInitialRequests());

  const {
    url,
    method,
    requestBody,
    urlError,
    requestStage,
    responseData,
    isSubmitting,
    timeoutSeconds,
    timeoutError,
    countdown,
    handleUrlChange,
    handleMethodChange,
    handleRequestBodyChange,
    handleTimeoutChange,
    addRequest,
    cancelRequest,
  } = useRequestForm({
    onRequestSaved: (request) => setRequests((previous) => [request, ...previous]),
  });

  useEffect(() => {
    const updateProgressSize = () => {
      setProgressSize(window.innerWidth < 576 ? 300 : 396);
    };

    updateProgressSize();
    window.addEventListener('resize', updateProgressSize);

    return () => {
      window.removeEventListener('resize', updateProgressSize);
    };
  }, []);

  const requestNotification = useMemo<IAppNotification | null>(() => {
    if (requestStage === PIPELINE_STAGE_SUCCESS) {
      return { type: 'success', message: 'Request completed successfully.' };
    }

    if (requestStage === PIPELINE_STAGE_ERROR) {
      const stageErrorMessage = responseData.split('\n')[0]?.trim();
      return {
        type: 'error',
        message: stageErrorMessage || 'Request failed. Check response details.',
      };
    }

    return null;
  }, [requestStage, responseData]);

  const requestNotificationKey = useMemo(() => {
    if (!requestNotification) {
      return '';
    }

    return `${requestStage}:${responseData}`;
  }, [requestNotification, requestStage, responseData]);

  const activeNotification =
    notification ||
    (requestNotificationKey && requestNotificationKey !== dismissedRequestNotificationKey
      ? requestNotification
      : null);

  const handleCancelRequest = useCallback(() => {
    cancelRequest();
    showNotification({ type: 'warning', message: 'Request cancelled.' });
  }, [cancelRequest, showNotification]);

  useEffect(() => {
    if (!isSubmitting) {
      return;
    }

    const handleESC = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleCancelRequest();
      }
    };

    document.addEventListener('keydown', handleESC);

    return () => {
      document.removeEventListener('keydown', handleESC);
    };
  }, [handleCancelRequest, isSubmitting]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(requests));
  }, [requests]);

  const handleSearchChange = useCallback((value: string) => {
    setRequestSearch(value);
    setCurrentPage(1);
  }, []);

  const handleSortChange = useCallback((value: TSortOption) => {
    setSortBy(value);
    setCurrentPage(1);
  }, []);

  const handleDeleteRequest = useCallback(
    (requestId: string) => {
      setRequests((previous) => previous.filter((request) => request.id !== requestId));
      showNotification({ type: 'warning', message: 'Request deleted.' });
    },
    [showNotification]
  );

  const normalizedSearch = requestSearch.trim().toLowerCase();

  const filteredRequests = requests.filter((item) => {
    if (!normalizedSearch) {
      return true;
    }

    return (
      item.url?.toLowerCase().includes(normalizedSearch) ||
      item.method.toLowerCase().includes(normalizedSearch) ||
      item.requestState.toLowerCase().includes(normalizedSearch)
    );
  });

  const sortedRequests = sortRequests({
    items: filteredRequests,
    sortBy,
  });
  const stats = useRequestStats(requests);

  const totalPages = Math.ceil(sortedRequests.length / PAGE_SIZE);
  const currentPageInRange = totalPages > 0 ? Math.min(currentPage, totalPages) : 1;

  const paginatedRequests = (() => {
    if (totalPages === 0) {
      return [];
    }

    const start = (currentPageInRange - 1) * PAGE_SIZE;
    return sortedRequests.slice(start, start + PAGE_SIZE);
  })();

  const closeNotification = useCallback(() => {
    if (notification) {
      hideNotification();
      return;
    }

    if (requestNotificationKey) {
      setDismissedRequestNotificationKey(requestNotificationKey);
    }
  }, [hideNotification, notification, requestNotificationKey]);

  const isRequestWidgetEmpty = requests.length === 0;

  return (
    <>
      {activeNotification && (
        <div className="api-page-notification-wrap">
          <Notify
            type={activeNotification.type}
            message={activeNotification.message}
            onClose={closeNotification}
          />
        </div>
      )}
      <Header
        userName={user?.name}
        userPicture={user?.picture}
        theme={theme}
        onThemeChange={onThemeChange}
      />
      <AppLayout>
        <Title
          paragraph="Request Composer"
          title="Build, save, and inspect your API requests quickly"
          subtitle="Add URL tasks with method and optional body, then filter and browse your request history."
        />
        <Widget
          title="Request Form"
          emptyMessage="No request. Send at least one request to see outcome percentages"
        >
          <RequestForm
            url={url}
            urlError={urlError}
            method={method}
            requestBody={requestBody}
            isSubmitting={isSubmitting}
            timeoutSeconds={timeoutSeconds}
            timeoutError={timeoutError}
            cancelRequest={handleCancelRequest}
            requestStage={requestStage}
            onUrlChange={handleUrlChange}
            onMethodChange={handleMethodChange}
            onRequestBodyChange={handleRequestBodyChange}
            onTimeoutChange={handleTimeoutChange}
            onAddRequest={addRequest}
          />
          <RequestPipeline currentStage={requestStage} />
          <RequestCountdown isSubmitting={isSubmitting} countdown={countdown} />
          <RequestResponsePanel responseData={responseData} />
        </Widget>
        <Widget
          title="Request list"
          isEmpty={isRequestWidgetEmpty}
          emptyMessage="No request. Send at least one request to see outcome percentages."
        >
          <RequestList
            items={paginatedRequests}
            searchTerm={requestSearch}
            sortBy={sortBy}
            currentPage={currentPageInRange}
            totalPages={totalPages}
            onSearchChange={handleSearchChange}
            onSortChange={handleSortChange}
            onPageChange={setCurrentPage}
            onDeleteRequest={handleDeleteRequest}
          />
        </Widget>
        <Widget
          title="Request outcome stats"
          isEmpty={!stats.hasRequests}
          emptyMessage="No request stats yet. Send at least one request to see outcome percentages."
        >
          <div className="request-stats-widget" aria-label="Request outcomes">
            <CircularProgressBar
              value={stats.successPercentage}
              label="Success / Failed"
              centerText={`${stats.successPercentage}% / ${stats.failedPercentage}%`}
              segments={[
                { label: 'Success', value: stats.successPercentage, color: '#2a9449' },
                { label: 'Failed', value: stats.failedPercentage, color: '#c03f3f' },
              ]}
              strokeWidth={10}
              size={progressSize}
            />
          </div>
        </Widget>
      </AppLayout>
      <Footer name="Develop by Bojan Elez" />
    </>
  );
};

export default ApiPlayground;
