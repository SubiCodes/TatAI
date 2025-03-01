import { View, Text, SafeAreaView, ScrollView, TextInput, TouchableOpacity } from 'react-native'
import React from 'react'
import { useRouter } from 'expo-router'

//testing purposes
//border-2 border-yellow-300

const ForgotPassword = () => {

    const router = useRouter();

    const submitEmail = async() => {
        router.push('/reset-token')
    }

    return (
        <SafeAreaView className='h-[100%] w-screen flex items-center flex-col bg-background pt-32 md:pt-0 md:justify-center'>
            <View className='w-80 items-start justify-center gap-4  md:w-screen md:items-center md:gap-12'>
                

                <View className='w-80 items-start gap-2 md:w-3/5'>
                    <Text className='text-4xl font-extrabold mb-6 md:text-5xl md:mb-10'>Forgot Password</Text>
                    <Text className='text-base font-bold md:text-2xl'>Email Address</Text>
                    <TextInput placeholder='Email Address' className='h-12 w-80 border-black border-2 rounded-md md:w-full md:h-16'></TextInput>
                    <Text className='font-bold md:text-xl'>ⓘ Enter you email address</Text>
                </View>

                <TouchableOpacity className='w-80 h-12 items-center justify-center bg-blue-700 rounded-md md:w-3/5' onPress={submitEmail}>
                    <Text className='text-lg text-white font-bold '>Submit Email</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

export default ForgotPassword