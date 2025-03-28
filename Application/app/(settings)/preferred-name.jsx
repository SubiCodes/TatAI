import { View, Text, StatusBar, SafeAreaView, TextInput, Modal, ActivityIndicator, Alert, TouchableOpacity } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useCallback } from 'react';
import React from 'react'
import { useFocusEffect } from 'expo-router';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import { API_URL } from '@/constants/links.js';

const PreferredName = () => {

  const [preferredName, setPreferredName] = useState('Something');
  
  const [fetchingData, setFetchingData] = useState(false);
  const [fetchingError, setFetchingError] = useState(false);
  
  const [loading, setLoading] = useState(false);
  
  const getUserPreference = async () => {
    setFetchingData(true);
    const token = await AsyncStorage.getItem('token');
    const decryptedToken = jwtDecode(token);
    try {
      const preference = await axios.get(`${API_URL}/api/v1/preference/${decryptedToken.userID}`, { 
        validateStatus: (status) => status < 500,
      });
      
      if (!preference.data.success) {
        Alert.alert("⚠️Oops", preference.data.message);
        return;
      }
      setPreferredName(preference.data.data.preferredName);
      return;
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
    const token = await AsyncStorage.getItem('token');
    const decryptedToken = jwtDecode(token);
    try {
        const res = await axios.put(`${API_URL}/api/v1/preference/${decryptedToken.userID}`, {preferredName: preferredName},{ 
            validateStatus: (status) => status < 500,
        });
        if(!res.data.success){
            Alert.alert("⚠️Oops", res.data.message);
            return;
        };
        Alert.alert("🎊Change Successful", res.data.message);
    } catch (error) {
        Alert.alert("⚠️Oops", error.message);
    }finally{
        setLoading(false);
        getUserPreference();
    }
}

  useFocusEffect(
      useCallback(() => {
          getUserPreference();
      }, [])
  );

  return (
    <>
    <StatusBar translucent={false} className='bg-background'/>
    <SafeAreaView className='min-w-screen min-h-screen bg-background px-8 pt-32 gap-8'>

      {fetchingData ? (
          <View className='w-full h-auto flex-col mb-4 gap-2'>
            <ActivityIndicator color={'#0818A8'} size={32}/>
          </View>
        ) : fetchingError ? (
          <View className='w-full h-screen items-center gap-6'>
            <Text className='text-xl font-bold text-red-500'>Error fetching preference.</Text>
            <TouchableOpacity className='w-40 h-8 items-center justify-center bg-primary rounded-3xl' onPress={getUserPreference}>
              <Text className='text-lg font-bold text-white'>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : (
        <>
          <Modal visible={loading} transparent={true}>
            <View className='w-screen h-screen items-center justify-center' style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
              <View className='w-4/5 h-auto bg-white items-center gap-8 py-12 justify-center rounded-xl'>
                <Text className='text-2xl font-bold'>Changing Repair Expertise</Text>
                <ActivityIndicator color={'#0818A8'} size={32}/>
                <Text className='text-base font-light'>This may take a while...</Text>
              </View>
            </View>
          </Modal>

          <View className='w-full h-auto flex-col mb-4 gap-2'>
              <Text className='text-xl font-bold'>Preferred Name</Text>
              <Text>Select what the TatAi Calls you.</Text>
          </View>
          
          <View className='w-full h-auto'>
            <TextInput className='w-full h-auto border-b-2 border-gray-400'
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