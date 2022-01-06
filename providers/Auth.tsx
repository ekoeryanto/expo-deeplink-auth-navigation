import React, {
  createContext,
  useState,
  FunctionComponent,
  useEffect,
  useContext,
} from 'react';
import { getAuth } from 'firebase/auth';

export interface IAuthenticationContext {
  isAuthenticated: boolean;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
}

export const AuthContext = createContext<IAuthenticationContext>({
  isAuthenticated: false,
  setIsAuthenticated: () => {},
});

export const AuthProvider: FunctionComponent<unknown> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const unsubscribe = getAuth().onAuthStateChanged((signed) => {
      setIsAuthenticated(signed !== null);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}
