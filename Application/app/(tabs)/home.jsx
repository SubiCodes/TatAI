import { View, Text, TouchableOpacity } from 'react-native'
import React, { useCallback } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useFocusEffect, useRouter } from 'expo-router'
import { RotateOutDownLeft } from 'react-native-reanimated'

const Home = () => {
  const router = useRouter();

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

  useFocusEffect(
    useCallback(() => {
      checkLoggedIn();
    }, [])
  );

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('token')
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View className='w-screen h-screen items-center justify-center bg-background'>
      <Text>Home</Text>
      <TouchableOpacity className='w-80 h-12 rounded bg-red-500 items-center justify-center'>
        <Text className='text-lg text-white font-bold'>Logout</Text>
      </TouchableOpacity>
    </View>
  )
}

export default Home