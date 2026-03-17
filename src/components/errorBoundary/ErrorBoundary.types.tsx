import type { ReactNode } from 'react';

export interface IErrorBoundaryProps {
  children: ReactNode;
}

export interface IState {
  hasError: boolean;
}
