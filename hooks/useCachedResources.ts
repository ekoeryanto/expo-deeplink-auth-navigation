import Constants from 'expo-constants';
import { Ionicons } from '@expo/vector-icons';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { enableScreens } from 'react-native-screens';
import { initializeApp } from 'firebase/app';
import { initializeAuth } from 'firebase/auth';
import { getReactNativePersistence } from 'firebase/auth/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function useCachedResources() {
  const [isLoadingComplete, setLoadingComplete] = useState(false);

  // Load any resources or data that we need prior to rendering the app
  useEffect(() => {
    async function loadResourcesAndDataAsync() {
      try {
        SplashScreen.preventAutoHideAsync();

        enableScreens(true);

        const app = initializeApp(Constants.manifest?.web?.config?.firebase!);
        const auth = initializeAuth(app, {
          persistence: getReactNativePersistence(AsyncStorage),
        });
        auth.useDeviceLanguage();

        // Listen to auth ready
        await new Promise((resolve) => {
          const authListener = auth.onAuthStateChanged((user) => {
            resolve(user);
            console.log('Firebase Auth is ready');
            authListener();
          });
        });

        // Load fonts
        await Font.loadAsync({
          ...Ionicons.font,
          'space-mono': require('../assets/fonts/SpaceMono-Regular.ttf'),
        });
      } catch (e) {
        // We might want to provide this error information to an error reporting service
        console.warn(e);
      } finally {
        setLoadingComplete(true);
        SplashScreen.hideAsync();
      }
    }

    loadResourcesAndDataAsync();
  }, []);

  return isLoadingComplete;
}
