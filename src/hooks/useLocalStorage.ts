import { useState, useEffect } from "react";

function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, React.Dispatch<React.SetStateAction<T>>, boolean] {
  // Initialize state with a function to avoid re-parsing localStorage on every render
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item !== null ? (JSON.parse(item) as T) : initialValue;
    } catch (error) {
      console.error("Error reading localStorage:", error);
      return initialValue;
    } finally {
      // This ensures isLoading is false even if an error occurs during initialization
      setIsLoading(false);
    }
  });

  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Write to localStorage when storedValue or key changes
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.error("Error writing to localStorage:", error);
    }
  }, [storedValue]);

  return [storedValue, setStoredValue, isLoading];
}

export default useLocalStorage;
