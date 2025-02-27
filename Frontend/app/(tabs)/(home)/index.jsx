import { Text, TouchableOpacity, View } from "react-native";
import { Link, useFocusEffect, useRouter } from "expo-router";
import { useCallback } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Index() {

  const router = useRouter();

  const checkLogin = async () => {
    try {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
            router.replace('/signin-landing');
        }
    } catch (error) {
        console.log(error);
    }
  };

  const handleLogout = async() => {
    try {
      await AsyncStorage.removeItem('token');
      checkLogin();
    } catch (error) {
      console.log(error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      checkLogin()
    }, [])
  );

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        gap: 24
      }}
    >
      <Text>Home Screen.</Text>
      <Link href="/homefix/brokenfaucet" style={{backgroundColor: 'lightgreen', paddingVertical: 4, paddingHorizontal: 8}}>Go to Broken Faucet Fix</Link>
      <TouchableOpacity style={{backgroundColor: '#FF6961', paddingVertical: 4, paddingHorizontal: 8}}
      onPress={handleLogout}>
          <Text>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}
