import type { IRequestItem, TSortOption } from '../../types';

export interface IRequestListProps {
  items: IRequestItem[];
  searchTerm: string;
  sortBy: TSortOption;
  currentPage: number;
  totalPages: number;
  onSearchChange: (value: string) => void;
  onSortChange: (value: TSortOption) => void;
  onPageChange: (page: number) => void;
  onDeleteRequest: (id: string) => void;
}
