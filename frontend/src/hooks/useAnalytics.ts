import { useCallback, useMemo } from 'react';
import { useAnalyticsStore } from '@/store/analyticsStore';
import {
  getTotalRaised,
  getCampaigns,
  formatEth,
} from '@/lib/analytics';

const CACHE_DURATION = 30000;

interface CampaignData {
  id: number;
  title: string;
  goalAmount: string;
  amountRaised: string;
  deadline: number;
}

export function useAnalytics() {
  const {
    totalDeposited,
    totalWithdrawn,
    contractBalance,
    userBalance,
    depositHistory,
    withdrawalHistory,
    isLoading,
    error,
    lastUpdated,
    setTotalDeposited,
    setTotalWithdrawn,
    setContractBalance,
    setUserBalance,
    setDepositHistory,
    setWithdrawalHistory,
    setIsLoading,
    setError,
  } = useAnalyticsStore();

  function isCacheValidImpl(lastUpdate: number | null): boolean {
    if (!lastUpdate) return false;
    return Date.now() - lastUpdate < CACHE_DURATION;
  }

  const fetchAnalytics = useCallback(async (forceRefresh = false) => {
    if (!forceRefresh && isCacheValidImpl(lastUpdated)) return;

    try {
      setIsLoading(true);
      setError(null);

      const [totalRaised, campaigns] = await Promise.all([
        getTotalRaised(),
        getCampaigns(),
      ]);

      setContractBalance(totalRaised);
      setUserBalance('0');
      
      const contributionHistory = campaigns.map((c: CampaignData) => ({
        hash: c.id.toString(),
        amount: c.amountRaised,
        timestamp: c.deadline * 1000,
        date: new Date(c.deadline * 1000).toLocaleDateString(),
      }));

      setDepositHistory(contributionHistory);
      setWithdrawalHistory([]);
      setTotalDeposited(totalRaised);
      setTotalWithdrawn('0');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch analytics';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [lastUpdated, setIsLoading, setError, setContractBalance, setUserBalance, setDepositHistory, setWithdrawalHistory, setTotalDeposited, setTotalWithdrawn]);

  const formatBalance = useCallback((wei: string): string => {
    return formatEth(wei);
  }, []);

  const chartData = useMemo(() => {
    const campaigns = depositHistory.map(d => ({
      date: d.date,
      contributions: Number(BigInt(d.amount)) / 1e18,
    }));

    const grouped = campaigns.reduce<Record<string, number>>((acc, c) => {
      if (!acc[c.date]) {
        acc[c.date] = 0;
      }
      acc[c.date] += c.contributions;
      return acc;
    }, {});

    return Object.entries(grouped)
      .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
      .map(([date, contributions]) => ({
        date,
        netBalance: contributions,
        deposits: contributions,
        withdrawals: 0,
      }));
  }, [depositHistory]);

  return {
    totalDeposited,
    totalWithdrawn,
    contractBalance,
    userBalance,
    depositHistory,
    withdrawalHistory,
    isLoading,
    error,
    chartData,
    fetchAnalytics,
    formatBalance,
  };
}