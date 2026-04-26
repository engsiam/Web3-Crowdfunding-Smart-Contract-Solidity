'use client';

import { Campaign } from '@/lib/contract';
import { CampaignCard } from './CampaignCard';

interface CampaignGridProps {
  campaigns: Campaign[];
  userAddress: string | null;
  onContribute: (campaignId: number, amount: string) => Promise<void>;
  onClaimFunds: (campaignId: number) => Promise<void>;
  onRefund: (campaignId: number) => Promise<void>;
  isLoading: boolean;
}

export function CampaignGrid({ campaigns, userAddress, onContribute, onClaimFunds, onRefund, isLoading }: CampaignGridProps) {
  if (campaigns.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        No campaigns yet. Launch one to get started!
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {campaigns.map((campaign) => (
        <CampaignCard
          key={campaign.id}
          campaign={campaign}
          userAddress={userAddress}
          onContribute={onContribute}
          onClaimFunds={onClaimFunds}
          onRefund={onRefund}
          isLoading={isLoading}
        />
      ))}
    </div>
  );
}