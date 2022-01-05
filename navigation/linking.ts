/**
 * Learn more about deep linking with React Navigation
 * https://reactnavigation.org/docs/deep-linking
 * https://reactnavigation.org/docs/configuring-links
 */

import {
  createNavigationContainerRef,
  LinkingOptions,
} from '@react-navigation/native';
import * as Linking from 'expo-linking';

import { RootStackParamList } from '../types';

export const navigationRef = createNavigationContainerRef();

export const linking: LinkingOptions<RootStackParamList> = {
  prefixes: [Linking.createURL('/')],
  config: {
    screens: {
      OnBoarding: {
        path: 'session',
        screens: {
          SignIn: 'enter',
          SignUp: 'create',
        },
      },
      Root: {
        path: '',
        initialRouteName: 'TabOne',
        screens: {
          TabOne: {
            screens: {
              TabOneScreen: 'one',
            },
          },
          TabTwo: {
            screens: {
              TabTwoScreen: 'two',
            },
          },
        },
      },
      Modal: 'modal',
      NotFound: '*',
    },
  },
};
