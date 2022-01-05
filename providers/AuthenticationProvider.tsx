import React, {
  createContext,
  useState,
  FunctionComponent,
  useEffect,
} from 'react';
import { getAuth } from 'firebase/auth';

export interface IAuthenticationContext {
  isAuthenticated: boolean;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
}

export const AuthenticationContext = createContext<IAuthenticationContext>({
  isAuthenticated: false,
  setIsAuthenticated: () => {},
});

export const AuthenticationProvider: FunctionComponent<unknown> = ({
  children,
}) => {
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
    <AuthenticationContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
      }}>
      {children}
    </AuthenticationContext.Provider>
  );
};
