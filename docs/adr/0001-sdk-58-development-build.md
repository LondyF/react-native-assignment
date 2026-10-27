# Expo SDK 58 in a development build, not Expo Go

We run Expo SDK 58 (React Native 0.88, React 19.3) in a development build (`bun run ios`). The SDK 58 Expo Go is not in the stores yet, and the store Expo Go supports one SDK at a time, so an SDK 57 project would stop opening in it once the new one ships. `react-native-mmkv` v4 is a native module that Expo Go doesn't bundle, so a development build is needed regardless of SDK.

## Considered Options

- **SDK 57 in Expo Go**: reviewers scan a QR code, but the project breaks when the store Expo Go moves to SDK 58, and it rules out MMKV.
- **SDK 58 with only Expo Go-compatible libraries**: would force `expo-sqlite/kv-store` (async, see [ADR 0002](0002-zustand-store-persisted-to-mmkv.md)) for a benefit that is only theoretical until Expo Go ships.

## Consequences

- Reviewers need Xcode (or Android Studio) and a local native build. The README must document this.
- SDK 58 tooling rejects odd-numbered Node releases, so Node is pinned to 24 LTS in `.nvmrc`.
- The development build's launcher only auto-discovers Metro on port 8081. If that port is taken, open the app with `workoutplayer://expo-development-client/?url=http%3A%2F%2Flocalhost%3A<port>`.
