import type { IRequestItem } from '../types';
import { useRequestExecution } from './useRequestExecution/useRequestExecution';
import { useRequestFormState } from './useRequestFormState';

type UseRequestFormParams = {
  onRequestSaved: (request: IRequestItem) => void;
};

export const useRequestForm = ({ onRequestSaved }: UseRequestFormParams) => {
  const {
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
  } = useRequestFormState();

  const { isSubmitting, countdown, addRequest, cancelRequest } = useRequestExecution({
    method,
    timeoutSeconds,
    onRequestSaved,
    parseInputUrl,
    getRequestBody,
    setRequestStage,
    setResponseData,
    clearUrlError,
  });

  return {
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
  };
};
