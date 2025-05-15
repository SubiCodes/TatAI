import { View, Text, SafeAreaView, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native'
import CheckBox from 'expo-checkbox'
import React, { useState, useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useRouter } from 'expo-router';

import { useNavigation } from '@react-navigation/native';
import { CommonActions } from '@react-navigation/native';

import Constants from 'expo-constants';

const API_URL =
  Constants.expoConfig?.extra?.API_URL ?? Constants.manifest?.extra?.API_URL;

const ResetPassword = () => {
  const router = useRouter();
  const navigation = useNavigation();

  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(true);
  const [rePassword, setRePassword] = useState('');
  const [showRePassword, setShowRePassword] = useState(true);

  const [strength, setStrength] = useState(0);
  const [strengthTerm, setStrengthTerm] = useState('weak');
  const [loading, setLoading] = useState(false);

  const checkPasswordStrength = async () => {

    
    let score = 0;
    const hasMinLength = password.length > 7;
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /\d/.test(password);
  
    // Ensure the password is weak if it lacks length or alphanumerics
    if (!hasMinLength || !(hasLetter && hasNumber)) {
      setStrength(0);
      setStrengthTerm("Weak");
      return;
    }
  
    score++; 
    score++; 
    if (/[^a-zA-Z0-9]/.test(password)) score++; 
    if (password.length >= 10) score++;
  
    setStrength(score);
  
    if (score <= 1) {
      setStrengthTerm('Weak');
    }
    if (score > 1) {
      setStrengthTerm('Good');
    }
    if (score > 3) {
      setStrengthTerm('Great');
    }
  };

  useEffect(() => {
    checkPasswordStrength();
  }, [password]);

  const changePassword = async () => {
    setLoading(true);
    try {
      if (strengthTerm === "Weak"){
          Alert.alert('⚠️ Oops!', `Make sure your password is at least 6 characters and contains alphanumeric values. `, [
            {text: 'OK'},
          ]);
          setLoading(false);
          return
      }
      if (password !== rePassword){
        Alert.alert('⚠️ Oops!', `New Password and re-entered password doesn't match. `, [
          {text: 'OK'},
        ]);
        setLoading(false);
        return
      }
      const email = await AsyncStorage.getItem('reset-request-email');
      const token = await AsyncStorage.getItem('reset-request-token');
      if (!email || !token){
        Alert.alert('⚠️ Oops!', `A request for an account was not made, missing email or token. Re-direct to the forgot password page. `, [
          {text: 'OK'},
        ]);
        setLoading(false);
        return
      };
      const res = await axios.post(`${API_URL}auth/reset-password`, {email: email, resetToken: token, newPassword: password}, 
        { 
          validateStatus: (status) => status < 500, // Only throw errors for 500+ status codes
        }
      );
      if(!res){
        Alert.alert('⚠️ Oops!', `An existing user with the stored email and token was not found. Please Re-direct to forgot password and try again `, [
          {text: 'OK'},
        ]);
        setLoading(false);
        return
      }

      await AsyncStorage.removeItem('reset-request-email');
      await AsyncStorage.removeItem('reset-request-token');

      Alert.alert('✅ Congratulations!', `Your password was changed successfully, re-directing you to sign in page.`, [
        {text: 'OK', onPress: () => {
          // Use router.replace with special params to reset navigation history
          router.dismissAll()
        }},
      ]);
      setLoading(false);

    } catch (error) {
      console.log(error.message);
      Alert.alert('⚠️ Oops!', `${error.message}`, [
        {text: 'OK'},
      ]);
      setLoading(false);
      return
      setLoading(false);
    }
  }
  

  return (
     <SafeAreaView className='h-[100%] w-screen flex items-center flex-col bg-background pt-32 md:pt-0 md:justify-center'>
        <View className='w-80 items-center justify-center gap-4 md:w-screen md:gap-12'>
            <View className='w-screen items-center md:w-3/5'>
                <Text className='text-4xl font-extrabold mb-6 md:text-5xl'>Reset Password</Text>
                <Text className='text-base mb-6 md:text-xl md:mb-2'>At least 8 characters with alphanumeric values.</Text>
            </View>
            <View className='w-80 items-start gap-2 md:w-3/5'>
              <Text className='text-base font-bold md:text-2xl'>New Password</Text>
              <TextInput placeholder='Enter Password' className='h-12 w-80 border-black border-2 rounded-md md:w-full md:h-16'
              value={password} onChangeText={(text) => setPassword(text)} secureTextEntry={showPassword}
              ></TextInput>
              
              <View className='flex-row items-center gap-4 mr-auto mb-2 md:gap-8 md:mb-6'>
                <View className='flex-row items-center justify-center gap-1 mr-auto'>
                  <Text className='font-bold text-sm md:text-xl'>ⓘ Password Strength:</Text>
                  <Text className={`font-bold md:text-xl ${
                  strengthTerm === 'Weak'
                    ? 'text-red-500'
                    : strengthTerm === 'Good'
                    ? 'text-lime-400'
                    : 'text-green-500'
                  }`}>
                  {strengthTerm}
                </Text>
                </View>
                
                <View className='flex-row items-center justify-center gap-1 mr-auto md:gap-2'>
                  <CheckBox 
                  value={!showPassword} 
                  onValueChange={(newValue) => setShowPassword(!newValue)} 
                  color={'black'}
                  className="transform scale-75 md:transform md:scale-150" 
                  />
                  <Text className='text-sm md:text-lg'>Show password</Text>
                </View>
              </View>

              <Text className='text-base font-bold md:text-2xl'>Re-enter Password</Text>
              <TextInput placeholder='Re-enter Password' className='h-12 w-80 border-black border-2 rounded-md md:w-full md:h-16'
              value={rePassword} onChangeText={(text) => setRePassword(text)} secureTextEntry={showRePassword}
              ></TextInput>

              <View className='flex-row items-center gap-8 mr-auto mb-2 md:gap-14 md:mb-4'>
                <Text className='font-bold text-sm md:text-xl'>ⓘ Re-enter you password</Text>
                <View className='flex-row items-center gap-1 mr-auto md:gap-2'>
                  <CheckBox 
                  value={!showRePassword} 
                  onValueChange={(newValue) => setShowRePassword(!newValue)} 
                  color={'black'}
                  className="transform scale-75 md:transform md:scale-150" 
                  />
                  <Text className='text-sm md:text-lg'>Show password</Text>
                </View>
              </View>
            </View>

            <TouchableOpacity className='w-80 h-12 items-center justify-center bg-primary rounded-md md:w-3/5' onPress={changePassword}>
              {loading ? (<ActivityIndicator size={'small'} color={'white'}/>) : (
                <Text className='text-lg text-white font-bold '> Change Password</Text>
              )}
            </TouchableOpacity>

        </View>
     </SafeAreaView>
                    
  )
}

export default ResetPassword