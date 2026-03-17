import { sortRequests } from './useSortedRequests';
import type { IRequestItem, TSortOption } from '../../types';

const items: IRequestItem[] = [
  {
    id: '1',
    url: 'https://api.example.com/zeta',
    method: 'POST',
    body: '{}',
    requestState: 'failed',
    createdAt: '2026-03-10T10:00:00.000Z',
  },
  {
    id: '2',
    url: 'https://api.example.com/alpha',
    method: 'GET',
    body: '',
    requestState: 'error',
    createdAt: '2026-03-11T10:00:00.000Z',
  },
  {
    id: '3',
    url: 'https://api.example.com/omega',
    method: 'PUT',
    body: '{"x":1}',
    requestState: 'success',
    createdAt: '2026-03-12T10:00:00.000Z',
  },
];

const getIds = (sortBy: TSortOption) => sortRequests({ items, sortBy }).map((item) => item.id);

describe('sortRequests', () => {
  it('sorts by failed option (requestState ascending)', () => {
    expect(getIds('failed')).toEqual(['2', '1', '3']);
  });

  it('sorts by success option (requestState descending)', () => {
    expect(getIds('success')).toEqual(['3', '1', '2']);
  });

  it('sorts by newest option (createdAt descending)', () => {
    expect(getIds('newest')).toEqual(['3', '2', '1']);
  });

  it('sorts by oldest option (createdAt ascending)', () => {
    expect(getIds('oldest')).toEqual(['1', '2', '3']);
  });

  it('sorts by method-asc option (method A-Z)', () => {
    expect(getIds('method-asc')).toEqual(['2', '1', '3']);
  });

  it('sorts by method-desc option (method Z-A)', () => {
    expect(getIds('method-desc')).toEqual(['3', '1', '2']);
  });

  it('does not mutate the original input array', () => {
    const original = [...items];

    sortRequests({ items, sortBy: 'newest' });

    expect(items).toEqual(original);
  });
});
