import { Stack } from "expo-router";
import "../global.css"

export default function RootLayout() {
  return ( 
  <Stack>
    <Stack.Screen name="(auth-screens)" options={{headerShown: false}}/>
    <Stack.Screen name="(tabs)" options={{headerShown: false}}/>
    <Stack.Screen name="(settings)" options={{headerShown: false}}/>
    <Stack.Screen name="index" options={{headerShown: false}}/>
    <Stack.Screen name="guide" options={{headerShown: false}}/>
  </Stack>
  )
}
