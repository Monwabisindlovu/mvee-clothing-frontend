// src/components/common/Card.tsx
import React from 'react';

export const Card: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, ...props }) => (
  <div className="rounded-lg border bg-white shadow-sm" {...props}>
    {children}
  </div>
);
