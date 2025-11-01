import React, { createContext, useState } from 'react';

const initialHistory = [];

export const LaporanContext = createContext();

export const LaporanProvider = ({ children }) => {
  const [uploadHistory, setUploadHistory] = useState(initialHistory);

  return (
    <LaporanContext.Provider value={{ uploadHistory, setUploadHistory }}>
      {children}
    </LaporanContext.Provider>
  );
};
