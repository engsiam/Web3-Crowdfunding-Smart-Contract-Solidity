import { Contract, parseEther, formatEther } from 'ethers';
import { getSigner } from './ethers';
import { CONTRACT_ADDRESS } from '@/constants/config';
import { parseEthersError } from './errorHandler';

const ABI = [
  'function campaignCount() view returns (uint256)',
  'function campaigns(uint256) view returns (address creator, string title, string description, uint256 goalAmount, uint256 minContribution, uint256 deadline, uint256 amountRaised, bool claimed)',
  'function claimFunds(uint256 _campaignId)',
  'function contribute(uint256 _campaignId) payable',
  'function contributions(uint256, address) view returns (uint256)',
  'function createCampaign(string _title, string _description, uint256 _goalAmount, uint256 _minContribution, uint256 _durationInDays)',
  'function getCampaign(uint256 _campaignId) view returns (address creator, string title, string description, uint256 goalAmount, uint256 deadline, uint256 amountRaised, bool claimed)',
  'function owner() view returns (address)',
  'function refund(uint256 _campaignId)',

  'event CampaignCreated(uint256 campaignId, address creator, uint256 goal, uint256 deadline)',
  'event ContributionReceived(uint256 campingId, address backer, uint256 amount)',
  'event FundsClaimed(uint256 campaignId, address creator, uint256 amount)',
  'event RefundIssued(uint256 Campaignid, address backer, uint256 amount)',
] as const;

export interface Campaign {
  id: number;
  creator: string;
  title: string;
  description: string;
  goalAmount: string;
  minContribution: string;
  deadline: number;
  amountRaised: string;
  claimed: boolean;
}

export async function getContract(): Promise<Contract> {
  const signer = await getSigner();
  return new Contract(CONTRACT_ADDRESS, ABI, signer);
}

export async function createCampaign(
  title: string,
  description: string,
  goalAmount: string,
  minContribution: string,
  durationInDays: number
): Promise<void> {
  try {
    if (!title || !description || !goalAmount || !minContribution || !durationInDays) {
      throw new Error('All fields are required');
    }

    const contract = await getContract();
    const goal = parseEther(goalAmount);
    const min = parseEther(minContribution);

    const tx = await contract.createCampaign(title, description, goal, min, durationInDays);
    await tx.wait();
  } catch (error: unknown) {
    throw new Error(parseEthersError(error));
  }
}

export async function contribute(campaignId: number, amount: string): Promise<void> {
  try {
    if (!amount || Number(amount) <= 0) {
      throw new Error('Invalid amount');
    }

    const contract = await getContract();
    const value = parseEther(amount);

    const tx = await contract.contribute(campaignId, { value });
    await tx.wait();
  } catch (error: unknown) {
    throw new Error(parseEthersError(error));
  }
}

export async function claimFunds(campaignId: number): Promise<void> {
  try {
    const contract = await getContract();
    const tx = await contract.claimFunds(campaignId);
    await tx.wait();
  } catch (error: unknown) {
    throw new Error(parseEthersError(error));
  }
}

export async function refund(campaignId: number): Promise<void> {
  try {
    const contract = await getContract();
    const tx = await contract.refund(campaignId);
    await tx.wait();
  } catch (error: unknown) {
    throw new Error(parseEthersError(error));
  }
}

export async function getCampaign(campaignId: number): Promise<Campaign> {
  try {
    const contract = await getContract();
    const campaign = await contract.campaigns(campaignId);
    
    return {
      id: campaignId,
      creator: campaign.creator,
      title: campaign.title,
      description: campaign.description,
      goalAmount: campaign.goalAmount.toString(),
      minContribution: campaign.minContribution.toString(),
      deadline: Number(campaign.deadline),
      amountRaised: campaign.amountRaised.toString(),
      claimed: campaign.claimed,
    };
  } catch {
    throw new Error('Campaign not found');
  }
}

export async function getCampaignCount(): Promise<number> {
  try {
    const contract = await getContract();
    const count = await contract.campaignCount();
    return Number(count);
  } catch {
    return 0;
  }
}

export async function getUserContribution(campaignId: number, userAddress: string): Promise<string> {
  try {
    if (!userAddress) return '0';
    const contract = await getContract();
    const contribution = await contract.contributions(campaignId, userAddress);
    return contribution.toString();
  } catch {
    return '0';
  }
}

export function formatEth(wei: string): string {
  return formatEther(wei);
}

export function parseEth(amount: string): bigint {
  return parseEther(amount);
}

export type { ABI };