import { Stack } from "expo-router";
import "../../global.css"; // Assuming this path is correct relative to this file
import { useColorScheme } from 'react-native';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  return (
    <Stack>
      <Stack.Screen
        name="saved-guides" // This matches your dynamic route file name
        options={{
          headerShown: false, // Make the header visible
          headerTransparent: false, // Make the header non-transparent
          headerTitle: 'Saved Guides', // You can set a default title or let the screen component handle it
          headerBlurEffect: 'none', // Remove blur for a solid transparent background

          // To achieve a transparent background, you might need to style the header directly
          headerStyle: {
            backgroundColor: isDarkMode ? '#212121' : "#FAF9F6",  // Set the background to transparent
          },
          headerTintColor: isDarkMode ? 'white' : 'black', // Remove left header component if not needed
        }}
      />
      {/* You can define other screens within the guide folder here if needed */}
    </Stack>
  );
}