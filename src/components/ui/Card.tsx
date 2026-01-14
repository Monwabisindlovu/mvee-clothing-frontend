import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export default function Card({ children, className = '' }: CardProps) {
  return <div className={`bg-white rounded-xl border ${className}`}>{children}</div>;
}

interface SectionProps {
  children: React.ReactNode;
  className?: string;
}

export function CardHeader({ children, className = '' }: SectionProps) {
  return <div className={`p-4 border-b ${className}`}>{children}</div>;
}

export function CardTitle({ children, className = '' }: SectionProps) {
  return <h3 className={`font-semibold ${className}`}>{children}</h3>;
}

export function CardContent({ children, className = '' }: SectionProps) {
  return <div className={`p-4 ${className}`}>{children}</div>;
}
