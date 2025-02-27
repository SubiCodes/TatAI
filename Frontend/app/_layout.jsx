import { Stack } from "expo-router";
import { useColorScheme } from "react-native";

import { Colors } from "@/constants/Color";

export default function RootLayout() {

  const colorScheme = useColorScheme();
  const themeColors = Colors['light']

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="initial-screen" options={{ headerShown: true }} />
      <Stack.Screen name="signin-landing" options={{ headerShown: false }} />
      <Stack.Screen name="signin" options={{ headerShown: true,  headerTitle: 'Sign In',  headerTransparent: true, 
          headerStyle: { backgroundColor: 'transparent' },}} />
      <Stack.Screen name="signup" options={{ headerShown: false }} />
    </Stack>
  );
}