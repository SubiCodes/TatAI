import { View, Text, SafeAreaView, StatusBar, TextInput, TouchableOpacity, Image} from 'react-native'
import CheckBox from 'expo-checkbox'
import AsyncStorage from '@react-native-async-storage/async-storage'
import React, { useState, useCallback } from 'react'
import { useFocusEffect } from 'expo-router'
import { Link, useRouter } from 'expo-router'
import axios from 'axios'

import googleIcon from '../../assets/images/google-icon.png'
import illustration from '../../assets/images/signin-illustration.png'



const SignIn = () => {

  const router = useRouter();

  const [errors, setErrors] = useState("");
  const [hidePassword, setHidePassword] = useState(true);
  const [loadingScreen, setLoadingScreen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const test = async () => {
    await router.replace('/(tabs)/home');
  };

  const handleEmailLogin = async() => {
    setErrors("");
    try {
      if(email.trim() === "" || password.trim() === ""){
        setErrors("Please fill all fields.");
        return;
      }
    } catch (error) {
      console.log(error);
      setErrors(error.message);
    }
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

  useFocusEffect(
      useCallback(() => {
        checkLoggedIn();
      }, [])
  );



  return (
    <>
      <StatusBar translucent={true} backgroundColor="transparent"/>
      <SafeAreaView className='min-h-screen-safe h-full w-screen flex justify-center items-center flex-col bg-background'>
        <View className='flex-1 justify-center items-center gap-4 w-80'>
          <View className='w-80 h-48 items-center justify-center mb-8'>
            <Image source={illustration} resizeMode="contain" className='w-full h-auto '/>
          </View>
          <TextInput placeholder='Enter Email' className='w-80 h-12 px-4 border border-gray-300 rounded-lg bg-white text-base'/>
          <TextInput secureTextEntry={hidePassword} placeholder='Enter Password' className='w-80 h-12 px-4 border border-gray-300 rounded-lg bg-white text-base' />
          <View className='flex-row justify-start items-center gap-2 w-80 self-start px-2'>
            <CheckBox value={!hidePassword} 
              onValueChange={(newValue) => setHidePassword(!newValue)} /> 
            <Text className='text-m'>Show password</Text>
          </View>
          <TouchableOpacity className='bg-blue-600 w-80 h-10 rounded items-center justify-center' onPress={handleEmailLogin}>
            <Text className='font-bold text-lg text-white'>Login</Text>
          </TouchableOpacity>
          {!errors ? (<Text></Text>) : (<Text className='text-red-500'>{`⚠️ ${errors}`}</Text>)}
          <View className="flex-row items-center w-80 mt-2 mb-4">
            <View className="flex-1 h-[1px] bg-gray-300" />
            <Text className="px-4 text-gray-500 text-base">or</Text>
            <View className="flex-1 h-[1px] bg-gray-300" />
          </View>
          <TouchableOpacity className='flex-row gap-2 w-80 h-12 bg-white justify-center items-center rounded-xl shadow-lg border border-gray-200 shadow-gray-400 elevation-4'
          onPress={test}
          >
            <Image source={googleIcon} resizeMode="contain" className='w-6 h-auto'/>
            <Text className='font-bold text-lg text-black'>Continue With Google</Text>
          </TouchableOpacity>
        </View>
        <View className='pb-8 items-center'>
          <Link href={'/signin'} className='text-blue-500'>Create an Account.</Link>
        </View>
      </SafeAreaView>
    </>
    
  )
}

export default SignIn