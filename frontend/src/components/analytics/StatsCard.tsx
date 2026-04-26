'use client';

interface StatsCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  isLoading?: boolean;
}

export function StatsCard({ title, value, icon, trend, isLoading }: StatsCardProps) {
  const trendColors = {
    up: 'text-green-400',
    down: 'text-red-400',
    neutral: 'text-zinc-400',
  };

  return (
    <div className="relative overflow-hidden rounded-2xl bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 p-6 hover:border-zinc-700 transition-colors">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-zinc-500 mb-1">{title}</p>
          {isLoading ? (
            <div className="h-8 w-24 bg-zinc-700/50 animate-pulse rounded" />
          ) : (
            <p className="text-2xl font-bold text-zinc-100">{value}</p>
          )}
          {trend && (
            <p className={`text-xs mt-1 ${trendColors[trend]}`}>
              {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'}
            </p>
          )}
        </div>
        <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400">
          {icon}
        </div>
      </div>
      <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-full blur-xl" />
    </div>
  );
}