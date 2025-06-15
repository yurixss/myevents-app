import React, { createContext, useContext, useState } from 'react';
import { BudgetRequest, Proposal } from '@/types';
import { mockBudgetRequests, mockProposals } from '@/utils/mockData';

interface DataContextType {
  budgetRequests: BudgetRequest[];
  proposals: Proposal[];
  createBudgetRequest: (request: Omit<BudgetRequest, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateBudgetRequest: (id: string, updates: Partial<BudgetRequest>) => void;
  createProposal: (proposal: Omit<Proposal, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateProposal: (id: string, updates: Partial<Proposal>) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [budgetRequests, setBudgetRequests] = useState<BudgetRequest[]>(mockBudgetRequests);
  const [proposals, setProposals] = useState<Proposal[]>(mockProposals);

  const createBudgetRequest = (request: Omit<BudgetRequest, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newRequest: BudgetRequest = {
      ...request,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setBudgetRequests(prev => [newRequest, ...prev]);
  };

  const updateBudgetRequest = (id: string, updates: Partial<BudgetRequest>) => {
    setBudgetRequests(prev => 
      prev.map(request => 
        request.id === id 
          ? { ...request, ...updates, updatedAt: new Date().toISOString() }
          : request
      )
    );
  };

  const createProposal = (proposal: Omit<Proposal, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newProposal: Proposal = {
      ...proposal,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setProposals(prev => [newProposal, ...prev]);
  };

  const updateProposal = (id: string, updates: Partial<Proposal>) => {
    setProposals(prev => 
      prev.map(proposal => 
        proposal.id === id 
          ? { ...proposal, ...updates, updatedAt: new Date().toISOString() }
          : proposal
      )
    );
  };

  return (
    <DataContext.Provider value={{
      budgetRequests,
      proposals,
      createBudgetRequest,
      updateBudgetRequest,
      createProposal,
      updateProposal
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}