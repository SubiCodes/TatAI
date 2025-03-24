import { View, Text, SafeAreaView, ScrollView, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native'
import React, { useCallback, useState, useEffect } from 'react'
import { useFocusEffect, useRouter } from 'expo-router'
import { OtpInput } from "react-native-otp-entry";
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_URL } from '@/constants/links';

const ResetToken = () => {

    const [loadingResource, setLoadingResource] = useState(true);
    const [loading, setLoading] = useState(true);
    const [resendEmail, setResendEmail] = useState(false);
    const [resetTimer, setResetTimer] = useState(59);
    const [token, setToken] = useState();
    const [email, setEmail] = useState('');
    const [errors, setErrors] = useState('');
    const router = useRouter();

    const emailResetExist = async() => {
        const email = await AsyncStorage.getItem('reset-request-email');
        if (!email){
            router.replace('/(auth-screens)/forgot-password');
        }
        setEmail(email);
        setLoadingResource(false);
    }

    useEffect(() => {
        if (resetTimer > 0) {
            const timer = setTimeout(() => setResetTimer(resetTimer - 1), 1000);
            return () => clearTimeout(timer); // Cleanup timer on unmount
        }else {
            setResendEmail(true);
        }
    }, [resetTimer]);

    useFocusEffect(
        useCallback(() => {
            emailResetExist();
        }, [])
    );

    const handleResendEmail = async () => {
        setResendEmail(false);
        setResetTimer(59);
        
        try {
            const resToken = await axios.post(`${API_URL}/api/v1/auth/get-reset-token`, {email: email}, 
                { 
                  validateStatus: (status) => status < 500, // Only throw errors for 500+ status codes
                }
            );
            if (!resToken) {
                console.log("No res token existing");
            }
            console.log(resToken.data.resetToken);
            
            const res = await axios.post(`${API_URL}/api/v1/auth/resend-reset-password-token`, {email: email, token: resToken.data.resetToken.toUpperCase()}, 
            { 
              validateStatus: (status) => status < 500, // Only throw errors for 500+ status codes
            });
            if (!res.data.success){
                Alert.alert('⚠️ Oops!', res.data.message, [
                    {text: 'OK'},
                ]);
                return;
            }
            Alert.alert('✅ Success!', res.data.message, [
                {text: 'OK'},
            ]);
            return;

        } catch (error) {
            Alert.alert('⚠️ Oops!', error.messsage, [
                {text: 'OK'},
            ]);
            console.log(email);
            console.log(error.message);
        }
    }

    const submitToken = async () => {
        setLoading(true);
        setErrors('');
        try {
            const res = await axios.post(`${API_URL}/api/v1/auth/get-reset-token`, {email: email}, 
                { 
                  validateStatus: (status) => status < 500, // Only throw errors for 500+ status codes
                }
            );
            if(!res.data.success) {
                router.replace('/(auth-screens)/forgot-password');
            };
            const resetToken = res.data.resetToken;
            if (resetToken.toUpperCase() !== token.toUpperCase()){
                setLoading(false);
                setErrors('⚠️ Invalid token!');
                Alert.alert('⚠️ Oops!', `Token input mismatch token`, [
                    {text: 'OK'},
                ]);
                return;
            };
            if (resetToken.toUpperCase() === token.toUpperCase()){
                setLoading(false);
                await router.push('/(auth-screens)/reset-password');
                return;
            };

        } catch (error) {
            Alert.alert('⚠️ Oops!', 'An error occured', [
                {text: 'OK'},
            ]);
            console.log(error.message);
        }
    };

    return (
        <SafeAreaView className='h-[100%] w-screen flex items-center flex-col bg-background  md:pt-0 md:justify-center'>

                {loadingResource ? (
                    <View className='h-screen items-center justify-center '>
                        <ActivityIndicator size="large" color="#0818A8"/>
                    </View> 
                ) : (
                    <View className='w-80 items-start justify-center gap-4 pt-32 md:w-screen md:items-center md:gap-12'>
                        <View className='w-80 items-center gap-2 md:w-4/5 overflow-ellipsis md:gap-8'>
                            <Text className='text-base font-bold md:text-4xl'>Verification code has been sent to</Text>
                            <View className='items-center justify-center bg-white border-2 border-black w-80 h-14 rounded-xl md:h-16 md:w-4/5'>
                                <Text className='font-bold text-lg md:text-3xl' numberOfLines={1} 
                                ellipsizeMode="tail">{email}</Text>
                            </View>
                        </View>

                        <View className='w-80 items-center justify-center md:w-80'>
                            <OtpInput numberOfDigits={6} type='alphanumeric' onTextChange={(text) => setToken(text)} focusColor={'#60A5FA'} />
                        </View>

                        <TouchableOpacity className='w-80 items-center justify-center md:w-80' onPress={handleResendEmail} disabled={!resendEmail}>
                            {resendEmail ? (<Text className='text-md text-black'>Resend Email</Text>  ) : (<Text className='text-md text-gray-500'>Resend {resetTimer}</Text>  )}
                        </TouchableOpacity>
                                

                        <TouchableOpacity className='w-80 h-12 items-center justify-center bg-primary rounded-md md:w-3/5 md:h-16' onPress={submitToken}>
                            <Text className='text-lg text-white font-bold '>Submit Token</Text>
                        </TouchableOpacity>
                    </View>
                )}
        </SafeAreaView>
    )
}

export default ResetToken