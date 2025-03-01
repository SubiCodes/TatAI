import { View, Text, SafeAreaView, ScrollView, TextInput, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { useRouter } from 'expo-router'
import { OtpInput } from "react-native-otp-entry";

const ResetToken = () => {

    const router = useRouter();

    const [time, setTime] = useState('23');

    const submitToken = async () => {
        router.push('/reset-password');
    };

    return (
        <SafeAreaView className='h-[100%] w-screen flex items-center flex-col bg-background pt-32 md:pt-0 md:justify-center'>
                <View className='w-80 items-start justify-center gap-4  md:w-screen md:items-center md:gap-12'>
                    <View className='w-80 items-center gap-2 md:w-4/5 md:gap-8'>
                        <Text className='text-base font-bold md:text-4xl'>Verification code has been sent to</Text>
                        <View className='items-center justify-center bg-white border-2 border-black w-80 h-14 rounded-xl md:h-16 md:w-4/5'>
                            <Text className='font-bold text-lg md:text-3xl'>SampleEmail@gmail.com</Text>
                        </View>
                    </View>

                    <View className='w-80 items-center justify-center md:w-80'>
                        <OtpInput numberOfDigits={6} onTextChange={(text) => setTime(text)} focusColor={'#60A5FA'} />
                    </View>

                    <View className='w-80 items-center justify-center md:w-80'>
                        <Text className='text-md text-gray-500'>Resend {time}</Text>  
                    </View>
                              

                    <TouchableOpacity className='w-80 h-12 items-center justify-center bg-blue-700 rounded-md md:w-3/5 md:h-16' onPress={submitToken}>
                        <Text className='text-lg text-white font-bold '>Submit Token</Text>
                    </TouchableOpacity>
                </View>
        </SafeAreaView>
    )
}

export default ResetToken