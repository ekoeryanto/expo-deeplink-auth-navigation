/**
 * If you are not familiar with React Navigation, refer to the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from '@react-navigation/native';
import { useURL } from 'expo-linking';
import * as React from 'react';
import { ColorSchemeName, InteractionManager } from 'react-native';

import { DeepLinkEnum, useDeepLinks } from '../hooks/useDeepLinks';
import { checkDeepLinkResult, navigationRef } from './linking';
import RootNavigator from './RootNavigator';

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
      theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <RootNavigator />
    </NavigationContainer>
  );
}
