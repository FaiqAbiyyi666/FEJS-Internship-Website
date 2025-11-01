import {
  createContext,
  useState,
  useContext,
  useMemo,
  useCallback,
} from 'react';

const LoadingContext = createContext(null);

export function LoadingProvider({ children }) {
  const [isLoading, setIsLoading] = useState(false);

  const showLoading = useCallback(() => setIsLoading(true), []);
  const hideLoading = useCallback(() => setIsLoading(false), []);

  const value = useMemo(
    () => ({ isLoading, showLoading, hideLoading }),
    [isLoading, showLoading, hideLoading]
  );

  return (
    <LoadingContext.Provider value={value}>{children}</LoadingContext.Provider>
  );
}

export function useLoading() {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading harus digunakan di dalam LoadingProvider');
  }
  return context;
}
