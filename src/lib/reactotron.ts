import Constants from 'expo-constants';
import Reactotron from 'reactotron-react-native';
import type { ReactotronReactNative } from 'reactotron-react-native';
import mmkvPlugin from 'reactotron-react-native-mmkv';
import { QueryClientManager, reactotronReactQuery } from 'reactotron-react-query';

import { queryClient } from '@/lib/query-client';
import { mmkv } from '@/lib/storage';

const globalState = globalThis as typeof globalThis & {
  __workoutPlayerReactotron?: boolean;
};

if (__DEV__ && !globalState.__workoutPlayerReactotron) {
  globalState.__workoutPlayerReactotron = true;

  const queryClientManager = new QueryClientManager({ queryClient });
  const host = Constants.expoConfig?.hostUri?.split(':')[0];

  Reactotron.configure({
    name: 'Workout Player',
    ...(host ? { host } : {}),
    onDisconnect: () => {
      queryClientManager.unsubscribe();
    },
  })
    .use(reactotronReactQuery(queryClientManager))
    .use(mmkvPlugin<ReactotronReactNative>({ storage: mmkv }))
    .useReactNative({
      asyncStorage: false,
      storybook: false,
      networking: {
        ignoreUrls: /symbolicate/,
        fetch: globalThis.fetch,
      },
    })
    .connect();
}
