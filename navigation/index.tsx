/**
 * If you are not familiar with React Navigation, refer to the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
  getPathFromState,
  NavigationState,
  getStateFromPath,
  PartialState,
  getActionFromState,
  NavigationAction,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useURL } from 'expo-linking';
import * as React from 'react';
import { ColorSchemeName, InteractionManager } from 'react-native';
import * as Linking from 'expo-linking';

import { DeepLinkEnum, useDeepLinks } from '../hooks/useDeepLinks';
import { AuthenticationContext } from '../providers/AuthenticationProvider';

import ModalScreen from '../screens/ModalScreen';
import NotFoundScreen from '../screens/NotFoundScreen';
import { RootStackParamList } from '../types';
import { AppStack } from './AppStack';
import { linking, navigationRef } from './linking';
import { OnboardingStack } from './OnboardingStack';

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

export default function Navigation({
  colorScheme,
}: {
  colorScheme: ColorSchemeName;
}) {
  const { addDeepLink } = useDeepLinks();
  const link = useURL();

  const handleDeepLink = React.useCallback(
    (url: string) => {
      const task = InteractionManager.runAfterInteractions(() => {
        const { didDeepLinkLand, action, linkPath } = checkDeepLinkResult(url);
        if (!didDeepLinkLand) {
          addDeepLink({
            id: linkPath as string,
            type: DeepLinkEnum.NAVIGATION,
            action: () => navigationRef.current?.dispatch(action),
          });
        }
      });

      return () => task.cancel();
    },
    [addDeepLink]
  );

  React.useEffect(() => {
    if (!link) {
      return;
    }

    handleDeepLink(link);
  }, [link, handleDeepLink]);

  return (
    <NavigationContainer
      ref={navigationRef}
      linking={linking}
      theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <RootNavigator />
    </NavigationContainer>
  );
}

/**
 * A root stack navigator is often used for displaying modals on top of all other content.
 * https://reactnavigation.org/docs/modal
 */
const Stack = createNativeStackNavigator<RootStackParamList>();

function RootNavigator() {
  const { isAuthenticated } = React.useContext(AuthenticationContext);

  return (
    <Stack.Navigator>
      {isAuthenticated ? (
        <Stack.Screen
          name="Root"
          component={AppStack}
          options={{ headerShown: false }}
        />
      ) : (
        <Stack.Screen
          name="OnBoarding"
          component={OnboardingStack}
          options={{ headerShown: false }}
        />
      )}

      <Stack.Screen
        name="NotFound"
        component={NotFoundScreen}
        options={{ title: 'Oops!' }}
      />
      <Stack.Group
        screenOptions={{ presentation: 'modal', headerShown: false }}>
        <Stack.Screen name="Modal" component={ModalScreen} />
      </Stack.Group>
    </Stack.Navigator>
  );
}
