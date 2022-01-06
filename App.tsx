import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';
import { DeepLinkProvider } from './providers/DeepLinkProvider';
import { AuthProvider } from './providers/Auth';
import { Centralize } from './components/Themed';
import { ActivityIndicator } from 'react-native';

export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  if (!isLoadingComplete) {
    return (
      <Centralize>
        <ActivityIndicator size="large" color={'red'} />
      </Centralize>
    );
  } else {
    return (
      <DeepLinkProvider>
        <AuthProvider>
          <SafeAreaProvider>
            <Navigation colorScheme={colorScheme} />
            <StatusBar />
          </SafeAreaProvider>
        </AuthProvider>
      </DeepLinkProvider>
    );
  }
}
