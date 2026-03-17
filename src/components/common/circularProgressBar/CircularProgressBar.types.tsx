export interface IProgressSegment {
  value: number;
  color: string;
  label: string;
}

export interface ICircularProgressBarProps {
  value: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  trackColor?: string;
  durationMs?: number;
  label?: string;
  centerText?: string;
  segments?: IProgressSegment[];
  className?: string;
}
