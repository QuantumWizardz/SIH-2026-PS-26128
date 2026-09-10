import React from 'react';
import { cn } from './Button';

interface ArchMaskProps extends React.HTMLAttributes<HTMLDivElement> {
  imageUrl?: string;
  altText?: string;
  width?: number;
  height?: number;
}

export function ArchMask({ 
  imageUrl, 
  altText = 'Image', 
  width = 240,
  height = 320,
  className,
  ...props 
}: ArchMaskProps) {
  return (
    <div 
      className={cn("relative isolate", className)} 
      style={{ width, height }}
      {...props}
    >
      <div 
        className="absolute w-full h-full overflow-hidden bg-sand flex items-center justify-center text-espresso-40 text-sm"
        style={{
          borderTopLeftRadius: width / 2,
          borderTopRightRadius: width / 2,
          borderBottomLeftRadius: 8,
          borderBottomRightRadius: 8
        }}
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
