import { Tabs } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { View } from "react-native";

export default function Layout() {
  return (
    <>
    <View className="absolute h-24 w-screen bg-background" style={{position: 'absolute', bottom: 0, }}/>
    <Tabs screenOptions={{
      tabBarStyle: {
        borderRadius: 12,
        bottom: 24,
        width: '90%',
        height: 60,
        alignSelf: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      },
      tabBarItemStyle: {
        justifyContent: 'center',   
        alignItems: 'center',
        paddingTop: 4,    
        flex: 1,                    
      }
    }}>
      <Tabs.Screen
        name="home"
        options={{
          title: "Home", 
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "home" : "home-outline"} size={24} color={color}/>
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
        name="(account)"
        options={{
          title: "Account", 
          headerShown: false,
          tabBarIcon: ({ color, focused}) => (
            <MaterialCommunityIcons name={focused ? "account-circle" : "account-circle-outline"} size={24} color={color} />
          ),
        }}
      />
     </Tabs>
     </>
  );
}