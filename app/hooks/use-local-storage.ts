import { useState, useEffect } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);

      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue] as const;
}

export const storageKeys = {
  TRANSACTIONS: 'cashflow_transactions',
  BUDGETS: 'cashflow_budgets',
  FINANCIAL_GOALS: 'cashflow_financial_goals',
  APP_VERSION: 'cashflow_app_version',
} as const;

export function clearAllData() {
  if (typeof window !== 'undefined') {
    Object.values(storageKeys).forEach(key => {
      window.localStorage.removeItem(key);
    });
  }
}

export function exportAllData() {
  if (typeof window === 'undefined') return null;

  try {
    const data = {
      transactions: JSON.parse(window.localStorage.getItem(storageKeys.TRANSACTIONS) || '[]'),
      budgets: JSON.parse(window.localStorage.getItem(storageKeys.BUDGETS) || '[]'),
      financialGoals: JSON.parse(window.localStorage.getItem(storageKeys.FINANCIAL_GOALS) || '[]'),
      exportDate: new Date().toISOString(),
      appVersion: window.localStorage.getItem(storageKeys.APP_VERSION) || '0.2.0',
    };
    return data;
  } catch (error) {
    console.error('Error exporting data:', error);
    return null;
  }
}

export function importAllData(data: any) {
  if (typeof window === 'undefined') return false;

  try {
    if (data.transactions) {
      window.localStorage.setItem(storageKeys.TRANSACTIONS, JSON.stringify(data.transactions));
    }
    if (data.budgets) {
      window.localStorage.setItem(storageKeys.BUDGETS, JSON.stringify(data.budgets));
    }
    if (data.financialGoals) {
      window.localStorage.setItem(storageKeys.FINANCIAL_GOALS, JSON.stringify(data.financialGoals));
    }
    return true;
  } catch (error) {
    console.error('Error importing data:', error);
    return false;
  }
}
