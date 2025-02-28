import { View, Text, SafeAreaView, StatusBar, TextInput, TouchableOpacity, Image, ActivityIndicator} from 'react-native'
import CheckBox from 'expo-checkbox'
import AsyncStorage from '@react-native-async-storage/async-storage'
import React, { useState, useCallback } from 'react'
import { useFocusEffect } from 'expo-router'
import { Link, useRouter } from 'expo-router'
import axios from 'axios'

import SplashScreen from '@/components/splash-screen.jsx'
import { API_URL } from '@/constants/links.js'

import googleIcon from '../../assets/images/google-icon.png'
import illustration from '../../assets/images/signin-illustration.png'

const SignIn = () => {

  const router = useRouter();

  const [errors, setErrors] = useState("");
  const [hidePassword, setHidePassword] = useState(true);
  const [splashScreen, setSplashScreen] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const test = async () => {
    await router.replace('/(tabs)/home');
  };

  const handleEmailLogin = async() => {
    setErrors("");
    setLoading(true);
    try {
      if(email.trim() === "" || password.trim() === ""){
        setErrors("Please fill all fields.");
        return;
      }
      const res = await axios.post(`${API_URL}/api/v1/auth/sign-in`, {email: email, password: password}, 
        { 
          validateStatus: (status) => status < 500, // Only throw errors for 500+ status codes
        }
      );
      if(res.data.success){
        await AsyncStorage.setItem('token', res.data.token);
        router.replace('/(tabs)/home');
      }
      if(!res.data.success) {
        setErrors("Invalid Credentials.");
      };
    } catch (error) {
      console.log(error);
      setErrors(error.message);
      setLoading(false);
    } finally{
      setLoading(false);
    }
  }; 

  const checkLoggedIn = async() => {
    try {
      const token = await AsyncStorage.getItem('token');
      if(token) {
        router.replace('/(tabs)/home')
      }
      setSplashScreen(false);
    } catch (error) {
      console.log(error);
      setErrors(error.message);
      setSplashScreen(false);
    }
  };

  useFocusEffect(
      useCallback(() => {
        checkLoggedIn();
      }, [])
  );



  return (
    <>
      <StatusBar translucent={true} backgroundColor="transparent"/>
      {splashScreen ? (<SplashScreen/>) : (
      <SafeAreaView className='min-h-screen h-full w-screen flex justify-center items-center flex-col bg-background'>
        <View className='flex-1 justify-center items-center gap-4 w-80'>
          <View className='w-80 h-48 items-center justify-center mb-8'>
            <Image source={illustration} resizeMode="contain" style={{maxWidth: '100%'}}/>
          </View>
          <TextInput placeholder='Enter Email' value={email} onChangeText={(text) => setEmail(text)}
          className='w-80 h-12 px-4 border border-gray-300 rounded-lg bg-white text-base'/>
          <TextInput secureTextEntry={hidePassword} placeholder='Enter Password' value={password} onChangeText={(pass) => setPassword(pass)}
          className='w-80 h-12 px-4 border border-gray-300 rounded-lg bg-white text-base' />
          <View className='flex-row justify-start items-center gap-2 w-80 self-start px-2'>
            <CheckBox value={!hidePassword} 
              onValueChange={(newValue) => setHidePassword(!newValue)} /> 
            <Text className='text-m'>Show password</Text>
          </View>
          <TouchableOpacity className='flex-row gap-2 w-80 h-10 bg-blue-600 justify-center items-center rounded-xl shadow-lg  shadow-gray-400 elevation-4'
           onPress={handleEmailLogin}>
            {loading ? (<ActivityIndicator size="small" color="white"/>) : (
              <Text className='font-bold text-lg text-white'>Login</Text>
            )}
          </TouchableOpacity>
          {!errors ? (null) : (<Text className='text-red-500'>{`⚠️ ${errors}`}</Text>)}
          <View className="flex-row items-center w-80 mt-2 mb-4">
            <View className="flex-1 h-[1px] bg-gray-300" />
            <Text className="px-4 text-gray-500 text-base">or</Text>
            <View className="flex-1 h-[1px] bg-gray-300" />
          </View>
          <TouchableOpacity className='flex-row gap-2 w-80 h-10 bg-white justify-center items-center rounded-xl shadow-lg border border-gray-200 shadow-gray-400 elevation-4'
           onPress={() => test()}
          >
            <Image source={googleIcon} resizeMode="contain" style={{maxWidth: '8%'}}/>
            <Text className='font-bold text-base text-black'>Continue With Google</Text>
          </TouchableOpacity>
        </View>
        <View className='pb-8 items-center'>
          <Link href={'/signin'} className='text-blue-500'>Dont have an Account? Signup here!</Link>
        </View>
      </SafeAreaView>
      )}
      
    </>
    
  )
}

export default SignIn