import { Stack } from "expo-router";
import "../../global.css"; // Assuming this path is correct relative to this file

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="[id]" // This matches your dynamic route file name
        options={{
          headerShown: false, // Make the header visible
          headerTransparent: true, // Make the header non-transparent
          headerTitle: '', // You can set a default title or let the screen component handle it
          headerBlurEffect: 'none', // Remove blur for a solid transparent background

          // To achieve a transparent background, you might need to style the header directly
          headerStyle: {
            backgroundColor: 'white',  // Set the background to transparent
          },
          headerLeft: () => null, // Remove left header component if not needed
        }}
      />
      {/* You can define other screens within the guide folder here if needed */}
    </Stack>
  );
}