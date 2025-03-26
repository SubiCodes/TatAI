import { Stack } from "expo-router";
import "../../global.css"

import { BlurView } from "expo-blur";
import HeaderContactUs from "@/components/header-contactus.jsx";
import HeaderToSignIn from "@/components/header-to-signin.jsx";

export default function RootLayout() {
  return ( 
  <Stack>
    <Stack.Screen name="signin" options={{
        headerShown: true,
        headerTransparent: true,
        headerTitle: '',
        headerBlurEffect: 'regular',
        headerRight: () => (
            <HeaderContactUs/>
          ),
        headerLeft: () => (
            null
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
    <Stack.Screen name="verify-account/[email]" options={{ 
        headerShown: true,
        headerTransparent: false,
        headerTitle: 'Verify Account',
        headerTitleAlign: 'center', 
        headerBlurEffect: 'regular',
        headerLeft: () => (
          <HeaderToSignIn/>
        ),
        headerRight: () => (
            <HeaderContactUs/>
        ),}}/>
  </Stack>
  )
}
