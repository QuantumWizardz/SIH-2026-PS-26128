import React from 'react';
import { cn } from './Button';

type Tier = 'NORMAL' | 'WATCH' | 'HIGH' | 'CRITICAL';

interface ScoreDialProps extends React.HTMLAttributes<HTMLDivElement> {
  score: number;
  label: string;
  tier: Tier;
  size?: number;
}

const tierStrokeColor = {
  NORMAL: '#6E8B5E',
  WATCH: '#C9A227',
  HIGH: '#D97742',
  CRITICAL: '#A63A28',
};

export function ScoreDial({ score, label, tier, size = 120, className, ...props }: ScoreDialProps) {
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className={cn("flex flex-col items-center", className)} {...props}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke="#E8DCC8" // sand
            strokeWidth={strokeWidth}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke={tierStrokeColor[tier]}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-500 ease-in-out"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-3xl font-bold text-espresso tabular-nums">{Math.round(score)}</span>
        </div>
      </div>
      <span className="mt-3 text-sm text-espresso-70 lowercase tracking-wide font-medium text-center">
        {label}
      </span>
    </div>
  );
}
