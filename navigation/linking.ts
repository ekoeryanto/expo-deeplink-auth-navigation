/**
 * Learn more about deep linking with React Navigation
 * https://reactnavigation.org/docs/deep-linking
 * https://reactnavigation.org/docs/configuring-links
 */

import {
  createNavigationContainerRef,
  getActionFromState,
  getPathFromState,
  getStateFromPath,
  LinkingOptions,
  NavigationAction,
  NavigationState,
  PartialState,
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
          SignIn: '',
          SignUp: 'create',
        },
      },
      App: {
        path: '',
        screens: {
          Tabs: {
            path: 'tab',
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
          Profile: 'profile',
        },
      },
      Modal: 'modal',
      NotFound: '*',
    },
  },
};

export const getPathFromURL = (url: string) => {
  const parsedURL = Linking.parse(url);
  if (!parsedURL.path) {
    return '/';
  }

  return url.slice(url.indexOf(parsedURL.path) - 1);
};

export const checkDeepLinkResult = (url: string) => {
  const extractedUrl = getPathFromURL(url);

  const currentState = navigationRef.current?.getRootState() as NavigationState;
  const currentPath = getPathFromState(currentState);

  const linkState = getStateFromPath(
    extractedUrl,
    linking.config
  ) as PartialState<NavigationState>;
  const linkPath = getPathFromState(
    linkState || navigationRef.current?.getState()
  );

  const action = getActionFromState(linkState) as NavigationAction;
  return {
    action,
    linkPath,
    didDeepLinkLand: currentPath === linkPath,
  };
};
