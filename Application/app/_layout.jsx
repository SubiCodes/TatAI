import { Stack } from "expo-router";
import "../global.css";
import { StatusBar } from "react-native";
import { useColorScheme } from "nativewind";

export default function RootLayout() {
  const { colorScheme, toggleColorScheme } = useColorScheme();
  const statusBarColor = colorScheme === "dark" ? "black" : "white";
  return (
    <>
      <StatusBar backgroundColor={colorScheme} translucent={false} />
      <Stack>
        <Stack.Screen name="(auth-screens)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(settings)" options={{ headerShown: false }} />
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="guide" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ headerShown: false }} />
        <Stack.Screen name="user" options={{ headerShown: false }} />
        <Stack.Screen name="saved" options={{ headerShown: false }} />
        <Stack.Screen name="my-guides" options={{ headerShown: false }} />
        <Stack.Screen name="legals" options={{ headerShown: false }} />
      </Stack>
    </>
  );
}
