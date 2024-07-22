import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { getMsalInstance } from './authConfig';
import { AccountInfo, SilentRequest, PopupRequest } from '@azure/msal-browser';

interface AuthContextType {
  account: AccountInfo | null;
  login: () => Promise<void>;
  logout: () => void;
  isInitialized: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [account, setAccount] = useState<AccountInfo | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initializeMsal = async () => {
      try {
        const msalInstance = await getMsalInstance();
        setIsInitialized(true);

        const accounts = msalInstance.getAllAccounts();
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          const silentRequest: SilentRequest = {
            account: accounts[0],
            scopes: ['openid', 'profile', 'User.Read'],
          };

          msalInstance
            .acquireTokenSilent(silentRequest)
            .then((response) => {
              setAccount(response.account);
            })
            .catch((error) => {
              console.error('Silent token acquisition failed:', error);
            });
        }
      } catch (error) {
        console.error('MSAL initialization failed:', error);
      }
    };

    initializeMsal();
  }, []);

  const login = async () => {
    if (!isInitialized) {
      console.log('MSAL not initialized');
      return;
    }

    try {
      const msalInstance = await getMsalInstance();
      const loginRequest: PopupRequest = {
        scopes: ['openid', 'profile', 'User.Read'],
      };
      const loginResponse = await msalInstance.loginPopup(loginRequest);
      setAccount(loginResponse.account);
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      if (error.errorCode === 'user_cancelled') {
        console.warn('User cancelled the login flow.');
      } else {
        console.error('Login error:', error);
      }
    }
  };

  const logout = async () => {
    if (!isInitialized) {
      console.log('MSAL not initialized');
      return;
    }

    try {
      const msalInstance = await getMsalInstance();
      await msalInstance.logoutPopup();
      setAccount(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ account, login, logout, isInitialized }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
