import type { THttpMethod, IRequestItem, TRequestStage } from '../../types';

export interface IUseRequestExecutionParams {
  method: THttpMethod;
  timeoutSeconds: number;
  onRequestSaved: (request: IRequestItem) => void;
  parseInputUrl: () => string | undefined;
  getRequestBody: () => string;
  setRequestStage: (stage: TRequestStage) => void;
  setResponseData: (value: string) => void;
  clearUrlError: () => void;
}
