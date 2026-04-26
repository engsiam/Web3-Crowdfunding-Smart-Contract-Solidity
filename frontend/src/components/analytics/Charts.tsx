'use client';

import { DashboardCard } from '@/components/layout/DashboardCard';
import { LineChart } from './LineChart';
import { BarChart } from './BarChart';
import { AreaChart } from './AreaChart';

interface ChartsProps {
  data: Array<{
    date: string;
    deposits: number;
    withdrawals: number;
    netBalance: number;
  }>;
  isLoading?: boolean;
}

function ChartSkeleton() {
  return <div className="h-[300px] w-full bg-zinc-800/30 animate-pulse rounded-xl" />;
}

export function Charts({ data, isLoading }: ChartsProps) {
  if (isLoading) {
    return (
      <div className="grid gap-6 lg:grid-cols-2">
        <DashboardCard title="Contributions Over Time"><ChartSkeleton /></DashboardCard>
        <DashboardCard title="Campaign Goals"><ChartSkeleton /></DashboardCard>
        <DashboardCard title="Global Contributions Over Time" className="lg:col-span-2"><ChartSkeleton /></DashboardCard>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="grid gap-6 lg:grid-cols-2">
        <DashboardCard title="Contributions Over Time">
          <div className="h-[300px] flex items-center justify-center text-zinc-500">No contribution data</div>
        </DashboardCard>
        <DashboardCard title="Campaign Goals">
          <div className="h-[300px] flex items-center justify-center text-zinc-500">No campaign data</div>
        </DashboardCard>
        <DashboardCard title="Global Contributions Over Time" className="lg:col-span-2">
          <div className="h-[300px] flex items-center justify-center text-zinc-500">No contribution data</div>
        </DashboardCard>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <DashboardCard title="Contributions Over Time">
        <LineChart data={data} />
      </DashboardCard>
      <DashboardCard title="Campaign Goals">
        <BarChart data={data} />
      </DashboardCard>
      <DashboardCard title="Global Contributions Over Time" className="lg:col-span-2">
        <AreaChart data={data} />
      </DashboardCard>
    </div>
  );
}