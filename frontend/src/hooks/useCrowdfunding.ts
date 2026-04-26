import { useState, useCallback } from 'react';
import { Campaign, createCampaign as createCampaignTx, contribute as contributeTx, claimFunds as claimFundsTx, refund as refundTx, getCampaign, getCampaignCount, formatEth } from '@/lib/contract';

export interface CrowdfundingState {
  campaigns: Campaign[];
  totalRaised: string;
  campaignCount: number;
  isLoading: boolean;
  error: string | null;
}

export function useCrowdfunding() {
  const [state, setState] = useState<CrowdfundingState>({
    campaigns: [],
    totalRaised: '0',
    campaignCount: 0,
    isLoading: false,
    error: null,
  });

  const fetchCampaigns = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      const count = await getCampaignCount();
      const campaigns: Campaign[] = [];
      let totalRaised = 0n;

      for (let i = 1; i <= count; i++) {
        try {
          const campaign = await getCampaign(i);
          campaigns.push(campaign);
          totalRaised += BigInt(campaign.amountRaised);
        } catch {
          // Skip invalid campaigns
        }
      }

      setState(prev => ({
        ...prev,
        campaigns,
        totalRaised: totalRaised.toString(),
        campaignCount: count,
        isLoading: false,
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch campaigns';
      setState(prev => ({ ...prev, isLoading: false, error: errorMessage }));
    }
  }, []);

  const createCampaign = useCallback(async (
    title: string,
    description: string,
    goalAmount: string,
    minContribution: string,
    durationInDays: number
  ) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      await createCampaignTx(title, description, goalAmount, minContribution, durationInDays);
      await fetchCampaigns();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create campaign';
      setState(prev => ({ ...prev, isLoading: false, error: errorMessage }));
      throw error;
    }
  }, [fetchCampaigns]);

  const contribute = useCallback(async (campaignId: number, amount: string) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      await contributeTx(campaignId, amount);
      await fetchCampaigns();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to contribute';
      setState(prev => ({ ...prev, isLoading: false, error: errorMessage }));
      throw error;
    }
  }, [fetchCampaigns]);

  const claimFunds = useCallback(async (campaignId: number) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      await claimFundsTx(campaignId);
      await fetchCampaigns();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to claim funds';
      setState(prev => ({ ...prev, isLoading: false, error: errorMessage }));
      throw error;
    }
  }, [fetchCampaigns]);

  const requestRefund = useCallback(async (campaignId: number) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      await refundTx(campaignId);
      await fetchCampaigns();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to request refund';
      setState(prev => ({ ...prev, isLoading: false, error: errorMessage }));
      throw error;
    }
  }, [fetchCampaigns]);

  const formatBalance = useCallback((wei: string) => {
    return formatEth(wei);
  }, []);

  return {
    ...state,
    fetchCampaigns,
    createCampaign,
    contribute,
    claimFunds,
    requestRefund,
    formatBalance,
  };
}