import { createMMKV } from 'react-native-mmkv';
import type { StateStorage } from 'zustand/middleware';

const storage = createMMKV({ id: 'workout-player' });

export const mmkvStateStorage: StateStorage = {
  getItem: (key) => storage.getString(key) ?? null,
  setItem: (key, value) => storage.set(key, value),
  removeItem: (key) => {
    storage.remove(key);
  },
};
