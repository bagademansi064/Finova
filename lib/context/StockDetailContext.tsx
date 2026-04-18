"use client"

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface StockDetailContextType {
  isOpen: boolean;
  symbol: string | null;
  openStockDetail: (symbol: string) => void;
  closeStockDetail: () => void;
}

const StockDetailContext = createContext<StockDetailContextType | undefined>(undefined);

export function StockDetailProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [symbol, setSymbol] = useState<string | null>(null);

  const openStockDetail = (newSymbol: string) => {
    setSymbol(newSymbol);
    setIsOpen(true);
  };

  const closeStockDetail = () => {
    setIsOpen(false);
    // Don't clear symbol immediately to allow animations to finish
  };

  return (
    <StockDetailContext.Provider value={{ isOpen, symbol, openStockDetail, closeStockDetail }}>
      {children}
    </StockDetailContext.Provider>
  );
}

export function useStockDetail() {
  const context = useContext(StockDetailContext);
  if (context === undefined) {
    throw new Error('useStockDetail must be used within a StockDetailProvider');
  }
  return context;
}
