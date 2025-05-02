import { Tabs } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { View } from "react-native";
import { useColorScheme } from "nativewind";

export default function Layout() {

  const {colorScheme} = useColorScheme();

  return (

    <Tabs screenOptions={{
      tabBarStyle: {
        borderRadius: 0,
        width: '100%',
        height: 56,
        alignSelf: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colorScheme === 'dark' ? '#4A4A4A' : 'white',
        borderWidth: 2,
        borderColor: colorScheme === 'dark' ? '#4A4A4A' : 'white',
      },
      tabBarItemStyle: {
        justifyContent: 'center',   
        alignItems: 'center',
        paddingTop: 4,                       
      },
      tabBarActiveTintColor: '#006FFD'
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
  );
}