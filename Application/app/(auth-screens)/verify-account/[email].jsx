import { View, Text, SafeAreaView, TouchableOpacity, StatusBar, ActivityIndicator, Alert } from 'react-native'
import React, { useCallback } from 'react'
import { useState, useEffect } from 'react'
import { router, useLocalSearchParams } from 'expo-router';
import axios from 'axios';
import { OtpInput } from "react-native-otp-entry";
import { useFocusEffect } from 'expo-router';
import { API_URL } from '@/constants/links';

const VerifyAccount = () => {

    const {email} = useLocalSearchParams();

    const [submitting, setSubmitting] = useState(false);
    const [resendEmail, setResendEmail] = useState(false);
    const [resetTimer, setResetTimer] = useState(59);
    const [verificationToken, setVerificationToken] = useState('');

   const checkEmail = async () => {
    if (email === null || email === undefined) {
        router.replace('/(auth-screens)/signin');
        return;
    }
    const resendEmail = await axios.post(`${API_URL}/api/v1/auth/resend-verification-token`, {email: email}, 
        { 
            validateStatus: (status) => status < 500, // Only throw errors for 500+ status codes
        }
    );
    return;
   }

    const handleResendEmail = async () => {
        setResendEmail(false);
        setResetTimer(60);
        try {
            const resendEmail = await axios.post(`${API_URL}/api/v1/auth/resend-verification-token`, {email: email}, 
                { 
                    validateStatus: (status) => status < 500, // Only throw errors for 500+ status codes
                }
            );
            return;
            } catch (error) {
                Alert.alert('⚠️ Oops!', `Can't send email at this time. Please contact Customer Support`, [
                    {text: 'OK'},
                ]);
            }
    };

    const handleSubmitVerification = async () => {
        setSubmitting(true);
        try {
            const verifyUser = await axios.post(`${API_URL}/api/v1/auth/verify-user`, {email: email, token: verificationToken.toUpperCase()}, 
                { 
                    validateStatus: (status) => status < 500, // Only throw errors for 500+ status codes
                }
            );
            console.log(verifyUser.data.success);
            if (!verifyUser.data.success) {
                Alert.alert('⚠️ Oops!', `${verifyUser.data.message}`, [
                    {text: 'OK'},
                ]);
                return;
            }
            Alert.alert('🎊Congratulations', `${verifyUser.data.message}. Please login to continue`, [
                {text: 'OK'},
            ]);
            router.replace('/(auth-screens)/signin');
        } catch (error) {
            Alert.alert('⚠️ Oops!', `Can't verify accounts at this time. Please contact Customer Support`, [
                {text: 'OK'},
            ]);
        }
        finally{
            setSubmitting(false);
        }
    };

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
            checkEmail();
        }, [])
    );

  return (
     <SafeAreaView className='h-[100%] w-screen flex items-center flex-col bg-background  md:pt-0 md:justify-center'>
            <View className='w-80 items-start justify-center gap-4 pt-32 md:w-screen md:items-center md:gap-12'>
                <View className='w-80 items-center gap-2 md:w-4/5 overflow-ellipsis md:gap-8'>
                    <Text className='text-base font-bold md:text-4xl'>Verification code has been sent to</Text>
                    <View className='items-center justify-center bg-white border-2 border-black w-80 h-14 rounded-xl md:h-16 md:w-4/5'>
                        <Text className='font-bold text-lg md:text-3xl' numberOfLines={1} ellipsizeMode="tail">{email}</Text>
                    </View>
                </View>
    
                <View className='w-80 items-center justify-center md:w-80'>
                    <OtpInput numberOfDigits={6} type='alphanumeric' onTextChange={(text) => setVerificationToken(text)} focusColor={'#60A5FA'} />
                </View>
    
                <TouchableOpacity className='w-80 items-center justify-center md:w-80' onPress={handleResendEmail} disabled={!resendEmail}>
                    {resendEmail ? (<Text className='text-md text-black'>Resend Email</Text>  ) : (<Text className='text-md text-gray-500'>Resend {resetTimer}</Text>  )}
                </TouchableOpacity>
                                    
                <TouchableOpacity className='w-80 h-12 items-center justify-center bg-primary rounded-md md:w-3/5 md:h-16' onPress={handleSubmitVerification} disabled={submitting}>
                    {submitting ? (<ActivityIndicator size="small" color="#fff" />) : (<Text className='text-lg text-white font-bold '>Submit Verification Code</Text>)}
                </TouchableOpacity>
                </View>
             
    </SafeAreaView>
    )
}

export default VerifyAccount