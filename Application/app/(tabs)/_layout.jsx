import { Tabs } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { View, Image } from "react-native";
import { useColorScheme } from "nativewind";

import chatbotBlue from '@/assets/images/chat-bot/chatbot-blue.png'
import chatbotLBlue from '@/assets/images/chat-bot/chatbot-lightblue.png'
import chatbotBlack from '@/assets/images/chat-bot/chatbot-black.png'
import chatbotGray from '@/assets/images/chat-bot/chatbot-gray.png'

export default function Layout() {
  const {colorScheme} = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          borderRadius: 0,
          width: "100%",
          height: 56,
          alignSelf: "center",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: colorScheme === "dark" ? "#4A4A4A" : "white",
          borderWidth: 2,
          borderColor: colorScheme === "dark" ? "#4A4A4A" : "white",
        },
        tabBarItemStyle: {
          justifyContent: "center",
          alignItems: "center",
          paddingTop: 0,
        },
        tabBarActiveTintColor: "#006FFD",
      }}
    >
      <Tabs.Screen
        name="(home)"
        options={{
          title: "Home",
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              size={24}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="chatbot"
        options={{
          title: "TatAI",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <Image
              source={
                focused
                  ? chatbotLBlue
                  : colorScheme === "dark"
                  ? chatbotGray
                  : chatbotGray
              }
              style={{
                width: focused ? 32 : colorScheme === "dark" ? 48 : 48, // Bigger if chatbotGray
                height: focused ? 32 : colorScheme === "dark" ? 48 : 48,
              }}
              resizeMode="contain"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="(account)"
        options={{
          title: "Account",
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons
              name={focused ? "account-circle" : "account-circle-outline"}
              size={24}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}