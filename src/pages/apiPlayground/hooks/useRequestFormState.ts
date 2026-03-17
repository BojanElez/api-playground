import { useEffect, useState } from 'react';
import { PIPELINE_STAGE_IDLE, type THttpMethod, type TRequestStage } from '../types';
import {
  DEFAULT_TIMEOUT_SECONDS,
  MAX_TIMEOUT_SECONDS,
  MIN_TIMEOUT_SECONDS,
  TIMEOUT_ERROR_VISIBLE_MS,
} from './useRequestForm.utils';

export const useRequestFormState = () => {
  const [url, setUrl] = useState('');
  const [method, setMethod] = useState<THttpMethod>('GET');
  const [requestBody, setRequestBody] = useState('');
  const [urlError, setUrlError] = useState<string | null>(null);
  const [requestStage, setRequestStage] = useState<TRequestStage>(PIPELINE_STAGE_IDLE);
  const [responseData, setResponseData] = useState('No response yet.');
  const [timeoutSeconds, setTimeoutSeconds] = useState(DEFAULT_TIMEOUT_SECONDS);
  const [timeoutError, setTimeoutError] = useState<string | null>(null);

  useEffect(() => {
    if (!timeoutError) {
      return;
    }

    const timeoutId = setTimeout(() => {
      setTimeoutError(null);
    }, TIMEOUT_ERROR_VISIBLE_MS);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [timeoutError]);

  const resetRequestPipeline = () => {
    setRequestStage(PIPELINE_STAGE_IDLE);
  };

  const clearUrlError = () => {
    setUrlError(null);
  };

  const handleTimeoutChange = (value: string) => {
    const raw = value.trim();

    if (raw === '') {
      setTimeoutSeconds(DEFAULT_TIMEOUT_SECONDS);
      setTimeoutError(null);
      return;
    }

    const parsed = Number(raw);

    if (!Number.isFinite(parsed) || parsed <= 0) {
      setTimeoutError('Timeout must be a positive number.');
      return;
    }

    if (parsed < MIN_TIMEOUT_SECONDS) {
      setTimeoutError(`Minimum timeout is ${MIN_TIMEOUT_SECONDS}s.`);
      return;
    }

    if (parsed > MAX_TIMEOUT_SECONDS) {
      setTimeoutError(`Maximum timeout is ${MAX_TIMEOUT_SECONDS}s.`);
      return;
    }

    setTimeoutSeconds(parsed);
    setTimeoutError(null);
  };

  const handleUrlChange = (value: string) => {
    setUrl(value);
    setUrlError(null);
    resetRequestPipeline();
  };

  const handleMethodChange = (nextMethod: THttpMethod) => {
    setMethod(nextMethod);
    if (nextMethod !== 'POST' && nextMethod !== 'PUT' && nextMethod !== 'PATCH') {
      setRequestBody('');
    }
    resetRequestPipeline();
  };

  const handleRequestBodyChange = (value: string) => {
    setRequestBody(value);
    resetRequestPipeline();
  };

  const parseInputUrl = () => {
    const rawUrl = url.trim();
    if (!rawUrl) {
      setUrlError('URL is required.');
      return;
    }

    const parsedUrl: URL = new URL(rawUrl);

    return parsedUrl.href;
  };

  const getRequestBody = () => {
    return method === 'POST' || method === 'PUT' || method === 'PATCH' ? requestBody.trim() : '';
  };

  return {
    url,
    method,
    requestBody,
    urlError,
    requestStage,
    responseData,
    timeoutSeconds,
    timeoutError,
    setRequestStage,
    setResponseData,
    clearUrlError,
    handleUrlChange,
    handleMethodChange,
    handleRequestBodyChange,
    handleTimeoutChange,
    parseInputUrl,
    getRequestBody,
  };
};
