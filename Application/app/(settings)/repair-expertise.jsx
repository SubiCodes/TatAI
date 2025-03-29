import { View, Text, StatusBar, SafeAreaView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native'
import { Modal } from 'react-native';
import React, { useCallback, useState } from 'react'

import Ionicons from '@expo/vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import { API_URL } from '@/constants/links';
import { useFocusEffect } from 'expo-router';

const RepairExpertise = () => {

    const [activeRadioButton, setActiveRadioButton] = useState('formal');

    const [fetchingData, setFetchingData] = useState(false);
    const [fetchingError, setFetchingError] = useState(false);

    const [loading, setLoading] = useState(false);

    const handleSaveChange = async () => {
        setLoading(true);
        const token = await AsyncStorage.getItem('token');
        const decryptedToken = jwtDecode(token);
        try {
            const res = await axios.put(`${API_URL}/api/v1/preference/${decryptedToken.userID}`, {skillLevel: activeRadioButton},{ 
                validateStatus: (status) => status < 500,
            });
            if(!res.data.success){
                Alert.alert("⚠️Oops", res.data.message);
                return;
            };
            Alert.alert("Change Successful", res.data.message);
        } catch (error) {
            Alert.alert("⚠️Oops", error.message);
        }finally{
            setLoading(false);
            getUserPreference();
        }
    }

    const getUserPreference = async () => {
        setFetchingData(true);
        const token = await AsyncStorage.getItem('token');
        const decryptedToken = jwtDecode(token);
        try {
            const preference = await axios.get(`${API_URL}/api/v1/preference/${decryptedToken.userID}`, { 
                validateStatus: (status) => status < 500,
            });
            if(!preference.data.success){
                Alert.alert("⚠️Oops", preference.data.message);
                return;
            };
            setActiveRadioButton(preference.data.data.skillLevel);
            return;
        } catch (error) {
            setFetchingError(true)
            Alert.alert("⚠️Oops", 'Error fetching data.');
        }finally{
            setFetchingData(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            getUserPreference();
        }, [])
    )

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
                        <Text className='text-lg font-bold text-text dark:text-text-dark'>Retry</Text>
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
                <Text className='text-xl font-bold text-text dark:text-text-dark'>Repair Expertise</Text>
                <Text className='text-text dark:text-text-dark'>Select your repair expertise level.</Text>
            </View>

            <View className='w-full h-auto flex-col gap-6 px-2'>


                <TouchableOpacity className='w-full h-auto flex-row' onPress={() => setActiveRadioButton('beginner')}>
                    <Text className='text-lg font-bold flex-1 text-text dark:text-text-dark'>Beginner</Text>
                    {activeRadioButton === 'beginner' ? (<Text className='text-text dark:text-text-dark'><Ionicons name="radio-button-on" size={24}/></Text>) : (<Text className='text-text dark:text-text-dark' ><Ionicons name="radio-button-off-sharp" size={24}/></Text>)}
                </TouchableOpacity>
                <TouchableOpacity className='w-full h-auto flex-row' onPress={() => setActiveRadioButton('intermediate')}>
                    <Text className='text-lg font-bold flex-1 text-text dark:text-text-dark'>Intermediate</Text>
                    {activeRadioButton === 'intermediate' ? (<Text className='text-text dark:text-text-dark'><Ionicons name="radio-button-on" size={24}/></Text>) : (<Text className='text-text dark:text-text-dark'><Ionicons name="radio-button-off-sharp" size={24}/></Text>)}
                </TouchableOpacity>
                <TouchableOpacity className='w-full h-auto flex-row' onPress={() => setActiveRadioButton('advance')}>
                    <Text className='text-lg font-bold flex-1 text-text dark:text-text-dark'>Advance</Text>
                    {activeRadioButton === 'advance' ? (<Text className='text-text dark:text-text-dark'><Ionicons name="radio-button-on" size={24}/></Text>) : (<Text className='text-text dark:text-text-dark'><Ionicons name="radio-button-off-sharp" size={24} /></Text>)}
                </TouchableOpacity>
                <TouchableOpacity className='w-full h-auto flex-row' onPress={() => setActiveRadioButton('expert')}>
                    <Text className='text-lg font-bold flex-1 text-text dark:text-text-dark'>Expert</Text>
                    {activeRadioButton === 'expert' ? (<Text className='text-text dark:text-text-dark'><Ionicons name="radio-button-on" size={24}/></Text>) : (<Text className='text-text dark:text-text-dark'><Ionicons name="radio-button-off-sharp" size={24} /></Text>)}
                </TouchableOpacity>
                <TouchableOpacity className='w-full h-auto flex-row' onPress={() => setActiveRadioButton('professional')}>
                    <Text className='text-lg font-bold flex-1 text-text dark:text-text-dark'>Professional</Text>
                    {activeRadioButton === 'professional' ? (<Text className='text-text dark:text-text-dark'><Ionicons name="radio-button-on" size={24}/></Text>) : (<Text className='text-text dark:text-text-dark'><Ionicons name="radio-button-off-sharp" size={24} /></Text>)}
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

export default RepairExpertise