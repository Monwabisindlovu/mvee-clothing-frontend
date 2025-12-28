// src/components/common/Badge.tsx
import React from 'react';

export const Badge: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => (
  <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded ${className}`}>
    {children}
  </span>
);
