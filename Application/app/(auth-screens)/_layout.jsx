import { Stack } from "expo-router";
import "../../global.css"

export default function RootLayout() {
  return ( 
  <Stack>
    <Stack.Screen name="(tabs)" options={{headerShown: false}}/>
    <Stack.Screen name="signin" options={{headerShown: false}}/>
    <Stack.Screen name="signup" options={{headerShown: false}}/>
  </Stack>
  )
}
