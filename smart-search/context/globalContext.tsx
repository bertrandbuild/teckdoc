"use client";

import { loadAllFromLocalStorage } from "@/utils/localStorage";
import React, { createContext, useState, useEffect } from "react";

// Specifies the structure of the global context
interface IGlobalContextType {
  isSearchOpen: boolean;
  numberRequests: number;
  selectedDemo: string;
  updateContext: (key: string, value: unknown) => void;
}

// This is the initial state of the global context (if not loaded from localStorage)
const initialLocalStorageConfig = {
  isSearchOpen: false,
  numberRequests: 0,
  selectedDemo: "nillion",
};

// Default context values
const defaultContext: IGlobalContextType = {
  isSearchOpen: false,
  numberRequests: 0,
  selectedDemo: "nillion",
  updateContext: () => {},
};

// Creates a global context with the default values and a function to update the context.
export const GlobalContext = createContext<IGlobalContextType>(defaultContext);

// Initialize the context with the default values and load from localStorage
export const GlobalProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [globalState, setGlobalState] = useState(defaultContext);

  const _saveToLocalStorage = (key: string, value: unknown) => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch (error) {
        console.error(`Failed to save ${key} to localStorage:`, error);
      }
    }
  };

  // Global function to update the context and save to localStorage
  const updateContext = (key: string, value: unknown) => {
    // Create a deep copy of the current state to prevent unintentional mutations
    setGlobalState((prevState) => {
      const newState = { ...prevState, [key]: value };

      // If the value is null or undefined, delete it from the localStorage
      if (value === null || value === undefined) {
        localStorage.removeItem(key);
      } else {
        _saveToLocalStorage(key, value);
      }

      return newState;
    });
  };

  // Initialize the context with the default values and load from localStorage
  useEffect(() => {
    const loadedState = loadAllFromLocalStorage(initialLocalStorageConfig);
    // Init state by loading from localStorage
    setGlobalState((prevState) => ({
      ...prevState,
      ...loadedState,
    }));
  }, []);

  return (
    <GlobalContext.Provider value={{ ...globalState, updateContext }}>
      {children}
    </GlobalContext.Provider>
  );
};
