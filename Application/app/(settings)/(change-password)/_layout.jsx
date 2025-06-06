import { Stack } from "expo-router";
import "@/global.css"
import { useColorScheme } from "nativewind";


export default function RootLayout() {

    const {colorScheme} = useColorScheme();

    const headerStyle = {
        backgroundColor: colorScheme === 'dark' ? 'transparent' : 'transparent', 
    };

    const headerTintColor = colorScheme === 'dark' ? '#FFFFFF' : '#000000';

    return (
        <Stack>
           <Stack.Screen name="change-password" options={{
            headerShown: true,
            headerTransparent: true,
            headerTitle: 'Change Password',
            headerTitleAlign: 'center',
            headerBlurEffect: 'regular',
            headerStyle,
            headerTintColor,
            }}/>
           <Stack.Screen name="forgot-password" options={{
            headerShown: true,
            headerTransparent: true,
            headerTitle: 'Forgot Password',
            headerTitleAlign: 'center',
            headerBlurEffect: 'regular',
            headerStyle,
            headerTintColor,
            }}/>
           <Stack.Screen name="reset-token" options={{
            headerShown: true,
            headerTransparent: true,
            headerTitle: 'Reset Password Token',
            headerTitleAlign: 'center',
            headerBlurEffect: 'regular',
            headerStyle,
            headerTintColor,
            }}/>
           <Stack.Screen name="reset-password" options={{
            headerShown: true,
            headerTransparent: true,
            headerTitle: 'Reset Password',
            headerTitleAlign: 'center',
            headerBlurEffect: 'regular',
            headerStyle,
            headerTintColor,
            }}/>
        </Stack>
    )
}