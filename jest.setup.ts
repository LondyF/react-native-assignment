jest.mock('react-native-mmkv', () => {
  const stores = new Map<string, Map<string, string>>();

  return {
    createMMKV: ({ id = 'default' }: { id?: string } = {}) => {
      const store = stores.get(id) ?? new Map<string, string>();
      stores.set(id, store);

      return {
        getString: (key: string) => store.get(key),
        set: (key: string, value: string) => {
          store.set(key, value);
        },
        remove: (key: string) => store.delete(key),
        clearAll: () => store.clear(),
      };
    },
  };
});
