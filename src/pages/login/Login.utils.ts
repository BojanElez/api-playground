import type { IMockUser } from './Login.types';

export const WRONG_CREDENTIALS_MESSAGE = 'Wrong email or password';

export const mockUsersUrl = new URL('../../mockData/users.json', import.meta.url).href;

export const fetchMockUsers = async (): Promise<IMockUser> => {
  const response = await fetch(mockUsersUrl);

  if (!response.ok) {
    throw new Error('Failed to load users list.');
  }

  return response.json() as Promise<IMockUser>;
};
