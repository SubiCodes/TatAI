import { Stack } from "expo-router";
import "../../../global.css"
import { useColorScheme } from "nativewind";

export default function RootLayout() {
    const {colorScheme} = useColorScheme();
    const headerTintColor = colorScheme === 'dark' ? '#FFFFFF' : '#000000';
    return (
        <Stack>
            <Stack.Screen name="home" options={{
                headerShown: false,
                headerTransparent: true,
                headerTitle: '',
                headerBlurEffect: 'regular',
                headerTintColor
            }}/>
            {/* Fix: Match the exact folder name without the 's' */}
            <Stack.Screen name="showguide/[type]" options={{
                headerShown: false,
                headerTransparent: true,
                headerTitle: '',
                headerBlurEffect: 'regular',
                headerTintColor
            }}/>
            <Stack.Screen name="searchresult/[term]" options={{
                headerShown: false,
                headerTransparent: true,
                headerTitle: '',
                headerBlurEffect: 'regular',
                headerTintColor
            }}/>
        </Stack>
    )
}