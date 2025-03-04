import { Stack } from "expo-router";
import "../../global.css"

export default function RootLayout() {
  return ( 
  <Stack>
    <Stack.Screen name="(tabs)" options={{headerShown: false}}/>
    <Stack.Screen name="signin" options={{headerShown: false}}/>
    <Stack.Screen name="forgot-password" options={{ 
        headerShown: true,
        headerTransparent: true,
        headerTitle: ''}}/>
    <Stack.Screen name="reset-token" options={{ 
        headerShown: true,
        headerTransparent: true,
        headerTitle: ''}}/>
    <Stack.Screen name="reset-password" options={{ 
        headerShown: true,
        headerTransparent: true,
        headerTitle: ''}}/>
    <Stack.Screen name="signup" options={{ 
        headerShown: true,
        headerTransparent: true,
        headerTitle: ''}}/>
  </Stack>
  )
}
