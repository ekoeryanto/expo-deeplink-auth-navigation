import deepMerge from 'deepmerge';
import { ExpoConfig, ConfigContext } from '@expo/config';

export default ({ config }: ConfigContext): ExpoConfig =>
  deepMerge(config, {
    name: 'Deep Throttle',
    slug: 'deepthrottle',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/images/icon.png',
    scheme: 'deepthrottle',
    userInterfaceStyle: 'automatic',
    splash: {
      image: './assets/images/splash.png',
      resizeMode: 'contain',
      backgroundColor: '#ffffff',
    },
    updates: {
      fallbackToCacheTimeout: 0,
    },
    assetBundlePatterns: ['**/*'],
    ios: {
      supportsTablet: true,
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/images/adaptive-icon.png',
        backgroundColor: '#ffffff',
      },
    },
    web: {
      favicon: './assets/images/favicon.png',
      config: {
        firebase: {
          apiKey: 'AIzaSyC2xOcq3ik9eI_9Kw2qJKlxwTc3FUSYW_s',
          authDomain: 'rena-6b565.firebaseapp.com',
          projectId: 'rena-6b565',
          storageBucket: 'rena-6b565.appspot.com',
          messagingSenderId: '1025557623063',
          appId: '1:1025557623063:web:391de90fe4a7a61d1e4752',
          measurementId: 'G-PRGZM2Y1QG',
        },
      },
    },
  });
