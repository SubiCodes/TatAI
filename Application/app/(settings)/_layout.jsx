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
           <Stack.Screen name="settings-main-page" options={{
            headerShown: true,
            headerTransparent: true,
            headerTitle: 'Settings',
            headerTitleAlign: 'center',
            headerBlurEffect: 'regular',
            headerStyle,
            headerTintColor,
            }}/>
           <Stack.Screen name="edit-profile" options={{
            headerShown: true,
            headerTransparent: true,
            headerTitle: '',
            headerTitleAlign: 'center',
            headerBlurEffect: 'regular',
            headerStyle,
            headerTintColor,
            }}/>
           <Stack.Screen name="(change-password)" options={{
            headerShown: false,
            headerTransparent: true,
            headerTitle: '',
            headerTitleAlign: 'center',
            headerBlurEffect: 'regular',
            headerStyle,
            headerTintColor,
            }}/>
            <Stack.Screen name="tone" options={{
            headerShown: true,
            headerTransparent: true,
            headerTitle: 'Tone',
            headerTitleAlign: 'center',
            headerBlurEffect: 'regular',
            headerStyle,
            headerTintColor,
            }}/>
            <Stack.Screen name="tool-knowledge" options={{
            headerShown: true,
            headerTransparent: true,
            headerTitle: 'Tool Knowledge',
            headerTitleAlign: 'center',
            headerBlurEffect: 'regular',
            headerStyle,
            headerTintColor,
            }}/>
            <Stack.Screen name="repair-expertise" options={{
            headerShown: true,
            headerTransparent: true,
            headerTitle: 'Repair Expertise',
            headerTitleAlign: 'center',
            headerBlurEffect: 'regular',
            headerStyle,
            headerTintColor,
            }}/>
            <Stack.Screen name="preferred-name" options={{
            headerShown: true,
            headerTransparent: true,
            headerTitle: 'Preferred Name',
            headerTitleAlign: 'center',
            headerBlurEffect: 'regular',
            headerStyle,
            headerTintColor,
            }}/>
            <Stack.Screen name="dark-mode" options={{
            headerShown: true,
            headerTransparent: true,
            headerTitle: 'Dark Mode',
            headerTitleAlign: 'center',
            headerBlurEffect: 'regular',
            headerStyle,
            headerTintColor,
            }}/>
            <Stack.Screen name="contact-us" options={{
            headerShown: true,
            headerTransparent: true,
            headerTitle: 'Dark Mode',
            headerTitleAlign: 'center',
            headerBlurEffect: 'regular',
            headerStyle,
            headerTintColor,
            }}/>
        </Stack>
    )
}