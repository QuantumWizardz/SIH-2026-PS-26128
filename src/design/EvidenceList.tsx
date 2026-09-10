import React from 'react';
import { cn } from './Button';

interface EvidenceListProps extends React.HTMLAttributes<HTMLUListElement> {
  reasons: string[];
}

export function EvidenceList({ reasons, className, ...props }: EvidenceListProps) {
  if (!reasons || reasons.length === 0) return null;

  return (
    <ul className={cn("space-y-2", className)} {...props}>
      {reasons.map((reason, index) => (
        <li key={index} className="flex items-start">
          <span className="text-terracotta mr-2" aria-hidden="true">✓</span>
          <span className="text-espresso-70 text-sm">{reason}</span>
        </li>
      ))}
    </ul>
  );
}
