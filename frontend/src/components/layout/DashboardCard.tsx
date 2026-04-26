'use client';

import { ReactNode } from 'react';

interface DashboardCardProps {
  children: ReactNode;
  className?: string;
  title?: string;
}

export function DashboardCard({ children, className = '', title }: DashboardCardProps) {
  return (
    <div className={`relative overflow-hidden rounded-2xl bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 p-6 ${className}`}>
      {title && (
        <h3 className="text-lg font-semibold text-zinc-100 mb-4">{title}</h3>
      )}
      {children}
    </div>
  );
}