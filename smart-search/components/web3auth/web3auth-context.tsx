"use client"

import React, { createContext, useContext, useState, useEffect } from 'react';
import { IProvider } from "@web3auth/base";
import { Web3Auth } from "@web3auth/modal";
import { web3auth } from './web3auth-config';
const ADMIN_EMAILS = process.env.NEXT_PUBLIC_ADMIN_EMAILS?.split(",") || [];

interface Web3AuthContextType {
  provider: IProvider | null;
  setProvider: React.Dispatch<React.SetStateAction<IProvider | null>>;
  web3auth: Web3Auth | null;
  isLoggedIn: boolean;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
}

const Web3AuthContext = createContext<Web3AuthContextType | undefined>(undefined);

export const Web3AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [provider, setProvider] = useState<IProvider | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        await web3auth.initModal();
        setProvider(web3auth.provider);
        setIsLoggedIn(web3auth.connected);
      } catch (error) {
        console.error(error);
      }
    };

    init();
  }, []);

  return (
    <Web3AuthContext.Provider value={{ provider, setProvider, web3auth, isLoggedIn, setIsLoggedIn }}>
      {children}
    </Web3AuthContext.Provider>
  );
};

export const useWeb3Auth = () => {
  const context = useContext(Web3AuthContext);
  if (context === undefined) {
    throw new Error('useWeb3Auth must be used within a Web3AuthProvider');
  }
  return context;
};