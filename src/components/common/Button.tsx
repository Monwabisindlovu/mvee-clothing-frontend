// src/components/common/Button.tsx
'use client';

import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'ghost' | 'primary' | 'icon';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  children?: React.ReactNode;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  className,
  ...props
}) => {
  return (
    <button className={`${variant} ${size} ${className}`} {...props}>
      {children}
    </button>
  );
};

export { Button };
