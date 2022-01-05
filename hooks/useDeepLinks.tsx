import { useEffect, useContext, useState } from 'react';
import { InteractionManager } from 'react-native';
import { navigationRef } from '../navigation/linking';

import { DeepLinkContext } from '../providers/DeepLinkProvider';

export enum DeepLinkEnum {
  NAVIGATION = 'NAVIGATION',
}

export const useDeepLinks = (deepLinks?: DeepLinkEnum[]) => {
  const [hookRoute, setHookRoute] = useState<string>();
  const [currentRoute, setCurrentRoute] = useState<string>();
  const { deepLinksState, addDeepLink, removeDeepLink } =
    useContext(DeepLinkContext);

  useEffect(() => {
    const task = InteractionManager.runAfterInteractions(() => {
      const route = navigationRef.current?.getCurrentRoute();
      if (!hookRoute) {
        setHookRoute(route?.name);
      }
    });

    const handleNavigationStateChange = () => {
      setCurrentRoute(navigationRef.current?.getCurrentRoute()?.name);
    };

    navigationRef.current?.addListener('state', handleNavigationStateChange);

    return () => {
      task.cancel();
      navigationRef.current?.removeListener(
        'state',
        handleNavigationStateChange
      );
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    (async () => {
      if (!deepLinks || hookRoute !== currentRoute) {
        return;
      }

      const cLink = deepLinksState.find(({ type }) => deepLinks.includes(type));
      if (!cLink) {
        return;
      }

      await cLink.action();
      removeDeepLink(cLink.id);
    })();
  }, [deepLinksState, hookRoute, currentRoute]); // eslint-disable-line react-hooks/exhaustive-deps

  return { addDeepLink };
};
