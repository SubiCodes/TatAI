import { View, Text, StatusBar, SafeAreaView, TextInput, Modal, ActivityIndicator, Alert, TouchableOpacity } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useCallback, useEffect } from 'react';
import React from 'react'
import { useFocusEffect } from 'expo-router';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import { API_URL } from '@/constants/links.js';
import { useColorScheme } from 'nativewind';

import userStore from '@/store/user.store';

const PreferredName = () => {

  const preference = userStore((state) => state.preference);
  const getUserPreference = userStore((state) => state.getUserPreference);
  const updateUserPreference = userStore((state) => state.updateUserPreference);

  const {colorScheme, toggleColorScheme} = useColorScheme();
  const [preferredName, setPreferredName] = useState('Something');
  
  const [fetchingData, setFetchingData] = useState(false);
  const [fetchingError, setFetchingError] = useState(false);
  
  const [loading, setLoading] = useState(false);
  
  const getPreference = async () => {
    setFetchingData(true);
    try {
      const res = await getUserPreference();
      setPreferredName(preference?.preferredName);
    } catch (error) {
      console.log(error.message);
      setFetchingError(true);
      Alert.alert("⚠️Oops", "Error Fetching User Preference");
    } finally{
      setFetchingData(false);
    }
  };

  const handleSaveChange = async () => {
    setLoading(true);
    try {
        const res = await updateUserPreference({preferredName: preferredName})
        Alert.alert("Change Successful", res);
    } catch (error) {
        Alert.alert("Oops", error.message);
    }finally{
        setLoading(false);
        getUserPreference();
    }
}

  useFocusEffect(
      useCallback(() => {
        getPreference();
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
    <SafeAreaView className='min-w-screen min-h-screen bg-background px-8 pt-32 gap-8 dark:bg-background-dark'>

      {fetchingData ? (
          <View className='w-full h-auto flex-col mb-4 gap-2'>
            <ActivityIndicator color={'#0818A8'} size={32}/>
          </View>
        ) : fetchingError ? (
          <View className='w-full h-screen items-center gap-6'>
            <Text className='text-xl font-bold text-red-500'>Error fetching preference.</Text>
            <TouchableOpacity className='w-40 h-8 items-center justify-center bg-primary rounded-3xl dark:text-text-dark' onPress={getUserPreference}>
              <Text className='text-lg font-bold text-white'>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : (
        <>
          <Modal visible={loading} transparent={true}>
            <View className='w-screen h-screen items-center justify-center' style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
              <View className='w-4/5 h-auto bg-white items-center gap-8 py-12 justify-center rounded-xl'>
                <Text className='text-2xl font-bold text-text'>Changing Preferred Name</Text>
                <ActivityIndicator color={'#0818A8'} size={32}/>
                <Text className='text-base font-light text-text'>This may take a while...</Text>
              </View>
            </View>
          </Modal>

          <View className='w-full h-auto flex-col mb-4 gap-2'>
              <Text className='text-xl font-bold text-text dark:text-text-dark'>Preferred Name</Text>
              <Text className='text-text dark:text-text-dark'>Select what the TatAi Calls you.</Text>
          </View>
          
          <View className='w-full h-auto'>
            <TextInput className='w-full h-auto border-b-2 border-gray-400 text-text dark:text-text-dark'
            value={preferredName} onChangeText={(text) => setPreferredName(text)}/>
          </View>

          <TouchableOpacity className='w-full h-12 mt-2 rounded-md items-center justify-center bg-primary' onPress={handleSaveChange}>
            <Text className='text-xl font-bold text-white'>Save</Text>
          </TouchableOpacity>
        </>
        )}
    </SafeAreaView>
    </>
  )
}

export default PreferredName