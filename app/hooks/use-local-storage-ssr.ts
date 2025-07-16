import { useState, useEffect, useRef } from 'react';

export function useLocalStorageSSR<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const [isLoaded, setIsLoaded] = useState(false);
  const initialValueRef = useRef(initialValue);

  useEffect(() => {
    initialValueRef.current = initialValue;
  }, [initialValue]);

  useEffect(() => {
    setIsLoaded(false);
  }, [key]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const item = window.localStorage.getItem(key);
        if (item) {
          setStoredValue(JSON.parse(item));
        } else {
          setStoredValue(initialValueRef.current);
        }
      } catch (error) {
        console.error(`Error reading localStorage key "${key}":`, error);
        setStoredValue(initialValueRef.current);
      } finally {
        setIsLoaded(true);
      }
    } else {
      setIsLoaded(true);
    }
  }, [key]);

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

  return [storedValue, setValue, isLoaded] as const;
}
