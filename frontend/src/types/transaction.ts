export type TransactionType = 'campaign_created' | 'contribution' | 'funds_claimed' | 'refund' | 'deposit' | 'withdrawal';

export type TransactionStatus = 'success' | 'failed' | 'pending';

export interface Transaction {
  hash: string;
  type: TransactionType;
  from: string;
  to: string;
  amount: string;
  timestamp: number;
  status: TransactionStatus;
  blockNumber?: number;
  gasUsed?: string;
}

export interface TransactionFilters {
  type: 'all' | TransactionType;
  search: string;
}

export interface PaginationState {
  page: number;
  limit: number;
  total: number;
}

export type FilterType = 'all' | TransactionType;