import type { IRequestItem } from './types';

export const STORAGE_KEY = 'apiPlayground.requests';
export const PAGE_SIZE = 5;

export const getInitialRequests = (): IRequestItem[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw) as IRequestItem[];
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed;
  } catch {
    return [];
  }
};

export const createRequestId = (): string => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.floor(Math.random() * 100000)}`;
};
