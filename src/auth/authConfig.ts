import { PublicClientApplication, Configuration } from '@azure/msal-browser';

let msalConfig: Configuration | null = null;

export const fetchConfig = async (): Promise<Configuration> => {
  const response = await fetch(`/api/auth-config`);
  if (!response.ok) {
    throw new Error(`Failed to fetch config: ${response.statusText}`);
  }
  const config = await response.json();
  const dynamicRedirectUri = window.location.origin;

  msalConfig = {
    auth: {
      clientId: config.clientId,
      authority: config.tenantId,
      redirectUri: dynamicRedirectUri,
    },
    cache: {
      cacheLocation: 'localStorage',
      storeAuthStateInCookie: true,
    },
  };

  console.log('Fetched msalConfig: ', msalConfig);
  return msalConfig;
};

let msalInstance: PublicClientApplication | null = null;
let msalInitializationPromise: Promise<void> | null = null;

export const getMsalInstance = async (): Promise<PublicClientApplication> => {
  if (!msalInstance) {
    const config = await fetchConfig();
    msalInstance = new PublicClientApplication(config);
    msalInitializationPromise = msalInstance.initialize();
    await msalInitializationPromise;
    console.log('MSAL instance initialized successfully.');
  } else if (msalInitializationPromise) {
    await msalInitializationPromise;
  }
  return msalInstance;
};
