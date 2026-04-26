'use client';

import {
  Contract,
  EventLog,
  formatEther,
  BrowserProvider,
} from 'ethers';
import { getSigner } from './ethers';
import { CONTRACT_ADDRESS } from '@/constants/config';
import { Transaction } from '@/types/transaction';

const ABI = [
  'function campaignCount() view returns (uint256)',
  'function campaigns(uint256) view returns (address creator, string title, string description, uint256 goalAmount, uint256 minContribution, uint256 deadline, uint256 amountRaised, bool claimed)',
  'function claimFunds(uint256 _campaignId)',
  'function contribute(uint256 _campaignId) payable',
  'function createCampaign(string _title, string _description, uint256 _goalAmount, uint256 _minContribution, uint256 _durationInDays)',
  'event CampaignCreated(uint256 campaignId, address creator, uint256 goal, uint256 deadline)',
  'event ContributionReceived(uint256 campingId, address backer, uint256 amount)',
  'event FundsClaimed(uint256 campaignId, address creator, uint256 amount)',
  'event RefundIssued(uint256 Campaignid, address backer, uint256 amount)',
] as const;

async function getContract(): Promise<Contract> {
  const signer = await getSigner();
  return new Contract(CONTRACT_ADDRESS, ABI, signer);
}

export async function fetchTransactionEvents(
  userAddress?: string
): Promise<Transaction[]> {
  try {
    if (typeof window === 'undefined' || !window.ethereum) {
      return [];
    }

    const contract = await getContract();
    const provider = new BrowserProvider(window.ethereum);
    const latestBlock = await provider.getBlockNumber();
    const fromBlock = Math.max(latestBlock - 100000, 0);

    const campaignFilter = contract.filters.CampaignCreated();
    const contributionFilter = contract.filters.ContributionReceived();
    const fundsClaimedFilter = contract.filters.FundsClaimed();
    const refundFilter = contract.filters.RefundIssued();

    const [campaignEvents, contributionEvents, fundsClaimedEvents, refundEvents] = await Promise.all([
      contract.queryFilter(campaignFilter, fromBlock, latestBlock),
      contract.queryFilter(contributionFilter, fromBlock, latestBlock),
      contract.queryFilter(fundsClaimedFilter, fromBlock, latestBlock),
      contract.queryFilter(refundFilter, fromBlock, latestBlock),
    ]);

    const transactions: Transaction[] = [];

    for (const event of campaignEvents) {
      if (!(event instanceof EventLog)) continue;
      const block = await event.getBlock();
      const args = event.args as unknown as { campaignId: bigint; creator: string; goal: bigint };
      transactions.push({
        hash: event.transactionHash,
        type: 'campaign_created',
        from: args.creator,
        to: CONTRACT_ADDRESS,
        amount: args.goal.toString(),
        timestamp: block.timestamp * 1000,
        status: 'success',
        blockNumber: event.blockNumber ?? 0,
      });
    }

    for (const event of contributionEvents) {
      if (!(event instanceof EventLog)) continue;
      const block = await event.getBlock();
      const args = event.args as unknown as { campingId: bigint; backer: string; amount: bigint };
      transactions.push({
        hash: event.transactionHash,
        type: 'contribution',
        from: args.backer,
        to: CONTRACT_ADDRESS,
        amount: args.amount.toString(),
        timestamp: block.timestamp * 1000,
        status: 'success',
        blockNumber: event.blockNumber ?? 0,
      });
    }

    for (const event of fundsClaimedEvents) {
      if (!(event instanceof EventLog)) continue;
      const block = await event.getBlock();
      const args = event.args as unknown as { campaignId: bigint; creator: string; amount: bigint };
      transactions.push({
        hash: event.transactionHash,
        type: 'funds_claimed',
        from: CONTRACT_ADDRESS,
        to: args.creator,
        amount: args.amount.toString(),
        timestamp: block.timestamp * 1000,
        status: 'success',
        blockNumber: event.blockNumber ?? 0,
      });
    }

    for (const event of refundEvents) {
      if (!(event instanceof EventLog)) continue;
      const block = await event.getBlock();
      const args = event.args as unknown as { Campaignid: bigint; backer: string; amount: bigint };
      transactions.push({
        hash: event.transactionHash,
        type: 'refund',
        from: CONTRACT_ADDRESS,
        to: args.backer,
        amount: args.amount.toString(),
        timestamp: block.timestamp * 1000,
        status: 'success',
        blockNumber: event.blockNumber ?? 0,
      });
    }

    const sorted = transactions.sort(
      (a, b) => (b.blockNumber ?? 0) - (a.blockNumber ?? 0)
    );

    if (userAddress) {
      return sorted.filter(
        (tx) =>
          tx.from.toLowerCase() === userAddress.toLowerCase() ||
          tx.to.toLowerCase() === userAddress.toLowerCase()
      );
    }

    return sorted;
  } catch (error) {
    console.error('fetchTransactionEvents error:', error);
    return [];
  }
}

export function filterTransactions(
  transactions: Transaction[],
  type: string,
  search: string
): Transaction[] {
  let filtered = transactions;

  if (type !== 'all') {
    filtered = filtered.filter((tx) => tx.type === type);
  }

  if (search) {
    const searchLower = search.toLowerCase();
    filtered = filtered.filter(
      (tx) =>
        tx.hash.toLowerCase().includes(searchLower) ||
        tx.from.toLowerCase().includes(searchLower) ||
        tx.to.toLowerCase().includes(searchLower)
    );
  }

  return filtered;
}

export function formatAmount(wei: string): string {
  try {
    return Number(formatEther(wei)).toFixed(6);
  } catch {
    return '0';
  }
}

export function formatAddress(address: string): string {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function getEtherscanUrl(
  hash: string,
  network: string = 'sepolia'
): string {
  return `https://${network}.etherscan.io/tx/${hash}`;
}

export function getCampaignTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    campaign_created: 'Campaign Created',
    contribution: 'Contribution',
    funds_claimed: 'Funds Claimed',
    refund: 'Refund',
  };
  return labels[type] || type;
}