import { View, Text, SafeAreaView, StatusBar, TextInput, TouchableOpacity, Image, ActivityIndicator, ScrollView, Alert} from 'react-native'
import CheckBox from 'expo-checkbox'
import AsyncStorage from '@react-native-async-storage/async-storage'
import React, { useState, useCallback } from 'react'
import { useFocusEffect } from 'expo-router'
import { Link, useRouter } from 'expo-router'
import axios from 'axios'

import SplashScreen from '@/components/splash-screen.jsx'
import { API_URL } from '@/constants/links.js'

import illustration from '../../assets/images/signin-illustration.png'

const SignIn = () => {

  const router = useRouter();

  const [errors, setErrors] = useState("");
  const [hidePassword, setHidePassword] = useState(true);
  const [splashScreen, setSplashScreen] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const createAccount = async () => {
    await router.push('/(auth-screens)/signup');
  };

  const handleEmailLogin = async() => {
    setErrors("");
    setLoading(true);
    try {
      if(email.trim() === "" || password.trim() === ""){
        setErrors("Please fill all fields.");
        Alert.alert('Login error', 'Please fill in all the fields.', [
          {text: 'OK'},
        ]);
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
        Alert.alert('Login error', 'Please input valid credentials.', [
          {text: 'OK'},
        ]);
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
      <SafeAreaView className='h-[100%] w-screen flex justify-center items-center flex-col bg-background '>
        <ScrollView className='flex-1 gap-4 min-h-[100%] overflow-y-auto px-6 pt-20 pb-4'
        contentContainerStyle={{alignItems: 'center', justifyContent: 'center', gap: 20,width: 320}}>

          <View className='min-w-full w-full min-h-40 h-60 items-center justify-center mb-0 mt-0' >
            <Image source={illustration} resizeMode="contain" style={{maxWidth: '90%'}}/>
          </View> 

          <View className='flex-row justify-between items-center gap-2 w-80 self-start px-2'>
            <Text className='font-extrabold text-2xl'>Welcome!</Text>
          </View>

          <TextInput placeholder={errors ? (`❗ ${errors}`) : ('Enter Email')} placeholderTextColor={errors ? ('rgba(255, 105, 97, 0.7)') : ('gray')} value={email} onChangeText={(text) => setEmail(text)}
          className='min-w-full w-full min-h-12 px-4 border border-gray-300 rounded-lg bg-white text-base'/>

          <TextInput secureTextEntry={hidePassword} placeholder={errors ? (`❗ ${errors}`) : ('Enter Password')} placeholderTextColor={errors ? ('rgba(255, 105, 97, 0.7)') : ('gray')} value={password} onChangeText={(pass) => setPassword(pass)}
          className='min-w-full w-full min-h-12 px-4 border border-gray-300 rounded-lg bg-white text-base'/>

          <View className='flex-row justify-between items-center gap-2 min-w-full w-fullself-start px-2'>

            <View className='flex-row items-center gap-2 mr-auto'>
              <CheckBox 
                value={!hidePassword} 
                onValueChange={(newValue) => setHidePassword(!newValue)} 
                color={'#2563EB'}
                className='border-blue-300'
              />
              <Text className='text-m'>Show password</Text>
            </View>
            <Link href={'/forgot-password'} className="text-black underline text-m">Forgot Password?</Link>

          </View>
          <TouchableOpacity className='flex-row mt-2 gap-2 min-w-full w-full min-h-11 h-11 bg-blue-600 justify-center items-center rounded-xl shadow-lg shadow-gray-400 elevation-4'
           onPress={handleEmailLogin} disabled={loading}>
            {loading ? (<ActivityIndicator size="small" color="white"/>) : (
              <Text className='font-bold text-lg text-white'>Login</Text>
            )}
          </TouchableOpacity>
          
          <View className="flex-row items-center min-w-full w-full mt-2 mb-2">

            <View className="flex-1 h-[1px] bg-gray-300" />
            <Text className="px-4 text-gray-500 text-base">or</Text>
            <View className="flex-1 h-[1px] bg-gray-300" />

          </View>

          <TouchableOpacity className='flex-row gap-2 min-w-full w-full min-h-12 h-12 bg-white justify-center items-center rounded-xl shadow-lg border border-gray-200 shadow-gray-400 elevation-4'
           onPress={() => createAccount()}
          >
            <Text className='font-semibold text-base text-blue-500'>Create an Account</Text>
          </TouchableOpacity>

          <View className="flex-column items-center min-w-full w-full mt-2 mb-2">
            <Text className='text-gray-400 text-sm'>By continuing your aggreeing to our</Text>
            <Text className='text-gray-400 text-sm'><Link className='text-black font-bold text-sm' href={'/user-agreement'} >User agreement</Link> and <Link className='text-black font-bold text-sm' href={'/privacy-policy'}>Privacy Policy.</Link></Text>  
          </View>
         
        </ScrollView>
      </SafeAreaView>
      )}
      
    </>
    
  )
}

export default SignIn