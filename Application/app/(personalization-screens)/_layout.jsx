import { Stack } from "expo-router";    

export default function RootLayout() {
  return ( 
  <Stack>
    <Stack.Screen name="personalization-main" options={{headerShown: false}}/>
  </Stack>
  )
}
