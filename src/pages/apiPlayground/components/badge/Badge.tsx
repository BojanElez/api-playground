import type { THttpMethod } from '../../types';
import './badge.css';
import type { IBadgeProps } from './Badge.types';

const normalizeValue = (value: string) => value.trim().toLowerCase();

const isHttpMethod = (value: string): value is THttpMethod => {
  const normalized = value.toUpperCase();
  return ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'].includes(normalized);
};

const Badge = ({ type, value }: IBadgeProps) => {
  const normalized = normalizeValue(value);
  const displayValue = type === 'method' && isHttpMethod(value) ? value.toUpperCase() : value;

  return <span className={`badge badge-${type} badge-${type}-${normalized}`}>{displayValue}</span>;
};

export default Badge;
