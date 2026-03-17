import type { THttpMethod, TRequestStage } from '../../types';

export interface IRequestFormProps {
  url: string;
  urlError?: string | null;
  method: THttpMethod;
  requestBody: string;
  isSubmitting?: boolean;
  timeoutSeconds: number;
  timeoutError?: string | null;
  cancelRequest?: () => void;
  requestStage?: TRequestStage;
  onUrlChange: (value: string) => void;
  onMethodChange: (method: THttpMethod) => void;
  onRequestBodyChange: (value: string) => void;
  onTimeoutChange: (value: string) => void;
  onAddRequest: () => void | Promise<void>;
}
