import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';
import { DeepLinkProvider } from './providers/DeepLinkProvider';
import { AuthenticationProvider } from './providers/AuthenticationProvider';
import { useEffect } from 'react';
import { openURL, useURL } from 'expo-linking';

// initializeApp(Constants.manifest?.web?.config?.firebase!);

export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  const url = useURL();
  useEffect(() => {
    if (url) {
      openURL(url);
    }
  }, [url]);

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <DeepLinkProvider>
        <AuthenticationProvider>
          <SafeAreaProvider>
            <Navigation colorScheme={colorScheme} />
          </SafeAreaProvider>
          <StatusBar />
        </AuthenticationProvider>
      </DeepLinkProvider>
    );
  }
}
