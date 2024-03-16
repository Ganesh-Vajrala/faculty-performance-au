// HeaderContext.js
import React, { createContext, useContext, useState } from 'react';

const HeaderContext = createContext();

export const HeaderProvider = ({ children }) => {
  const [headerData, setHeaderData] = useState({});

  const updateHeaderData = (data) => {
    setHeaderData(data);
  };

  return (
    <HeaderContext.Provider value={{ headerData, updateHeaderData }}>
      {children}
    </HeaderContext.Provider>
  );
};

export const useHeaderContext = () => {
  const context = useContext(HeaderContext);
  if (!context) {
    throw new Error('useHeaderContext must be used within a HeaderProvider');
  }
  return context;
};
