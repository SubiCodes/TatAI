import { View, Text, StatusBar, SafeAreaView, TextInput, TouchableOpacity, Alert, Modal, ActivityIndicator, } from 'react-native'
import CheckBox from 'expo-checkbox'
import Toast from '@/components/toast/error-toast.jsx'
import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { API_URL } from '@/constants/links.js'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { jwtDecode } from 'jwt-decode'
import { router } from 'expo-router'
import { useColorScheme } from 'nativewind'

const ChangePassword = () => {

  const {colorScheme, toggleColorScheme} = useColorScheme();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newReEnteredPassword, setNewReEnteredPassword] = useState('');

  const [isCurrentPasswordHidden, setIsCurrentPasswordHidden] = useState(true);
  const [isNewPasswordHidden, setIsNewPasswordHidden] = useState(true);
  const [isNewReEnterPasswordHidden, setIsNewReEnterPasswordHidden] = useState(true);

  const [strength, setStrength] = useState(0);
  const [strengthTerm, setStrengthTerm] = useState('Weak');

  const [currentPasswordError, setCurrentPasswordError] = useState(false);
  const [newPasswordError, setNewPasswordError] = useState(false);
  const [newReEnteredPasswordError, setNewReEnteredPasswordError] = useState(false);
  const [errorList, setErrorList] = useState([]);
  const [showError, setShowError] = useState(false);

  const [loading, setLoading] = useState(false);

  const handleClearFields = async () => {
    setCurrentPassword('');
    setNewPassword('');
    setNewReEnteredPassword('');
  };

  const handleChangePassword = async () => {
    setLoading(true);
    setCurrentPasswordError(false);
    setNewPasswordError(false);
    setNewReEnteredPasswordError(false);
    setErrorList([]);

    if (currentPassword.trim() === '') {
      setCurrentPasswordError(true);
      setErrorList((prev) => [...prev, 'Current Password cannot be empty.']);
    }
  
    if (newPassword.trim() === '') {
      setNewPasswordError(true);
      setErrorList((prev) => [...prev, 'New Password cannot be empty.']);
    }

    if (strengthTerm === 'Weak') {
      setNewPasswordError(true);
      setErrorList((prev) => [...prev, 'Password should be 8 characters long containing alphanumerics.']);
    }

    if (newReEnteredPassword.trim() === '') {
      setNewReEnteredPasswordError(true);
      setErrorList((prev) => [...prev, 'Re-enter Password cannot be empty.']);
    }
  
    if (newPassword.trim() !== newReEnteredPassword.trim()) {
      setNewPasswordError(true);
      setNewReEnteredPasswordError(true);
      setErrorList((prev) => [...prev, `Password's don't match.`]);
    }

    try {
      if (!currentPasswordError && !newPasswordError && !newReEnteredPasswordError){
        const token = await AsyncStorage.getItem('token');
        const decryptedToken = await jwtDecode(token);
        const changePass = await axios.post(`${API_URL}/api/v1/auth/change-password/${decryptedToken.userID}`, {currentPassword: currentPassword, newPassword: newPassword}, 
          { 
            validateStatus: (status) => status < 500, // Only throw errors for 500+ status codes
          });
        if (!changePass.data.success){
          setCurrentPasswordError(true);
          setErrorList((prev) => [...prev, changePass.data.message]);
          Alert.alert("⚠️Oops", changePass.data.message);
          return
        };
        handleClearFields();
        Alert.alert("Change Successful", changePass.data.message);
      }
      setShowError(true);
      setTimeout(() => {
        setShowError(false); 
      }, 3000);
    } catch (error) {
      console.log(error.message);
    } finally{
      setLoading(false);
    }
  }

  const checkPasswordStrength = async () => {
    let score = 0;
    const hasMinLength = newPassword.length > 7;
    const hasLetter = /[a-zA-Z]/.test(newPassword);
    const hasNumber = /\d/.test(newPassword);
  
    // Ensure the password is weak if it lacks length or alphanumerics
    if (!hasMinLength || !(hasLetter && hasNumber)) {
      setStrength(0);
      setStrengthTerm("Weak");
      return;
    }
  
    score++; 
    score++; 
    if (/[^a-zA-Z0-9]/.test(newPassword)) score++; 
    if (newPassword.length >= 10) score++;
  
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
  }, [newPassword]);
  
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
    
    <SafeAreaView className='w-screen h-screen items-center pt-32 px-8 bg-background dark:bg-background-dark'>
      <View className='w-full h-auto flex-col gap-4 mb-8'>

        <Modal visible={loading} transparent={true}>
          <View className='w-screen h-screen items-center justify-center' style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
            <View className='w-4/5 h-auto bg-white items-center gap-8 py-12 justify-center rounded-xl'>
              <Text className='text-2xl font-bold'>Changing Password</Text>
              <ActivityIndicator color={'#0818A8'} size={32}/>
              <Text className='text-base font-light'>This may take a while...</Text>
            </View>
          </View>
        </Modal>

        <View className='w-full h-auto flex-col gap-2'>
          <Text className='text-lg font-bold text-text dark:text-text-dark'>Current Password</Text>
          <TextInput placeholder='' className={`h-12 w-full border-2 rounded-md md:w-full md:h-16 ${currentPasswordError ? 'border-red-500' : 'border-black'} dark:${currentPasswordError ? 'border-red-500' : 'border-white'} dark:text-text-dark`}
          secureTextEntry={isCurrentPasswordHidden} value={currentPassword} onChangeText={(text) => setCurrentPassword(text)}/>
          <View className='max-w-full flex-row items-center mr-auto mb-2 md:gap-14 md:mb-4'>
            <Text className='font-bold text-sm md:text-xl text-text dark:text-text-dark'>ⓘ Enter current password</Text>
            <View className='flex-1'/>
            <View className='flex-row items-center gap-1 md:gap-2'>
              <CheckBox className="transform scale-75 md:transform md:scale-150" color={colorScheme === 'dark' ? 'white' : '#0818A8'}
              value={!isCurrentPasswordHidden} onValueChange={(newValue) => setIsCurrentPasswordHidden(!newValue)}/>
              <Text className='text-sm md:text-lg text-text dark:text-text-dark'>Show password</Text>
            </View>
          </View>
        </View>

        <View className='w-full h-auto flex-col gap-2'>
          <Text className='text-lg font-bold text-text dark:text-text-dark'>New Password</Text>
          <TextInput placeholder='' className={`h-12 w-full border-2 rounded-md md:w-full md:h-16 ${newPasswordError ? 'border-red-500' : 'border-black'} dark:${newPasswordError ? 'border-red-500' : 'border-white'} dark:text-text-dark`}
          secureTextEntry={isNewPasswordHidden} value={newPassword} onChangeText={(text) => setNewPassword(text)}/>
          <View className='max-w-full flex-row items-center mr-auto mb-2 md:gap-14 md:mb-4'>
            <Text className='font-bold text-sm md:text-xl text-text dark:text-text-dark'>ⓘ Password Strength: </Text>
            <Text className={`font-bold md:text-xl ${strengthTerm === 'Weak'? 'text-red-500': strengthTerm === 'Good'? 'text-lime-400': 'text-green-500'}`}>{strengthTerm}</Text>
            <View className='flex-1'/>
            <View className='flex-row items-center gap-1 md:gap-2'>
              <CheckBox className="transform scale-75 md:transform md:scale-150" color={colorScheme === 'dark' ? 'white' : '#0818A8'}
              value={!isNewPasswordHidden} onValueChange={(newValue) => setIsNewPasswordHidden(!newValue)}/>
              <Text className='text-sm md:text-lg text-text dark:text-text-dark'>Show password</Text>
            </View>
          </View>
        </View>

        <View className='w-full h-auto flex-col gap-2'>
          <TextInput placeholder='Re-enter Password' placeholderTextColor={colorScheme === 'dark' ? '#A0A0A0' : '#606060'}
          className={`h-12 w-full border-2 rounded-md md:w-full md:h-16 ${currentPasswordError ? 'border-red-500' : 'border-black'} dark:${newReEnteredPasswordError ? 'border-red-500' : 'border-white'} dark:text-text-dark`}
          secureTextEntry={isNewReEnterPasswordHidden} value={newReEnteredPassword} onChangeText={(text) => setNewReEnteredPassword(text)}/>
          <View className='max-w-full flex-row items-center mr-auto mb-2 md:gap-14 md:mb-4'>
            <Text className='font-bold text-sm md:text-xl text-text dark:text-text-dark'>ⓘ Re-Enter new password</Text>
            <View className='flex-1'/>
            <View className='flex-row items-center gap-1 md:gap-2'>
              <CheckBox className="transform scale-75 md:transform md:scale-150" color={colorScheme === 'dark' ? 'white' : '#0818A8'}
              value={!isNewReEnterPasswordHidden} onValueChange={(newValue) => setIsNewReEnterPasswordHidden(!newValue)}/>
              <Text className='text-sm md:text-lg text-text dark:text-text-dark'>Show password</Text>
            </View>
          </View>
        </View>

      </View>

      <View className='w-full h-auto flex-row items-center justify-center mb-8'>
        <TouchableOpacity className='h-12 flex-1 bg-gray-400 rounded-md items-center justify-center' onPress={handleClearFields}>
          <Text className='text-lg font-bold text-white'>Clear</Text>
        </TouchableOpacity>
        <View className='w-4'/>
        <TouchableOpacity className='h-12 flex-1 bg-primary rounded-md items-center justify-center' onPress={handleChangePassword}>
          <Text className='text-lg font-bold text-white'>Change</Text>
        </TouchableOpacity>
      </View>

      <View className="flex-row items-center w-full mb-8">
        <View className="flex-1 h-[1px] bg-gray-300" />
        <Text className="px-4 text-gray-500 text-base">or</Text>
        <View className="flex-1 h-[1px] bg-gray-300" />
      </View>

      <TouchableOpacity className='w-auto h-auto items-center justify-center' onPress={() => {router.push('/(settings)/(change-password)/forgot-password')}}>
        <Text className='text-lg font-bold text-primary dark:text-secondary'>Forgot Password</Text>
      </TouchableOpacity>

    </SafeAreaView>
    </>
  )
}

export default ChangePassword