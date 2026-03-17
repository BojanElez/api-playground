export type TThemeName = 'modern' | 'midnight' | 'tropical';

export const THEME_STORAGE_KEY = 'api-playground-theme';

export const themeOptions = [
  { label: 'Modern', value: 'modern' },
  { label: 'Midnight', value: 'midnight' },
  { label: 'Tropical', value: 'tropical' },
] as const;

export const DEFAULT_THEME: TThemeName = 'modern';

export const isThemeName = (value: string): value is TThemeName => {
  return themeOptions.some((option) => option.value === value);
};
