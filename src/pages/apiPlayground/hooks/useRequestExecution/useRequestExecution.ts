import { useCallback, useEffect, useRef, useState } from 'react';
import {
  PIPELINE_STAGE_ERROR,
  PIPELINE_STAGE_IDLE,
  PIPELINE_STAGE_SENDING,
  PIPELINE_STAGE_SUCCESS,
  PIPELINE_STAGE_WAITING,
  type IRequestItem,
} from '../../types';
import { createRequestId } from '../../ApiPlayground.utils';
import { EMPTY_RESPONSE_TEXT } from '../useRequestForm.utils';
import type { IUseRequestExecutionParams } from './useRequestExecution.types';

export const useRequestExecution = ({
  method,
  timeoutSeconds,
  onRequestSaved,
  parseInputUrl,
  getRequestBody,
  setRequestStage,
  setResponseData,
  clearUrlError,
}: IUseRequestExecutionParams) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const controllerRef = useRef<AbortController | null>(null);
  const cancelledRef = useRef(false);

  const clearCountdown = useCallback(() => {
    if (countdownRef.current !== null) {
      clearInterval(countdownRef.current);
      countdownRef.current = null;
    }
    setCountdown(null);
  }, []);

  useEffect(() => {
    return () => {
      cancelledRef.current = true;
      controllerRef.current?.abort();
      controllerRef.current = null;
      clearCountdown();
    };
  }, [clearCountdown]);

  const cancelRequest = useCallback(() => {
    if (controllerRef.current) {
      cancelledRef.current = true;
      controllerRef.current.abort();
      controllerRef.current = null;
    }
    clearCountdown();
    setIsSubmitting(false);
    setRequestStage(PIPELINE_STAGE_IDLE);
    setResponseData('Request cancelled.');
  }, [clearCountdown, setRequestStage, setResponseData]);

  const startCountdown = (seconds: number) => {
    clearCountdown();
    setCountdown(seconds);

    countdownRef.current = setInterval(() => {
      setCountdown((previous) => {
        if (previous === null || previous <= 1) {
          clearCountdown();
          return 0;
        }

        return previous - 1;
      });
    }, 1000);
  };

  const handleStatusCode = (response: Response) => {
    if (response.status >= 400 && response.status < 500) {
      throw new Error(
        `Invalid request: 4xx client error (${response.status} ${response.statusText})`
      );
    }

    if (response.status >= 500 && response.status < 600) {
      throw new Error(
        `Invalid request: 5xx server error (${response.status} ${response.statusText})`
      );
    }

    if (!response.ok) {
      throw new Error(`Invalid request: HTTP ${response.status} ${response.statusText}`);
    }
  };

  const formatResponseBody = async (response: Response) => {
    if (response.status === 204 || response.status === 205) {
      return EMPTY_RESPONSE_TEXT;
    }

    const rawBody = await response.text();
    if (!rawBody.trim()) {
      return EMPTY_RESPONSE_TEXT;
    }

    const contentType = response.headers.get('content-type')?.toLowerCase() ?? '';
    const isJsonResponse =
      contentType.includes('application/json') || contentType.includes('+json');

    if (!isJsonResponse) {
      return rawBody;
    }

    try {
      return JSON.stringify(JSON.parse(rawBody), null, 2);
    } catch {
      return rawBody;
    }
  };

  const handleRequestError = (error: unknown, requestUrl?: string) => {
    const hostMessage = requestUrl ? ` (target host: ${new URL(requestUrl).host})` : '';

    if (error instanceof Error && error.name === 'AbortError') {
      if (cancelledRef.current) {
        return;
      }
      setResponseData(`Request timed out after ${timeoutSeconds} seconds.`);
    } else if (error instanceof TypeError) {
      setResponseData(
        `Request blocked by browser/client${hostMessage}. This is typically CORS, an extension/ad blocker, mixed-content policy, or DNS/network resolution issue.`
      );
    } else if (error instanceof Error) {
      setResponseData(error.message);
    } else {
      setResponseData('Something went wrong.');
    }

    setRequestStage(PIPELINE_STAGE_ERROR);
  };

  const buildRequestInit = (signal: AbortSignal, bodyToStore: string): RequestInit => {
    const requestInit: RequestInit = {
      method,
      signal,
      headers: {
        Accept: '*/*',
      },
    };

    if (bodyToStore && method !== 'GET' && method !== 'DELETE') {
      requestInit.headers = {
        ...requestInit.headers,
        'Content-Type': 'application/json',
      };
      requestInit.body = bodyToStore;
    }

    return requestInit;
  };

  const buildSuccessResponse = (response: Response, durationMs: number, formattedBody: string) => {
    return [
      `Status: ${response.status} ${response.statusText}`,
      `Completed in ${durationMs}ms`,
      '',
      'Response Body:',
      formattedBody,
    ].join('\n');
  };

  const saveRequest = (
    parsedUrl: string | undefined,
    bodyToStore: string,
    requestState: string,
    response?: Response
  ) => {
    if (!parsedUrl?.trim()) {
      return;
    }

    const request: IRequestItem = {
      id: createRequestId(),
      url: parsedUrl,
      method,
      body: bodyToStore,
      statusCode: response?.status ?? null,
      contentType: response?.headers.get('content-type') ?? null,
      createdAt: new Date().toISOString(),
      requestState,
    };

    onRequestSaved(request);
  };

  const finalizeRequest = (timeoutId: ReturnType<typeof setTimeout>) => {
    clearTimeout(timeoutId);
    controllerRef.current = null;
    clearCountdown();
    setIsSubmitting(false);
  };

  const executeRequest = async (
    parsedUrl: string,
    bodyToStore: string,
    controller: AbortController
  ) => {
    setRequestStage(PIPELINE_STAGE_WAITING);
    startCountdown(timeoutSeconds);

    const startedAt = performance.now();
    const response = await fetch(parsedUrl, buildRequestInit(controller.signal, bodyToStore));
    const durationMs = Math.round(performance.now() - startedAt);

    handleStatusCode(response);
    const formattedBody = await formatResponseBody(response);

    setResponseData(buildSuccessResponse(response, durationMs, formattedBody));
    setRequestStage(PIPELINE_STAGE_SUCCESS);
    saveRequest(parsedUrl, bodyToStore, PIPELINE_STAGE_SUCCESS, response);
  };

  const updateStateInRequest = () => {
    clearUrlError();
    setIsSubmitting(true);
    setResponseData('Sending request...');
    setRequestStage(PIPELINE_STAGE_SENDING);
  };

  const addRequest = async () => {
    updateStateInRequest();
    await new Promise((resolve) => setTimeout(resolve, 200));

    cancelledRef.current = false;
    const controller = new AbortController();
    controllerRef.current = controller;
    const timeoutMs = timeoutSeconds * 1000;
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
    let parsedUrl: string | undefined;
    const bodyToStore = getRequestBody();

    try {
      parsedUrl = parseInputUrl();
      if (!parsedUrl) {
        setIsSubmitting(false);
        return;
      }

      await executeRequest(parsedUrl, bodyToStore, controller);
    } catch (error) {
      console.error('Request execution error:', error);
      saveRequest(parsedUrl, bodyToStore, 'failed');
      handleRequestError(error, parsedUrl);
    } finally {
      finalizeRequest(timeoutId);
    }
  };

  return {
    isSubmitting,
    countdown,
    addRequest,
    cancelRequest,
  };
};
