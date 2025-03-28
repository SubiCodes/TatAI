import { Stack } from "expo-router";
import "@/global.css"

export default function RootLayout() {
    return (
        <Stack>
           <Stack.Screen name="settings-main-page" options={{
            headerShown: true,
            headerTransparent: true,
            headerTitle: 'Settings',
            headerTitleAlign: 'center',
            headerBlurEffect: 'regular',
            }}/>
           <Stack.Screen name="edit-profile" options={{
            headerShown: true,
            headerTransparent: true,
            headerTitle: '',
            headerTitleAlign: 'center',
            headerBlurEffect: 'regular',
            }}/>
           <Stack.Screen name="(change-password)" options={{
            headerShown: false,
            headerTransparent: true,
            headerTitle: '',
            headerTitleAlign: 'center',
            headerBlurEffect: 'regular',
            }}/>
            <Stack.Screen name="tone" options={{
            headerShown: true,
            headerTransparent: true,
            headerTitle: 'Tone',
            headerTitleAlign: 'center',
            headerBlurEffect: 'regular',
            }}/>
            <Stack.Screen name="tool-knowledge" options={{
            headerShown: true,
            headerTransparent: true,
            headerTitle: 'Tool Knowledge',
            headerTitleAlign: 'center',
            headerBlurEffect: 'regular',
            }}/>
            <Stack.Screen name="repair-expertise" options={{
            headerShown: true,
            headerTransparent: true,
            headerTitle: 'Repair Expertise',
            headerTitleAlign: 'center',
            headerBlurEffect: 'regular',
            }}/>
            <Stack.Screen name="preferred-name" options={{
            headerShown: true,
            headerTransparent: true,
            headerTitle: 'Preferred Name',
            headerTitleAlign: 'center',
            headerBlurEffect: 'regular',
            }}/>
        </Stack>
    )
}