import { View, Text, TouchableOpacity, Image, ActivityIndicator, StatusBar, Alert, Dimensions } from 'react-native'
import React, { useCallback, useState, useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useFocusEffect, useRouter, useNavigation } from 'expo-router'
import { RotateOutDownLeft } from 'react-native-reanimated'
import {jwtDecode} from 'jwt-decode'
import { API_URL } from '@/constants/links.js'
import axios from 'axios'

import logo from '@/assets/images/auth-images/logo1.png'

const {width, height} = Dimensions.get('screen');

const Home = () => {
  const router = useRouter();

  const [token, setToken] = useState(null);
  const [userID, setUserID] = useState();

  const [loading, setLoading] = useState(true);
  const [serverError, setServerError] = useState(false);

  const checkLoggedIn = async () => {
    setLoading(true);
    setServerError(false);
    try {
      const token = await AsyncStorage.getItem('token');
      setToken(token)
      if(!token){
        router.replace('/(auth-screens)/signin');
      }
      const decodedToken = await jwtDecode(token);
      await setUserID(decodedToken.userID);
      return;
    } catch (error) {
      setLoading(false);
      console.log(error);
      setServerError(true);
    }finally{
      setLoading(false);
    }
  };

  const checkVerified = async () => {
    setLoading(true);
    setServerError(false);
    try {

      const token_copy = await AsyncStorage.getItem('token');
      if (!token_copy){
        router.replace('/(auth-screens)/signin');
        return;
      }
      const decodedToken = await jwtDecode(token_copy);

      const user = await axios.get(`${API_URL}/api/v1/user/${decodedToken.userID}`, 
        { 
          validateStatus: (status) => status < 500,
        }
      );
      if (!user.data.data.verified) {
        await AsyncStorage.removeItem('token');
        await router.replace(`/(auth-screens)/verify-account/${user.data.data.email}`);
        return;
      }
      const preference = await axios.get(`${API_URL}/api/v1/preference/${decodedToken.userID}`, 
        { 
          validateStatus: (status) => status < 500,
        }
      );
      if (!preference.data.success) {
        await router.push('/modal/personalization');
        return;
      }
    } catch (error) {
      console.log(error.message);
      setServerError(true);
    }finally{
      setLoading(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      checkLoggedIn();
    }, [])
  );

  useEffect(() => {
    checkVerified();
  }, [])

  if (loading){
    return (
      <View className='w-screen h-screen items-center justify-center gap-4'>
        <StatusBar translucent={true} backgroundColor={'transparent'}/>
        <ActivityIndicator size={32} color={'blue'}/>
      </View>
    )
  }

  if (serverError){
    return (
      <View className='w-screen h-screen items-center justify-center'>
          <StatusBar translucent={true} backgroundColor={'transparent'}/>
          <Text className='text-3xl font-extrabold text-red-500'>Network Error</Text>
          <Text>Please connect to a stable internet.</Text>
      </View>
    )
  }

  return (
    <>
    <StatusBar translucent={true} backgroundColor={'transparent'}/>
    <View className='items-center justify-center bg-background' style={{width: width, height: height}}> 
      
    </View> 
    </>
  )
}

export default Home