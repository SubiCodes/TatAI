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
        </Stack>
    )
}