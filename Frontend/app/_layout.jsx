import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="initial-screen" options={{ headerShown: true }} />
      <Stack.Screen name="signin" options={{ headerShown: true }} />
      <Stack.Screen name="signup" options={{ headerShown: true }} />
    </Stack>
  );
}