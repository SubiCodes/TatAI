import { View, Text, SafeAreaView, StatusBar, TextInput, TouchableOpacity, Image, ActivityIndicator, ScrollView, Alert, Dimensions} from 'react-native'
import CheckBox from 'expo-checkbox'
import * as SplashScreen from "expo-splash-screen"; 
import AsyncStorage from '@react-native-async-storage/async-storage'
import React, { useState, useCallback, useEffect } from 'react'
import { useFocusEffect } from 'expo-router'
import { Link, useRouter } from 'expo-router'
import axios from 'axios'

import { API_URL } from '@/constants/links.js'

import illustration from '../../assets/images/signin-illustration.png'
import signinImage from '../../assets/images/auth-images/tatai-sub.png';
import { useColorScheme } from 'nativewind';


import userStore from '@/store/user.store';

const SignIn = () => {

  const {colorScheme, toggleColorScheme} = useColorScheme();
  const {user, userLogin, isLoading, error} = userStore();

  const [appReady, setAppReady] = useState(false);
  const router = useRouter();
  const {width, height} = Dimensions.get('window');

  const [hidePassword, setHidePassword] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
 

  const createAccount = async () => {
    await router.push('/(auth-screens)/signup');
  };

  const handleEmailLogin = async() => {
    const res = await userLogin(email, password);
  }; 

  const checkLoggedIn = async() => {
    try {
      const token = await AsyncStorage.getItem('token');
      if(token) {
        router.replace('/(tabs)/home')
      }
    } catch (error) {
      console.log(error);
      setErrors(error.message);
    }
  };

  const reset = () => {
    setHidePassword(true);
    setAppReady(false)
    setEmail("");
    setPassword("");
    setLoading(false)
  }

  const prepareApp = async () => {
    try{
      await SplashScreen.preventAutoHideAsync();
      await checkLoggedIn();
      await reset();
      SplashScreen.hideAsync();
      setAppReady(true);
    }
    catch (error){
      console.log(error,message);
    }
  }

  useFocusEffect(
      useCallback(() => {
        prepareApp();
      }, [])
  );

  useEffect(() => {
    const loadTheme = async () => {
        try {
          const storedTheme = await AsyncStorage.getItem('theme');
          if (storedTheme && storedTheme !== colorScheme) {
            toggleColorScheme();
          }
        } catch (error) {
          console.error('Failed to load theme:', error);
        }
      };
      loadTheme();
  }, [])

  return (
    <>
      <StatusBar translucent={false} className='bg-background dark:bg-background-dark'/>
      {!appReady ? 
      (
      <View className='h-screen w-screen items-center justify-center'>
        <ActivityIndicator size={60} color={'#0818A8'}/>
      </View>) : 
      (
        <>
      <SafeAreaView className='h-[100%] w-screen flex justify-center items-center flex-col bg-background pt-20'>
        <ScrollView className='flex-1 gap-4 min-h-[100%] overflow-y-auto px-0 pt-8 pb-4'
        contentContainerStyle={{alignItems: 'center', justifyContent: 'center', gap: 20}} showsVerticalScrollIndicator={false}>

          <View className='min-h-30 h-40 items-center justify-center rounded-lg overflow-visible' >
            <Image source={signinImage} resizeMode="contain" style={{maxWidth: '80%'}} className='rounded'/>
          </View> 

          <View className='flex-row justify-between items-center gap-2 w-[300]'>
            <Text className='font-extrabold text-2xl text-black'>Welcome!</Text>
          </View>
          
          
          <View className='h-auto min-h-30 items-center'>
            {error && (
            <View className='w-[300] h-12 border-2 border-red-500 rounded-lg mb-2 px-4 justify-center' style={{backgroundColor: '#fef6f5'}}>
              <Text className='text-black'>{`ⓘ ${error}`}</Text>
            </View>  )}
               
            <TextInput placeholder={'Email'}  value={email} onChangeText={(text) => setEmail(text)}
            className='w-[300] min-h-12 px-4 border border-gray-300 rounded-lg mb-3 bg-white text-base shadow-sm'/>
            <TextInput secureTextEntry={hidePassword} placeholder={'Password'} value={password} onChangeText={(pass) => setPassword(pass)}
            className='w-[300] min-h-12 px-4 border border-gray-300 rounded-lg bg-white text-base shadow-sm'/> 

            <View className='flex-row justify-between items-center w-[300] px-2'>

            <View className='flex-row items-center gap-2 mr-auto mt-4'>
              <CheckBox 
                value={!hidePassword} 
                onValueChange={(newValue) => setHidePassword(!newValue)} 
                color={'#2563EB'}
                className='border-primary'
              />
              <Text className='text-m'>Show password</Text>
            </View>
              <Link href={'/forgot-password'} className="text-black underline text-m mt-4">Forgot Password?</Link>
            </View>

          </View>

         
          <TouchableOpacity className='flex-row mt-2 gap-2 min-h-11 h-11 bg-primary justify-center items-center rounded-xl shadow-lg shadow-gray-400 elevation-2' style={{width: '80%'}}
           onPress={handleEmailLogin} disabled={loading}>
            {isLoading ? (<ActivityIndicator size="small" color="white"/>) : (
              <Text className='font-bold text-lg text-white'>Login</Text>
            )}
          </TouchableOpacity>
          
          <View className="flex-row items-center w-[280]">

            <View className="flex-1 h-[1px] bg-gray-300" />
            <Text className="px-4 text-gray-500 text-base">or</Text>
            <View className="flex-1 h-[1px] bg-gray-300" />

          </View>

          <View className="flex-col items-center justify-center min-w-full w-full mt-2 mb-2">
            <TouchableOpacity className='flex-row gap-2 min-h-12 h-auto bg-white justify-center items-center rounded-xl shadow-md border border-gray-200 shadow-gray-400 elevation-2' 
            style={{width: '80%'}}
            onPress={() => createAccount()}
            >
              <Text className='font-semibold text-base text-primary'>Create an Account</Text>
            </TouchableOpacity>

            <View className="flex-column items-center min-w-full w-full mt-2 mb-2">
              <Text className='text-gray-400 text-sm'>By continuing your aggreeing to our</Text>
              <Text className='text-gray-400 text-sm'><Link className='text-black font-bold text-sm' href={'/legals/terms-conditions'} >Terms and Conditions</Link> and <Link className='text-black font-bold text-sm' href={'/legals/privacy-policy'}>Privacy Policy.</Link></Text>  
            </View>

          </View>

          
          <View className='min-h-32'>

          </View>
         
        </ScrollView>
      </SafeAreaView>
      </>
      )}
    </>
  )
}

export default SignIn