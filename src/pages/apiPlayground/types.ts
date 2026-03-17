import type { TThemeName } from '../../theme/themes';

export type THttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export const PIPELINE_STAGE_IDLE = 'idle';
export const PIPELINE_STAGE_SENDING = 'sending';
export const PIPELINE_STAGE_WAITING = 'waiting';
export const PIPELINE_STAGE_SUCCESS = 'success';
export const PIPELINE_STAGE_ERROR = 'error';

export const PIPELINE_STAGES = [
  PIPELINE_STAGE_IDLE,
  PIPELINE_STAGE_SENDING,
  PIPELINE_STAGE_WAITING,
  PIPELINE_STAGE_SUCCESS,
  PIPELINE_STAGE_ERROR,
] as const;

export type TRequestStage = (typeof PIPELINE_STAGES)[number];

export type TSortOption = 'failed' | 'success' | 'newest' | 'oldest' | 'method-asc' | 'method-desc';

export interface IRequestItem {
  id: string;
  url: string | undefined;
  method: THttpMethod;
  body: string;
  requestState: string;
  statusCode?: number | null;
  contentType?: string | null;
  createdAt: string;
}

export interface INotificationState {
  type: 'success' | 'warning' | 'error';
  message: string;
}

export interface IApiPlaygroundProps {
  theme: TThemeName;
  onThemeChange: (theme: TThemeName) => void;
}
