import { View, Text, StatusBar, SafeAreaView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native'
import { Modal } from 'react-native';
import React, { useCallback, useState, useEffect } from 'react'

import Ionicons from '@expo/vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import { API_URL } from '@/constants/links';
import { useFocusEffect } from 'expo-router';
import { useColorScheme } from 'nativewind';

import userStore from '@/store/user.store';


const Tone = () => {

    const preference = userStore((state) => state.preference);
    const getUserPreference = userStore((state) => state.getUserPreference);
    const updateUserPreference = userStore((state) => state.updateUserPreference);

    const {colorScheme, toggleColorScheme} = useColorScheme();

    const [activeRadioButton, setActiveRadioButton] = useState('formal');

    const [fetchingData, setFetchingData] = useState(false);
    const [fetchingError, setFetchingError] = useState(false);

    const [loading, setLoading] = useState(false);

    const handleSaveChange = async () => {
      setLoading(true);
      try {
        const res = await updateUserPreference({
          preferredTone: activeRadioButton,
        });
        Alert.alert("Change Successful", res);
      } catch (error) {
        Alert.alert("Oops", error.message);
      } finally {
        setLoading(false);
        getUserPreference();
      }
    };

    const getPreference = async () => {
      setFetchingData(true);
      try {
        const res = await getUserPreference();
        setActiveRadioButton(preference?.preferredTone);
      } catch (error) {
        console.log(error.message);
        setFetchingError(true);
        Alert.alert("⚠️Oops", "Error Fetching User Preference");
      } finally {
        setFetchingData(false);
      }
    };

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
                    <TouchableOpacity className='w-40 h-8 items-center justify-center bg-primary rounded-3xl' onPress={getUserPreference}>
                        <Text className='text-lg font-bold text-white dark:text-text-dark'>Retry</Text>
                    </TouchableOpacity>
                </View>
            ) : (
            <>

            <Modal visible={loading} transparent={true}>
                <View className='w-screen h-screen items-center justify-center' style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
                    <View className='w-4/5 h-auto bg-white items-center gap-8 py-12 justify-center rounded-xl'>
                        <Text className='text-2xl font-bold text-text'>Changing Preferred Tone</Text>
                        <ActivityIndicator color={'#0818A8'} size={32}/>
                        <Text className='text-base font-light text-text'>This may take a while...</Text>
                    </View>
                </View>
            </Modal>

            <View className='w-full h-auto flex-col mb-4 gap-2'>
                <Text className='text-xl font-bold text-text dark:text-text-dark'>Tone</Text>
                <Text className='text-text dark:text-text-dark'>Select your preferred AI's tone.</Text>
            </View>

            <View className='w-full h-auto flex-col gap-6 px-2'>
                <TouchableOpacity className='w-full h-auto flex-row' onPress={() => setActiveRadioButton('formal')}>
                    <Text className='text-lg font-bold flex-1 text-text dark:text-text-dark'>Formal</Text>
                    {activeRadioButton === 'formal' ? (<Text className='text-text dark:text-text-dark'><Ionicons name="radio-button-on" size={24}/></Text>) : (<Text className='text-text dark:text-text-dark'><Ionicons name="radio-button-off-sharp" size={24}/></Text>)}
                </TouchableOpacity>
                <TouchableOpacity className='w-full h-auto flex-row' onPress={() => setActiveRadioButton('casual')}>
                    <Text className='text-lg font-bold flex-1 text-text dark:text-text-dark'>Casual</Text>
                    {activeRadioButton === 'casual' ? (<Text className='text-text dark:text-text-dark'><Ionicons name="radio-button-on" size={24}/></Text>) : (<Text className='text-text dark:text-text-dark'><Ionicons name="radio-button-off-sharp" size={24}/></Text>)}
                </TouchableOpacity>
                <TouchableOpacity className='w-full h-auto flex-row' onPress={() => setActiveRadioButton('soft spoken')}>
                    <Text className='text-lg font-bold flex-1 text-text dark:text-text-dark'>Soft Spoken</Text>
                    {activeRadioButton === 'soft spoken' ? (<Text className='text-text dark:text-text-dark'><Ionicons name="radio-button-on" size={24}/></Text>) : (<Text className='text-text dark:text-text-dark'><Ionicons name="radio-button-off-sharp" size={24}/></Text>)}
                </TouchableOpacity>
                <TouchableOpacity className='w-full h-auto flex-row' onPress={() => setActiveRadioButton('strict')}>
                    <Text className='text-lg font-bold flex-1 text-text dark:text-text-dark'>Strict</Text>
                    {activeRadioButton === 'strict' ? (<Text className='text-text dark:text-text-dark'><Ionicons name="radio-button-on" size={24}/></Text>) : (<Text className='text-text dark:text-text-dark'><Ionicons name="radio-button-off-sharp" size={24}/></Text>)}
                </TouchableOpacity>
            </View>

            <View className="flex-row items-center mb-4" style={{width: '100%'}}>
                <View className="flex-1 h-[2px] bg-[#CBC4C4]" />
            </View>

            <TouchableOpacity className='w-full h-12 rounded-md items-center justify-center bg-primary' onPress={handleSaveChange}>
                <Text className='text-xl font-bold text-white'>Save</Text>
            </TouchableOpacity>
        </>
        )}
            
        </SafeAreaView>
    </>
  )
}

export default Tone