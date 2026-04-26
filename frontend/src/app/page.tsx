'use client';

import { useEffect, useState } from 'react';
import { useWallet } from '@/hooks/useWallet';
import { useCrowdfunding } from '@/hooks/useCrowdfunding';
import { WalletButton } from '@/components/wallet/WalletButton';
import { WalletStatus } from '@/components/wallet/WalletStatus';
import { Web3Layout } from '@/components/layout/Web3Layout';
import { DashboardCard } from '@/components/layout/DashboardCard';
import { CampaignGrid } from '@/components/campaign/CampaignGrid';
import { LaunchCampaignModal } from '@/components/campaign/LaunchCampaignModal';
import { Button } from '@/components/ui/Button';
import { useMounted } from '@/hooks/useMounted';
import toast from 'react-hot-toast';

export default function Home() {
  const { address, isConnected, chainId } = useWallet();
  const isCorrectNetwork = chainId === '0xaa36a7';
  const { campaigns, totalRaised, campaignCount, isLoading, fetchCampaigns, createCampaign, contribute, claimFunds, requestRefund, formatBalance } = useCrowdfunding();
  const mounted = useMounted();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (isConnected && isCorrectNetwork) {
      fetchCampaigns();
    }
  }, [isConnected, isCorrectNetwork, fetchCampaigns]);

  const handleLaunch = async (title: string, description: string, goalAmount: string, minContribution: string, durationInDays: number) => {
    try {
      await createCampaign(title, description, goalAmount, minContribution, durationInDays);
      toast.success('Campaign launched successfully!');
      setIsModalOpen(false);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to launch campaign';
      toast.error(message);
      throw error;
    }
  };

  const handleContribute = async (campaignId: number, amount: string) => {
    try {
      await contribute(campaignId, amount);
      toast.success(`Contributed ${amount} ETH successfully!`);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Contribution failed';
      toast.error(message);
      throw error;
    }
  };

  const handleClaimFunds = async (campaignId: number) => {
    try {
      await claimFunds(campaignId);
      toast.success('Funds claimed successfully!');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Claim failed';
      toast.error(message);
      throw error;
    }
  };

  const handleRefund = async (campaignId: number) => {
    try {
      await requestRefund(campaignId);
      toast.success('Refund requested successfully!');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Refund failed';
      toast.error(message);
      throw error;
    }
  };

  if (!mounted) {
    return (
      <Web3Layout navbarActions={null}>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-zinc-100">Dashboard</h1>
          <p className="text-zinc-500 mt-1">Manage your crowdfunding campaigns</p>
        </div>
      </Web3Layout>
    );
  }

  return (
    <Web3Layout navbarActions={<><WalletButton /><WalletStatus /></>}>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-zinc-100">Dashboard</h1>
        <p className="text-zinc-500 mt-1">Manage your crowdfunding campaigns</p>
      </div>

      {!isConnected ? (
        <div className="flex items-center justify-center min-h-[60vh]">
          <DashboardCard className="max-w-md mx-auto text-center p-10">
            <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center">
              <svg className="w-8 h-8 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-zinc-100 mb-3">Welcome to Crowdfunding</h2>
            <p className="text-zinc-400 mb-6">
              Connect your MetaMask wallet to create and back campaigns on the Sepolia testnet.
            </p>
            <div className="flex justify-center">
              <WalletButton />
            </div>
          </DashboardCard>
        </div>
      ) : !isCorrectNetwork ? (
        <div className="flex items-center justify-center min-h-[60vh]">
          <DashboardCard className="max-w-md mx-auto text-center p-10 border-red-500/30">
            <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-red-500/20 flex items-center justify-center">
              <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-red-400 mb-3">Wrong Network</h2>
            <p className="text-zinc-400">
              Please switch to Sepolia testnet to use Crowdfunding.
            </p>
          </DashboardCard>
        </div>
      ) : (
        <>
          <DashboardCard title="Project Overview" className="mb-6">
            <div className="grid gap-6 sm:grid-cols-3">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-amber-500/20">
                  <svg className="w-6 h-6 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <div>
                  <p className="text-zinc-500 text-sm">Total Raised</p>
                  <p className="text-2xl font-bold text-zinc-100">{formatBalance(totalRaised)} ETH</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-cyan-500/20">
                  <svg className="w-6 h-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div>
                  <p className="text-zinc-500 text-sm">Active Campaigns</p>
                  <p className="text-2xl font-bold text-zinc-100">{campaignCount}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-green-500/20">
                  <svg className="w-6 h-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
                <div>
                  <p className="text-zinc-500 text-sm">Your Address</p>
                  <p className="text-sm font-bold text-zinc-100 truncate">{address?.slice(0, 8)}...{address?.slice(-6)}</p>
                </div>
              </div>
            </div>
          </DashboardCard>

          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-zinc-100">Active Campaigns</h2>
            <Button 
              onClick={() => setIsModalOpen(true)} 
              className="flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Launch Campaign
            </Button>
          </div>

          <CampaignGrid
            campaigns={campaigns}
            userAddress={address}
            onContribute={handleContribute}
            onClaimFunds={handleClaimFunds}
            onRefund={handleRefund}
            isLoading={isLoading}
          />

          <LaunchCampaignModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onLaunch={handleLaunch}
            isLoading={isLoading}
          />
        </>
      )}
    </Web3Layout>
  );
}