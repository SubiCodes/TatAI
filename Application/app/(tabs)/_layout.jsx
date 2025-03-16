import { Tabs } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

export default function Layout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="home"
        options={{
          title: "Home", 
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "home" : "home-outline"} size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="homepage"
        options={{
          title: "Home", 
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "home" : "home-outline"} size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="chatbot"
        options={{
          title: "TatAI", 
          tabBarIcon: ({ color, focused}) => (
            <MaterialCommunityIcons name={focused ? "robot-excited" : "robot-excited-outline"} size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile", 
          tabBarIcon: ({ color, focused}) => (
            <MaterialCommunityIcons name={focused ? "account-circle" : "account-circle-outline"} size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}