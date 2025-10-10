import React, { createContext, useState } from 'react';

// SIMULASI DATA AWAL DARI BACKEND
// Kita mulai dengan array kosong, sesuai permintaan Anda ("saya mau tampilannya belum terupload")
const initialHistory = [];

// 1. Buat Context
export const LaporanContext = createContext();

// 2. Buat Provider (komponen yang akan "membungkus" halaman-halaman kita)
export const LaporanProvider = ({ children }) => {
  const [uploadHistory, setUploadHistory] = useState(initialHistory);

  return (
    <LaporanContext.Provider value={{ uploadHistory, setUploadHistory }}>
      {children}
    </LaporanContext.Provider>
  );
};
