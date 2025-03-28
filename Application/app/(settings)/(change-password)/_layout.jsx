import { Stack } from "expo-router";
import "@/global.css"

export default function RootLayout() {
    return (
        <Stack>
           <Stack.Screen name="change-password" options={{
            headerShown: true,
            headerTransparent: true,
            headerTitle: 'Change Password',
            headerTitleAlign: 'center',
            headerBlurEffect: 'regular',
            }}/>
           <Stack.Screen name="forgot-password" options={{
            headerShown: true,
            headerTransparent: true,
            headerTitle: 'Forgot Password',
            headerTitleAlign: 'center',
            headerBlurEffect: 'regular',
            }}/>
           <Stack.Screen name="reset-token" options={{
            headerShown: true,
            headerTransparent: true,
            headerTitle: 'Reset Password Token',
            headerTitleAlign: 'center',
            headerBlurEffect: 'regular',
            }}/>
           <Stack.Screen name="reset-password" options={{
            headerShown: true,
            headerTransparent: true,
            headerTitle: 'Reset Password',
            headerTitleAlign: 'center',
            headerBlurEffect: 'regular',
            }}/>
        </Stack>
    )
}