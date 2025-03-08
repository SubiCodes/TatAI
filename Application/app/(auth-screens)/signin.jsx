import { View, Text, SafeAreaView, StatusBar, TextInput, TouchableOpacity, Image, ActivityIndicator, ScrollView, Alert, Dimensions} from 'react-native'
import CheckBox from 'expo-checkbox'
import AsyncStorage from '@react-native-async-storage/async-storage'
import React, { useState, useCallback } from 'react'
import { useFocusEffect } from 'expo-router'
import { Link, useRouter } from 'expo-router'
import axios from 'axios'

import SplashScreen from '@/components/splash-screen.jsx'
import { API_URL } from '@/constants/links.js'

import illustration from '../../assets/images/signin-illustration.png'
import signinImage from '../../assets/images/auth-images/logo1.png'

const SignIn = () => {

  const router = useRouter();
  const {width, height} = Dimensions.get('window');

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

  const reset = () => {
    setErrors("");
    setHidePassword(true);
    setSplashScreen(true);
    setEmail("");
    setPassword("");
    setLoading(false)
  }

  useFocusEffect(
      useCallback(() => {
        checkLoggedIn();
        reset();
      }, [])
  );

  return (
    <>
      <StatusBar translucent={true} backgroundColor="transparent"/>
      {splashScreen ? (<SplashScreen/>) : (
      <SafeAreaView className='h-[100%] w-screen flex justify-center items-center flex-col bg-background pt-20'>
        <ScrollView className='flex-1 gap-4 min-h-[100%] overflow-y-auto px-0 pt-10 pb-4'
        contentContainerStyle={{alignItems: 'center', justifyContent: 'center', gap: 20}} showsVerticalScrollIndicator={false}>

          <View className='min-h-30 h-40 items-center justify-center rounded-lg overflow-visible' >
            <Image source={signinImage} resizeMode="contain" style={{maxWidth: '100%'}} className='rounded'/>
          </View> 

          <View className='flex-row justify-between items-center gap-2 w-[300]'>
            <Text className='font-extrabold text-2xl text-black'>Welcome!</Text>
          </View>
          
          
          <View className='h-auto min-h-30 items-center'>
            {errors && (
            <View className='w-[300] h-12 border-2 border-red-500 rounded-lg mb-2 px-4 justify-center' style={{backgroundColor: '#fef6f5'}}>
              <Text className='text-black'>{`ⓘ ${errors}`}</Text>
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
                className='border-blue-300'
              />
              <Text className='text-m'>Show password</Text>
            </View>
              <Link href={'/forgot-password'} className="text-black underline text-m mt-4">Forgot Password?</Link>
            </View>

          </View>

         
          <TouchableOpacity className='flex-row mt-2 gap-2 min-h-11 h-11 bg-blue-700 justify-center items-center rounded-xl shadow-lg shadow-gray-400 elevation-2' style={{width: '80%'}}
           onPress={handleEmailLogin} disabled={loading}>
            {loading ? (<ActivityIndicator size="small" color="white"/>) : (
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
              <Text className='font-semibold text-base text-blue-700'>Create an Account</Text>
            </TouchableOpacity>

            <View className="flex-column items-center min-w-full w-full mt-2 mb-2">
              <Text className='text-gray-400 text-sm'>By continuing your aggreeing to our</Text>
              <Text className='text-gray-400 text-sm'><Link className='text-black font-bold text-sm' href={'/user-agreement'} >User agreement</Link> and <Link className='text-black font-bold text-sm' href={'/privacy-policy'}>Privacy Policy.</Link></Text>  
            </View>

          </View>

          
          <View className='min-h-32'>

          </View>
         
        </ScrollView>
      </SafeAreaView>
      )}
      
    </>
    
  )
}

export default SignIn