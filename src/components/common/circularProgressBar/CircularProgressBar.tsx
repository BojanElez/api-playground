import './CircularProgressBar.css';
import { useEffect, useState } from 'react';
import type { ICircularProgressBarProps, IProgressSegment } from './CircularProgressBar.types';

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const CircularProgressBar = ({
  value,
  size = 120,
  strokeWidth = 10,
  color = '#959c97',
  trackColor = '#ffffff',
  durationMs = 800,
  label,
  centerText,
  segments,
  className = '',
}: ICircularProgressBarProps) => {
  const [animatedValue, setAnimatedValue] = useState(0);
  const normalizedValue = clamp(value, 0, 100);
  const normalizedSegments = (() => {
    if (!segments || segments.length === 0) {
      return [] as IProgressSegment[];
    }

    const segmentsWithinRange = segments.map((segment) => ({
      ...segment,
      value: clamp(segment.value, 0, 100),
    }));

    const total = segmentsWithinRange.reduce((sum, segment) => sum + segment.value, 0);

    if (total <= 100 || total === 0) {
      return segmentsWithinRange;
    }

    const scale = 100 / total;
    return segmentsWithinRange.map((segment) => ({
      ...segment,
      value: segment.value * scale,
    }));
  })();

  const visibleSegments = normalizedSegments.filter((segment) => segment.value > 0);
  const hasSegments = visibleSegments.length > 0;
  const radius = (size - strokeWidth) / 2;
  const strokeDashoffset = 100 - animatedValue;

  useEffect(() => {
    const frameId = requestAnimationFrame(() => {
      setAnimatedValue(normalizedValue);
    });

    return () => cancelAnimationFrame(frameId);
  }, [normalizedValue]);

  return (
    <div className={`circular-progress ${className}`} style={{ width: size, height: size }}>
      <svg
        className="circular-progress-svg"
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
      >
        <circle
          className="circular-progress-track"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={trackColor}
          strokeWidth={strokeWidth}
          fill="none"
        />
        {hasSegments ? (
          visibleSegments.map((segment, index) => {
            const startPercent = visibleSegments
              .slice(0, index)
              .reduce((sum, current) => sum + current.value, 0);

            return (
              <circle
                key={`${segment.label}-${index}`}
                className="circular-progress-indicator"
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke={segment.color}
                strokeWidth={strokeWidth}
                fill="none"
                strokeLinecap="butt"
                pathLength={100}
                strokeDasharray={`${segment.value} ${100 - segment.value}`}
                strokeDashoffset={-startPercent}
                transform={`rotate(-90 ${size / 2} ${size / 2})`}
                style={{
                  transition: `stroke-dasharray ${durationMs}ms ease, stroke-dashoffset ${durationMs}ms ease`,
                }}
              />
            );
          })
        ) : (
          <circle
            className="circular-progress-indicator"
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="round"
            pathLength={100}
            strokeDasharray="100 100"
            strokeDashoffset={strokeDashoffset}
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
            style={{ transition: `stroke-dashoffset ${durationMs}ms ease` }}
          />
        )}
      </svg>

      <div className="circular-progress-center">
        <span className="circular-progress-value">
          {centerText ?? `${Math.round(normalizedValue)}%`}
        </span>
        {label && <span className="circular-progress-label">{label}</span>}
      </div>

      {hasSegments && (
        <div className="circular-progress-legend" aria-hidden="true">
          {visibleSegments.map((segment, index) => (
            <span
              key={`${segment.label}-legend-${index}`}
              className="circular-progress-legend-item"
            >
              <span
                className="circular-progress-legend-dot"
                style={{ backgroundColor: segment.color }}
              />
              {segment.label}: {Math.round(segment.value)}%
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default CircularProgressBar;
