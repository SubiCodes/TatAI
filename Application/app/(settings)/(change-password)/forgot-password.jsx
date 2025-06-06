import { View, Text, SafeAreaView, ScrollView, TextInput, TouchableOpacity, ActivityIndicator, Alert, StatusBar } from 'react-native'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'expo-router'
import axios from 'axios'
import { API_URL } from '@/constants/links.js'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useColorScheme } from 'nativewind'

//testing purposes
//border-2 border-yellow-300

const ForgotPassword = () => {

    const {colorScheme, toggleColorScheme} = useColorScheme();
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [errors, setErrors] = useState("");
    const [loading, setLoading] = useState(false);

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

    const submitEmail = async() => {
        setErrors('');
        setLoading(true);
        try {
            if (email.trim() === ""){
                setLoading(false);
                setErrors("Please enter a valid email.");
                Alert.alert('Empty Field', 'Please enter a valid email.', [
                    {text: 'OK'},
                ]);
                return;
            }
            const res = await axios.post(`${API_URL}/api/v1/auth/forgot-password`, {email: email}, 
                { 
                  validateStatus: (status) => status < 500, // Only throw errors for 500+ status codes
                }
              );
            if(!res.data.success) {
                setLoading(false);
                setErrors(res.data.message);
                Alert.alert('⚠️ Oops!', res.data.message, [
                    {text: 'OK'},
                ]);
                return;
            };
            if(res.data.success){
                setLoading(false);
                const emailRes = await axios.post(`${API_URL}/api/v1/auth/resend-reset-password-token`, {email: res.data.userEmail, token: res.data.resetToken.toUpperCase()});
                if (!emailRes.data.success){
                    Alert.alert('⚠️ Oops!', res.data.message, [
                        {text: 'OK'},
                    ]);
                    return;
                }
                await AsyncStorage.setItem('reset-request-email', res.data.userEmail);
                await AsyncStorage.setItem('reset-request-token', res.data.resetToken);
                await router.push('/(change-password)/reset-token');
            };

        } catch (error) {
            setLoading(false);
            console.log(error.message);
        }
    }

    return (

        <>
            <StatusBar translucent={false} className='bg-background dark:bg-background-dark'/>
            <SafeAreaView className='h-[100%] w-screen flex items-center flex-col bg-background pt-32 md:pt-0 md:justify-center dark:bg-background-dark'>
                <View className='w-80 items-start justify-center gap-4  md:w-screen md:items-center md:gap-12'>
                    
                    <View className='w-80 items-start gap-2 md:w-3/5'>
                        <Text className='text-4xl font-extrabold mb-6 md:text-5xl md:mb-10 text-text dark:text-text-dark'>Forgot Password</Text>
                        <Text className='text-base font-bold md:text-2xl text-text dark:text-text-dark'>Email Address</Text>
                        <TextInput placeholder='Email Address' placeholderTextColor={colorScheme === 'dark' ? '#A0A0A0' : '#606060'}
                        className='h-12 w-80 border-black border-2 rounded-md md:w-full md:h-16 dark:border-white dark:text-text-dark' 
                        onChangeText={(text) => setEmail(text)}></TextInput>
                        <Text className='font-bold md:text-xl text-text dark:text-text-dark'>ⓘ Enter you email address</Text>
                    </View>

                    <TouchableOpacity className='w-80 h-12 items-center justify-center bg-primary rounded-md md:w-3/5' onPress={submitEmail} disabled={loading}>
                        {loading ? (<ActivityIndicator size="small" color="white"/>) : (<Text className='text-lg text-white font-bold '>Submit Email</Text>)}
                    </TouchableOpacity>

                </View>
            </SafeAreaView>
        </>
    )
}

export default ForgotPassword