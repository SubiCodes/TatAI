import { View, Text, TouchableOpacity } from 'react-native'
import React, { useCallback, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useFocusEffect, useRouter } from 'expo-router'
import { RotateOutDownLeft } from 'react-native-reanimated'
import {jwtDecode} from 'jwt-decode'

const Home = () => {
  const router = useRouter();
  const [userID, setUserID] = useState(null);

  const checkLoggedIn = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if(!token){
        router.replace('/(auth-screens)/signin')
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getUserID = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
      const decodedToken = jwtDecode(token);
      setUserID(decodedToken.userID); 
      }
    } catch (error) {
      console.error("Error decoding token:", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      checkLoggedIn();
      getUserID();
    }, [])
  );

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('token');
      checkLoggedIn();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View className='w-screen h-screen items-center justify-center bg-background'>
      <Text>Home</Text>
      <Text>Token: {AsyncStorage.getItem('token')}</Text>
      <Text>User ID: {userID}</Text>
      <TouchableOpacity className='w-80 h-12 rounded bg-red-500 items-center justify-center' onPress={logout}>
        <Text className='text-lg text-white font-bold'>Logout</Text>
      </TouchableOpacity>
    </View>
  )
}

export default Home