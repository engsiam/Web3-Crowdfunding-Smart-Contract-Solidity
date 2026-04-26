'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

interface LaunchCampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLaunch: (title: string, description: string, goalAmount: string, minContribution: string, durationInDays: number) => Promise<void>;
  isLoading: boolean;
}

export function LaunchCampaignModal({ isOpen, onClose, onLaunch, isLoading }: LaunchCampaignModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [goalAmount, setGoalAmount] = useState('');
  const [minContribution, setMinContribution] = useState('');
  const [durationInDays, setDurationInDays] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !goalAmount || !minContribution || !durationInDays) return;
    
    await onLaunch(title, description, goalAmount, minContribution, parseInt(durationInDays));
    setTitle('');
    setDescription('');
    setGoalAmount('');
    setMinContribution('');
    setDurationInDays('');
  };

  const isValid = title.trim() && description.trim() && goalAmount && minContribution && durationInDays && parseInt(durationInDays) > 0;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg mx-4 p-6 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-zinc-100 flex items-center gap-2">
            <svg className="w-6 h-6 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Launch Campaign
          </h2>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-zinc-800 rounded-lg transition-colors text-zinc-400 hover:text-zinc-200"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            type="text"
            placeholder="Enter campaign title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            label="Campaign Title"
          />
          
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-2">Description</label>
            <textarea
              placeholder="Describe your campaign goals and vision..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 rounded-xl bg-zinc-800/60 border border-zinc-700/50 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all duration-300"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <Input
              type="number"
              step="0.01"
              min="0.01"
              placeholder="10"
              value={goalAmount}
              onChange={(e) => setGoalAmount(e.target.value)}
              label="Goal (ETH)"
            />
            <Input
              type="number"
              step="0.001"
              min="0.001"
              placeholder="0.01"
              value={minContribution}
              onChange={(e) => setMinContribution(e.target.value)}
              label="Min Contribution (ETH)"
            />
          </div>
          
          <Input
            type="number"
            min="1"
            max="365"
            placeholder="30"
            value={durationInDays}
            onChange={(e) => setDurationInDays(e.target.value)}
            label="Duration (days)"
          />
          
          <div className="flex gap-3 pt-2">
            <Button 
              type="button"
              variant="ghost"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              isLoading={isLoading}
              disabled={!isValid}
              className="flex-1"
            >
              Launch Campaign
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}