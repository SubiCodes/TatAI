import { View, Text, TouchableOpacity, Image, ActivityIndicator, StatusBar } from 'react-native'
import React, { useCallback, useState, useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useFocusEffect, useRouter, useNavigation } from 'expo-router'
import { RotateOutDownLeft } from 'react-native-reanimated'
import {jwtDecode} from 'jwt-decode'
import { API_URL } from '@/constants/links.js'
import axios from 'axios'

import logo from '@/assets/images/auth-images/logo1.png'

const Home = () => {
  const router = useRouter();
  const navigation = useNavigation();
  const [userID, setUserID] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  const [preferredName, setPreferredName] = useState(null);
  const [preferredTone, setPreferredTone] = useState(null);
  const [previousPrompts, setPreviousPrompts] = useState([]);

  const checkLoggedIn = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      setToken(token)
      if(!token){
        router.replace('/(auth-screens)/signin');
      }
      const decodedToken = await jwtDecode(token);
      await setUserID(decodedToken.userID);
      const preference = await axios.get(`${API_URL}/api/v1/preference/${decodedToken.userID}`, 
        { 
          validateStatus: (status) => status < 500,
        }
      );
      if (!preference.data.success) {
        await router.replace('/(personalization-screens)/personalization-main');
      }
      setPreferredName(preference.data.data.preferredName);
      setPreferredTone(preference.data.data.preferredTone);
      setPreviousPrompts(preference.data.data.previousPrompts);
      console.log(`User ID: ${decodedToken.userID}, Preferences: ${preference.data.data.preferredName}`);
    } catch (error) {
      console.log(error);
    }
  };

  const loadPage = async () => {
    await checkLoggedIn();
    setLoading(false);
  }

  useFocusEffect(
    useCallback(() => {
      loadPage();
    }, [])
  );

  useEffect(() => {
    navigation.setOptions({ tabBarStyle: loading ? { display: 'none' } : {} });
  }, [loading]);

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('token');
      checkLoggedIn();
    } catch (error) {
      console.log(error);
    }
  };

  if (loading){
    return (
      <View className='w-screen h-screen items-center justify-center gap-4'>
        <StatusBar translucent={true} backgroundColor={'transparent'}/>
        <ActivityIndicator size={32} color={'blue'}/>
        <Text>Loading Assets...</Text>
      </View>
    )
  }

  return (
    <>
    <StatusBar translucent={true} backgroundColor={'transparent'}/>
    <View className='w-screen h-screen items-center justify-center bg-background'> 
      <Text>Home</Text>
      <Text>Token: {token}</Text>
      <Text>User ID: {userID}</Text>
      <Text>Preferred Name: {preferredName} </Text>
      <Text>Preferred Tone: {preferredTone} </Text>
      <Text>Previous Prompts: {previousPrompts} </Text>
      <TouchableOpacity className='w-80 h-12 rounded bg-red-500 items-center justify-center' onPress={logout}>
        <Text className='text-lg text-white font-bold'>Logout</Text>
      </TouchableOpacity>
    </View> 
    </>
  )
}

export default Home