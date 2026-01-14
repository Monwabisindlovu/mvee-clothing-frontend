import * as React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function Button({
  variant = 'default',
  size = 'md',
  className = '',
  ...props
}: ButtonProps) {
  const base = 'rounded-lg font-medium transition-all';

  const sizes: Record<NonNullable<ButtonProps['size']>, string> = {
    sm: 'px-2 py-1 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg',
  };

  const style =
    variant === 'outline'
      ? 'border border-black text-black hover:bg-black hover:text-white'
      : 'bg-black text-white hover:bg-neutral-800';

  return <button className={`${base} ${sizes[size]} ${style} ${className}`} {...props} />;
}
