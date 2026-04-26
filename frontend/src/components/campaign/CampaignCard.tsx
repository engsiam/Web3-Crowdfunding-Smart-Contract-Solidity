'use client';

import { useState, useEffect, useRef } from 'react';
import { Campaign } from '@/lib/contract';
import { Button } from '@/components/ui/Button';
import { formatEth } from '@/lib/contract';

interface CampaignCardProps {
  campaign: Campaign;
  userAddress: string | null;
  onContribute: (campaignId: number, amount: string) => Promise<void>;
  onClaimFunds: (campaignId: number) => Promise<void>;
  onRefund: (campaignId: number) => Promise<void>;
  isLoading: boolean;
}

function formatDeadline(timestamp: number, currentTime: number): string {
  const diff = timestamp - currentTime;
  if (diff <= 0) return 'Ended';
  const days = Math.floor(diff / 86400);
  const hours = Math.floor((diff % 86400) / 3600);
  if (days > 0) return `${days}d ${hours}h left`;
  return `${hours}h left`;
}

export function CampaignCard({ campaign, userAddress, onContribute, onClaimFunds, onRefund, isLoading }: CampaignCardProps) {
  const [contributeAmount, setContributeAmount] = useState('');
  const [currentTime, setCurrentTime] = useState(() => typeof window !== 'undefined' ? Math.floor(Date.now() / 1000) : 0);
  const [isContributing, setIsContributing] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setCurrentTime(Math.floor(Date.now() / 1000));
    }, 60000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const goal = BigInt(campaign.goalAmount);
  const raised = BigInt(campaign.amountRaised);
  const progress = goal > 0n ? (raised * 100n) / goal : 0n;
  const progressPercent = Number(progress);
  const isCreator = userAddress?.toLowerCase() === campaign.creator.toLowerCase();
  const isEnded = campaign.deadline < currentTime;
  const isGoalReached = raised >= goal;

  const handleContribute = async () => {
    if (!contributeAmount || parseFloat(contributeAmount) <= 0) return;
    setIsContributing(true);
    try {
      await onContribute(campaign.id, contributeAmount);
      setContributeAmount('');
    } finally {
      setIsContributing(false);
    }
  };

  return (
    <div className="relative overflow-hidden rounded-2xl bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 p-5 hover:border-zinc-700 transition-all duration-300">
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-lg font-semibold text-zinc-100 truncate flex-1 mr-2">{campaign.title}</h3>
        <span className="text-xs text-zinc-500 bg-zinc-800/50 px-2 py-1 rounded-full">#{campaign.id}</span>
      </div>
      
      <p className="text-zinc-400 text-sm mb-4 line-clamp-2">{campaign.description}</p>
      
      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-zinc-500">Raised</span>
          <span className="text-zinc-100 font-medium">{formatEth(campaign.amountRaised)} ETH</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-zinc-500">Goal</span>
          <span className="text-zinc-400">{formatEth(campaign.goalAmount)} ETH</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-zinc-500">Min Contribution</span>
          <span className="text-zinc-400">{formatEth(campaign.minContribution)} ETH</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-zinc-500">Deadline</span>
          <span className={isEnded ? 'text-red-400' : 'text-cyan-400'}>
            {formatDeadline(campaign.deadline, currentTime)}
          </span>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex justify-between text-xs mb-1.5">
          <span className="text-zinc-500">Progress</span>
          <span className="text-amber-400 font-medium">{progressPercent}%</span>
        </div>
        <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-500"
            style={{ width: `${Math.min(progressPercent, 100)}%` }}
          />
        </div>
      </div>

      {!isEnded && !isGoalReached && (
        <div className="flex gap-2">
          <input
            type="number"
            step="0.01"
            min="0"
            placeholder="Amount in ETH"
            value={contributeAmount}
            onChange={(e) => setContributeAmount(e.target.value)}
            className="flex-1 px-3 py-2 rounded-lg bg-zinc-800/60 border border-zinc-700/50 text-zinc-100 text-sm placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
          />
          <Button 
            onClick={handleContribute} 
            isLoading={isLoading || isContributing}
            disabled={!contributeAmount || parseFloat(contributeAmount) <= 0}
            className="px-4 py-2 text-sm whitespace-nowrap"
          >
            Fund
          </Button>
        </div>
      )}

      {isEnded && isCreator && !campaign.claimed && isGoalReached && (
        <Button 
          onClick={() => onClaimFunds(campaign.id)} 
          isLoading={isLoading} 
          variant="secondary"
          className="w-full mt-2"
        >
          <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Claim Funds
        </Button>
      )}

      {isEnded && !isGoalReached && (
        <Button 
          onClick={() => onRefund(campaign.id)} 
          isLoading={isLoading} 
          variant="danger"
          className="w-full mt-2"
        >
          <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
          </svg>
          Request Refund
        </Button>
      )}

      {campaign.claimed && (
        <div className="mt-2 text-center text-green-400 text-sm flex items-center justify-center gap-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Funds Claimed
        </div>
      )}
    </div>
  );
}