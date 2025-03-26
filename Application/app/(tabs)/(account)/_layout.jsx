import { Stack } from "expo-router";
import "../../../global.css"

export default function RootLayout() {
    return (
        <Stack>
            <Stack.Screen name="profile-main-page" options={{
            headerShown: false,
            headerTransparent: true,
            headerTitle: '',
            headerBlurEffect: 'regular',
            }}/>
            <Stack.Screen name="edit-profile" options={{
            headerShown: true,
            headerTransparent: true,
            headerTitle: '',
            headerBlurEffect: 'regular',
            }}/>
        </Stack>
    )
}