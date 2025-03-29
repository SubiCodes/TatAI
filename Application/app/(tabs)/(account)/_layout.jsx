import { Stack } from "expo-router";
import "../../../global.css"
import { useColorScheme } from "nativewind";

export default function RootLayout() {
    const {colorScheme} = useColorScheme();
    const headerTintColor = colorScheme === 'dark' ? '#FFFFFF' : '#000000';
    return (
        <Stack>
            <Stack.Screen name="profile-main-page" options={{
            headerShown: false,
            headerTransparent: true,
            headerTitle: '',
            headerBlurEffect: 'regular',
            headerTintColor
            }}/>
            <Stack.Screen name="edit-profile" options={{
            headerShown: true,
            headerTransparent: true,
            headerTitle: '',
            headerBlurEffect: 'regular',
            headerTintColor
            }}/>
        </Stack>
    )
}