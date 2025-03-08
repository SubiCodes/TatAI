import { Stack } from "expo-router";
import "../../global.css"

import { BlurView } from "expo-blur";
import HeaderContactUs from "@/components/header-contactus.jsx";

export default function RootLayout() {
  return ( 
  <Stack>
    <Stack.Screen name="(tabs)" options={{headerShown: false}}/>
    <Stack.Screen name="signin" options={{
        headerShown: true,
        headerTransparent: true,
        headerTitle: '',
        headerBlurEffect: 'regular',
        headerRight: () => (
            <HeaderContactUs/>
          ),
        }}/>
    <Stack.Screen name="forgot-password" options={{ 
        headerShown: true,
        headerTransparent: true,
        headerTitle: '',
        headerBlurEffect: 'regular',
        headerRight: () => (
            <HeaderContactUs/>
          ),}}/>
    <Stack.Screen name="reset-token" options={{ 
        headerShown: true,
        headerTransparent: true,
        headerTitle: '',
        headerBlurEffect: 'regular',
        headerRight: () => (
            <HeaderContactUs />
          ),}}/>
    <Stack.Screen name="reset-password" options={{ 
        headerShown: true,
        headerTransparent: true,
        headerTitle: '',
        headerBlurEffect: 'regular',
        headerRight: () => (
            <HeaderContactUs/>
          ),}}/>
    <Stack.Screen name="signup" options={{ 
        headerShown: true,
        headerTransparent: true,
        headerTitle: '',
        headerBlurEffect: 'regular',
        headerRight: () => (
            <HeaderContactUs/>
          ),}}/>
    <Stack.Screen name="contactus" options={{ 
        headerShown: true,
        headerTransparent: true,
        headerTitle: 'Contact Us',
        headerBlurEffect: 'regular',}}/>
  </Stack>
  )
}
