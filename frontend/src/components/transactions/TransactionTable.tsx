'use client';

import { useState, useCallback, useMemo } from 'react';
import { Transaction, TransactionType } from '@/types/transaction';
import { formatAddress, getEtherscanUrl, getCampaignTypeLabel } from '@/lib/transactions';

interface TransactionTableProps {
  transactions: Transaction[];
  formatAmountFn: (wei: string) => string;
  formatRelativeTime: (timestamp: number) => string;
}

function copyToClipboard(text: string): void {
  navigator.clipboard.writeText(text);
}

function getTypeColor(type: TransactionType): string {
  const colors: Record<TransactionType, string> = {
    campaign_created: 'bg-amber-500/20 text-amber-400',
    contribution: 'bg-cyan-500/20 text-cyan-400',
    funds_claimed: 'bg-green-500/20 text-green-400',
    refund: 'bg-red-500/20 text-red-400',
    deposit: 'bg-green-500/20 text-green-400',
    withdrawal: 'bg-red-500/20 text-red-400',
  };
  return colors[type] || 'bg-gray-500/20 text-gray-400';
}

function getTypeIcon(type: TransactionType) {
  switch (type) {
    case 'campaign_created':
      return (
        <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      );
    case 'contribution':
      return (
        <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    case 'funds_claimed':
      return (
        <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    case 'refund':
      return (
        <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
        </svg>
      );
    default:
      return null;
  }
}

export function TransactionTable({ transactions, formatAmountFn, formatRelativeTime }: TransactionTableProps) {
  const [copiedHash, setCopiedHash] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('all');

  const handleCopy = useCallback((hash: string) => {
    copyToClipboard(hash);
    setCopiedHash(hash);
    setTimeout(() => setCopiedHash(null), 2000);
  }, []);

  const handleRowClick = useCallback((hash: string) => {
    window.open(getEtherscanUrl(hash), '_blank');
  }, []);

  const dateGroups = useMemo(() => {
    const groups: Record<string, { campaign_created: number; contribution: number; funds_claimed: number; refund: number; txs: Transaction[] }> = {};
    
    transactions.forEach((tx) => {
      const date = new Date(tx.timestamp).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
      
      if (!groups[date]) {
        groups[date] = { campaign_created: 0, contribution: 0, funds_claimed: 0, refund: 0, txs: [] };
      }
      
      groups[date].txs.push(tx);
      if (tx.type === 'campaign_created') groups[date].campaign_created++;
      else if (tx.type === 'contribution') groups[date].contribution++;
      else if (tx.type === 'funds_claimed') groups[date].funds_claimed++;
      else if (tx.type === 'refund') groups[date].refund++;
    });
    
    return Object.entries(groups).sort((a, b) => new Date(b[0]).getTime() - new Date(a[0]).getTime());
  }, [transactions]);

  const filteredData = useMemo(() => {
    if (selectedDate === 'all') {
      return dateGroups;
    }
    return dateGroups.filter(([date]) => date === selectedDate);
  }, [dateGroups, selectedDate]);

  if (transactions.length === 0) {
    return (
      <div className="text-center py-12 text-zinc-500">
        No funding activity found
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-zinc-400 text-sm">Filter by date:</span>
          <select
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="bg-zinc-800/60 border border-zinc-700/50 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
          >
            <option value="all">All Dates ({transactions.length} transactions)</option>
            {dateGroups.map(([date, data]) => (
              <option key={date} value={date}>
                {date} ({data.txs.length} transactions)
              </option>
            ))}
          </select>
        </div>
        <div className="text-sm text-zinc-400">
          Total: <span className="text-zinc-100 font-medium">{transactions.length}</span> transactions
        </div>
      </div>

      {filteredData.map(([date, data]) => (
        <div key={date} className="space-y-2">
          <div className="flex items-center justify-between py-2 px-4 bg-zinc-800/40 rounded-lg">
            <div className="flex items-center gap-4">
              <span className="text-zinc-100 font-medium">{date}</span>
              <div className="flex items-center gap-3 text-sm">
                <span className="flex items-center gap-1 text-amber-400">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  {data.campaign_created} Created
                </span>
                <span className="flex items-center gap-1 text-cyan-400">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {data.contribution} Contributions
                </span>
                <span className="flex items-center gap-1 text-green-400">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {data.funds_claimed} Claimed
                </span>
                <span className="flex items-center gap-1 text-red-400">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                  </svg>
                  {data.refund} Refunds
                </span>
              </div>
            </div>
            <span className="text-zinc-500 text-sm">{data.txs.length} total</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-zinc-800">
                  <th className="text-left py-3 px-4 text-sm font-medium text-zinc-500">Tx Hash</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-zinc-500">Type</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-zinc-500">Donor</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-zinc-500">Amount (ETH)</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-zinc-500">Time</th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-zinc-500">Status</th>
                </tr>
              </thead>
              <tbody>
                {data.txs.map((tx) => (
                  <tr
                    key={tx.hash}
                    onClick={() => handleRowClick(tx.hash)}
                    className="border-b border-zinc-800/50 hover:bg-zinc-800/30 cursor-pointer transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2 group">
                        <span 
                          className="text-amber-400 font-mono text-sm hover:text-amber-300 transition-colors"
                          title={tx.hash}
                        >
                          {formatAddress(tx.hash)}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCopy(tx.hash);
                          }}
                          className="opacity-0 group-hover:opacity-100 p-1 hover:bg-zinc-700 rounded transition-all"
                          title={copiedHash === tx.hash ? 'Copied!' : 'Copy'}
                        >
                          {copiedHash === tx.hash ? (
                            <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          ) : (
                            <svg className="w-4 h-4 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                          )}
                        </button>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(tx.type)}`}
                      >
                        {getTypeIcon(tx.type)}
                        {getCampaignTypeLabel(tx.type)}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-zinc-300 font-mono text-sm">{formatAddress(tx.from)}</span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="font-bold text-zinc-100">
                        {formatAmountFn(tx.amount)} ETH
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="text-zinc-500 text-sm">{formatRelativeTime(tx.timestamp)}</span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400">
                        <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Success
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}