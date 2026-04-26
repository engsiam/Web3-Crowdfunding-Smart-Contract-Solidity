import { Contract, formatEther } from 'ethers';
import { getSigner } from './ethers';
import { CONTRACT_ADDRESS } from '@/constants/config';
import { TransactionData } from '@/types/analytics';

const ABI = [
  'function campaignCount() view returns (uint256)',
  'function campaigns(uint256) view returns (address creator, string title, string description, uint256 goalAmount, uint256 minContribution, uint256 deadline, uint256 amountRaised, bool claimed)',
  'function contribute(uint256 _campaignId) payable',
  'function createCampaign(string _title, string _description, uint256 _goalAmount, uint256 _minContribution, uint256 _durationInDays)',
] as const;

let contractInstance: Contract | null = null;

export async function getContract(): Promise<Contract> {
  if (contractInstance) return contractInstance;
  
  const signer = await getSigner();
  contractInstance = new Contract(CONTRACT_ADDRESS, ABI, signer);
  return contractInstance;
}

export async function getCampaignCount(): Promise<number> {
  const contract = await getContract();
  const count = await contract.campaignCount();
  return Number(count);
}

export async function getCampaigns(): Promise<Array<{
  id: number;
  creator: string;
  title: string;
  goalAmount: string;
  amountRaised: string;
  deadline: number;
}>> {
  const contract = await getContract();
  const count = await contract.campaignCount();
  const campaigns = [];
  
  for (let i = 1; i <= Number(count); i++) {
    try {
      const campaign = await contract.campaigns(i);
      campaigns.push({
        id: i,
        creator: campaign.creator,
        title: campaign.title,
        goalAmount: campaign.goalAmount.toString(),
        amountRaised: campaign.amountRaised.toString(),
        deadline: Number(campaign.deadline),
      });
    } catch {
      // Skip invalid campaigns
    }
  }
  
  return campaigns;
}

export async function getTotalRaised(): Promise<string> {
  const campaigns = await getCampaigns();
  const total = campaigns.reduce((sum, c) => sum + BigInt(c.amountRaised), BigInt(0));
  return total.toString();
}

export function calculateTotalContributions(transactions: TransactionData[]): string {
  return transactions.reduce((sum, tx) => sum + BigInt(tx.amount), BigInt(0)).toString();
}

export function formatEth(wei: string): string {
  if (!wei || wei === '0') return '0';
  try {
    return formatEther(wei);
  } catch {
    return '0';
  }
}