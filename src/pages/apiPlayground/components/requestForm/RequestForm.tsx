import { useMemo, useState, type FormEvent } from 'react';
import Button from '../../../../components/common/button/Button';
import Input from '../../../../components/common/input/Input';
import Textarea from '../../../../components/common/textarea/Textarea';
import Dropdown from '../../../../components/common/dropdown/Dropdown';
import './RequestForm.css';
import { PIPELINE_STAGE_SENDING, PIPELINE_STAGE_WAITING, type THttpMethod } from '../../types';
import type { IRequestFormProps } from './RequestForm.types';
import { httpMethodOptions } from '../../../../types/types';

const RequestForm = ({
  url,
  urlError,
  method,
  requestBody,
  isSubmitting = false,
  timeoutSeconds,
  timeoutError,
  cancelRequest,
  requestStage,
  onUrlChange,
  onMethodChange,
  onRequestBodyChange,
  onTimeoutChange,
  onAddRequest,
}: IRequestFormProps) => {
  const [localUrlError, setLocalUrlError] = useState('');
  const isFieldVisible = method === 'POST' || method === 'PUT' || method === 'PATCH';

  function getJsonError(value: string) {
    try {
      const parsedValue = JSON.parse(value) as unknown;

      if (
        parsedValue !== null &&
        typeof parsedValue === 'object' &&
        Object.keys(parsedValue as Record<string, unknown>).length === 0
      ) {
        return 'Request body cannot be empty.';
      }

      return '';
    } catch (error) {
      if (error instanceof Error) {
        return `Invalid JSON: ${error.message}`;
      } else {
        return 'Invalid JSON format';
      }
    }
  }

  const jsonError = useMemo(() => {
    if (!isFieldVisible || requestBody.trim() === '') {
      return '';
    }

    return getJsonError(requestBody);
  }, [isFieldVisible, requestBody]);

  const handleRequestBodyChange = (value: string) => {
    onRequestBodyChange(value);
  };

  const handleRequestBodyKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Tab') {
      event.preventDefault();
      const target = event.currentTarget;
      const start = target.selectionStart;
      const end = target.selectionEnd;
      const newValue = requestBody.substring(0, start) + '  ' + requestBody.substring(end);
      onRequestBodyChange(newValue);
      requestAnimationFrame(() => {
        target.selectionStart = start + 2;
        target.selectionEnd = start + 2;
      });
    }
  };

  const validateUrl = (value: string) => {
    const normalizedUrl = value.trim();

    if (!normalizedUrl) {
      setLocalUrlError('URL is required.');
      return false;
    }

    try {
      const parsedUrl = new URL(normalizedUrl);

      if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
        setLocalUrlError('URL must start with http:// or https://.');
        return false;
      }

      setLocalUrlError('');
      return true;
    } catch {
      setLocalUrlError('Please enter a valid URL.');
      return false;
    }
  };

  const handleUrlChange = (value: string) => {
    onUrlChange(value);

    if (localUrlError) {
      validateUrl(value);
    }
  };

  const isRequestBodyRequiredAndEmpty = isFieldVisible && requestBody.trim() === '';
  const hasInvalidRequestBody = isFieldVisible && requestBody.trim() !== '' && jsonError !== '';

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isRequestBodyRequiredAndEmpty || hasInvalidRequestBody) {
      return;
    }

    if (!validateUrl(url)) {
      return;
    }

    onAddRequest();
  };

  const isStageInProgress =
    requestStage === PIPELINE_STAGE_SENDING || requestStage === PIPELINE_STAGE_WAITING;

  return (
    <section className="request-form-panel">
      <div className="request-form-panel-header">
        <h3>Add URL Task</h3>
      </div>

      <form className="request-form" onSubmit={handleSubmit}>
        <div className="request-form-grid">
          <Input
            name="url"
            type="text"
            placeholder="https://api.example.com/v1/users"
            value={url}
            size="small"
            onChange={(event: { target: { value: string } }) => handleUrlChange(event.target.value)}
            error={localUrlError || urlError}
            disabled={isStageInProgress}
          />

          <Dropdown
            label="HTTP Method"
            options={httpMethodOptions}
            value={method}
            onChange={(val: string) => onMethodChange(val as THttpMethod)}
            disabled={isStageInProgress}
          />

          <div className="request-form-method-wrap">
            <Input
              name="timeout"
              type="number"
              placeholder="Timeout (seconds)"
              value={timeoutSeconds}
              size="small"
              onChange={(event: { target: { value: string } }) =>
                onTimeoutChange(event.target.value)
              }
              disabled={isStageInProgress}
              error={timeoutError}
            />
            {timeoutError && (
              <span className="input-error-text" role="alert">
                {timeoutError}
              </span>
            )}
          </div>
        </div>

        {isFieldVisible && (
          <>
            <Textarea
              name="requestBody"
              label="Request Body"
              placeholder={`{\n  "example": true\n}`}
              value={requestBody}
              rows={7}
              onChange={(event: { target: { value: string } }) =>
                handleRequestBodyChange(event.target.value)
              }
              onKeyDown={handleRequestBodyKeyDown}
              error={jsonError}
            />
            {jsonError && <p className="request-form-error-text">{jsonError}</p>}
          </>
        )}

        <p className="request-form-helper-text">
          Request body is enabled only for POST, PUT and PATCH methods.
        </p>
        <div className="button-wrapper">
          <Button
            text={isSubmitting ? 'Sending...' : 'Send Request'}
            type="submit"
            size="medium"
            disabled={
              localUrlError !== '' ||
              isSubmitting ||
              isRequestBodyRequiredAndEmpty ||
              hasInvalidRequestBody
            }
          />
          <Button
            text="Cancel Request"
            type="button"
            size="medium"
            variant="cancel"
            disabled={!isSubmitting}
            onClick={cancelRequest}
          />
        </div>
      </form>
    </section>
  );
};

export default RequestForm;
