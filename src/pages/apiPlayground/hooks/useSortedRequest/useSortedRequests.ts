import type { IRequestItem, TSortOption } from '../../types';

type SortRequestsParams = {
  items: IRequestItem[];
  sortBy: TSortOption;
};

export const sortRequests = ({ items, sortBy }: SortRequestsParams): IRequestItem[] => {
  return [...items].sort((a, b) => {
    switch (sortBy) {
      case 'failed':
        return a.requestState.localeCompare(b.requestState);
      case 'success':
        return b.requestState.localeCompare(a.requestState);
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'oldest':
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case 'method-asc':
        return a.method.localeCompare(b.method);
      default:
        return b.method.localeCompare(a.method);
    }
  });
};
