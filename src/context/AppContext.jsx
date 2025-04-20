import React, { createContext, useState } from "react";

export const AppContext = createContext();

const AppProvider = ({ children }) => {
  const [uploadedFile, setUploadedFile] = useState(null);

  return (
    <AppContext.Provider value={{ uploadedFile, setUploadedFile }}>
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;
