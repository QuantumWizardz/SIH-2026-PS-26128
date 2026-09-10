import React from 'react';
import { cn } from './Button';

interface CircleMaskProps extends React.HTMLAttributes<HTMLDivElement> {
  imageUrl?: string;
  altText?: string;
  size?: number;
  offset?: number;
}

export function CircleMask({ 
  imageUrl, 
  altText = 'Image', 
  size = 240, 
  offset = 16,
  className,
  ...props 
}: CircleMaskProps) {
  return (
    <div 
      className={cn("relative isolate", className)} 
      style={{ width: size + offset, height: size + offset }}
      {...props}
    >
      {/* Offset backdrop circle */}
      <div 
        className="absolute rounded-full bg-espresso"
        style={{ 
          width: size, 
          height: size, 
          right: 0, 
          bottom: 0,
          zIndex: -1 
        }} 
      />
      {/* Foreground image mask */}
      <div 
        className="absolute rounded-full overflow-hidden bg-sand flex items-center justify-center text-espresso-40 text-sm"
        style={{ width: size, height: size, left: 0, top: 0 }}
      >
        {imageUrl ? (
          <img src={imageUrl} alt={altText} className="w-full h-full object-cover" />
        ) : (
          <span className="italic">Image</span>
        )}
      </div>
    </div>
  );
}
