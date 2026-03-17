export type TBadgeType = 'method' | 'state';

export interface IBadgeProps {
  type: TBadgeType;
  value: string;
}
