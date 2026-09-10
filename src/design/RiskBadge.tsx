import React from 'react';
import { cn } from './Button';

type Tier = 'NORMAL' | 'WATCH' | 'HIGH' | 'CRITICAL' | 'ZOONOTIC';

interface RiskBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  tier: Tier;
  label: string;
  score?: number | string;
}

const tierConfig = {
  NORMAL: { border: 'border-l-risk-moss', bg: 'bg-risk-moss/10', text: 'text-risk-moss' },
  WATCH: { border: 'border-l-risk-ochre', bg: 'bg-risk-ochre/10', text: 'text-risk-ochre' },
  HIGH: { border: 'border-l-risk-burnt-orange', bg: 'bg-risk-burnt-orange/10', text: 'text-risk-burnt-orange' },
  CRITICAL: { border: 'border-l-risk-deep-rust', bg: 'bg-risk-deep-rust/10', text: 'text-risk-deep-rust' },
  ZOONOTIC: { border: 'border-l-risk-oxblood', bg: 'bg-risk-oxblood/10', text: 'text-risk-oxblood' },
};

export function RiskBadge({ tier, label, score, className, ...props }: RiskBadgeProps) {
  const config = tierConfig[tier];
  
  return (
    <div 
      className={cn(
        "inline-flex items-center rounded-soft bg-cream-deep border-l-[3px] py-1 px-3 shadow-sm",
        config.border,
        className
      )}
      {...props}
    >
      {tier === 'ZOONOTIC' && (
        <span className="mr-1.5" aria-hidden="true">☣️</span>
      )}
      <span className="text-espresso font-semibold text-xs tracking-wide uppercase mr-2">{label}</span>
      {score !== undefined && (
        <span className="text-espresso tabular-nums font-bold text-sm">{score}</span>
      )}
    </div>
  );
}
