import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [signedIn, setSignedIn] = useState(false);

  return (
    <AuthContext.Provider value={{ signedIn, setSignedIn }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
