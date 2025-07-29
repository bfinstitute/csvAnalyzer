// src/components/CsvContext.jsx
import React, { createContext, useState, useContext } from 'react';

const CsvContext = createContext();

export function CsvProvider({ children }) {
  const [csvData, setCsvData] = useState([]);
  const [fileName, setFileName] = useState('');

  return (
    <CsvContext.Provider value={{ csvData, setCsvData, fileName, setFileName }}>
      {children}
    </CsvContext.Provider>
  );
}

// Custom hook for convenience
export function useCsv() {
  return useContext(CsvContext);
}
