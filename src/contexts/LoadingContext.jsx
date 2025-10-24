import {
  createContext,
  useState,
  useContext,
  useMemo,
  useCallback,
} from 'react';

// 1. Buat Context
const LoadingContext = createContext(null);

// 2. Buat Provider (Komponen yang akan membungkus aplikasi Anda)
export function LoadingProvider({ children }) {
  const [isLoading, setIsLoading] = useState(false);

  // Gunakan useCallback agar fungsi tidak dibuat ulang setiap render
  const showLoading = useCallback(() => setIsLoading(true), []);
  const hideLoading = useCallback(() => setIsLoading(false), []);

  // Gunakan useMemo agar nilai context stabil
  const value = useMemo(
    () => ({ isLoading, showLoading, hideLoading }),
    [isLoading, showLoading, hideLoading]
  );

  return (
    <LoadingContext.Provider value={value}>{children}</LoadingContext.Provider>
  );
}

// 3. Buat Hook kustom untuk mempermudah penggunaan
export function useLoading() {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading harus digunakan di dalam LoadingProvider');
  }
  return context;
}
