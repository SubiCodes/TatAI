import { View, Text, StatusBar, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native'
import React from 'react'

import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Entypo from '@expo/vector-icons/Entypo';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';

const SettingsMainPage = () => {

    const router = useRouter();

  return (
    <>
        <StatusBar translucent={false} className='bg-background'/>
        <SafeAreaView className='min-w-screen min-h-screen'>
            <ScrollView className='w-screen h-screen bg-background' contentContainerStyle={{justifyContent: 'center', paddingHorizontal: 32, paddingTop: 80}}>

                <View className='w-full h-auto gap-8 mb-8'>
                    <Text className='text-lg font-bold'>Account Profile</Text>
                    <TouchableOpacity className='w-full h-auto flex-row gap-4 items-center' onPress={() => router.push('/(settings)/edit-profile')}>
                        <Text><MaterialCommunityIcons name="pencil-circle" size={24} color="black" /></Text>
                        <Text className='text-lg'>Edit Profile</Text>
                    </TouchableOpacity>
                </View>

                <View className="flex-row items-center mb-8" style={{width: '100%'}}>
                    <View className="flex-1 h-[2px] bg-[#CBC4C4]" />
                </View>

                <View className='w-full h-auto gap-8 mb-8'>
                    <Text className='text-lg font-bold'>Password and Security</Text>
                    <TouchableOpacity className='w-full h-auto flex-row gap-4 items-center' onPress={() => router.push('/(settings)/change-password')}>
                        <Text><MaterialCommunityIcons name="shield-lock" size={24} color="black" /></Text>
                        <Text className='text-lg'>Change Password</Text>
                    </TouchableOpacity>
                </View>

                <View className="flex-row items-center mb-8" style={{width: '100%'}}>
                    <View className="flex-1 h-[2px] bg-[#CBC4C4]" />
                </View>

                <View className='w-full h-auto mb-8'>
                    <Text className='text-lg font-bold'>Preferences</Text>
                    <Text className='text-lg font-light mb-8'>Personalize your experience on TatAi</Text>
                    <View className='w-full h-auto gap-4'>
                        <TouchableOpacity className='w-full h-auto flex-row gap-4 items-center'>
                            <Text><Entypo name="sound" size={24} color="black" /></Text>
                            <Text className='text-lg'>Tone</Text>
                        </TouchableOpacity>
                        <TouchableOpacity className='w-full h-auto flex-row gap-4 items-center'>
                            <Text><MaterialCommunityIcons name="tools" size={24} color="black" /></Text>
                            <Text className='text-lg'>Tool Knowledge</Text>
                        </TouchableOpacity>
                        <TouchableOpacity className='w-full h-auto flex-row gap-4 items-center'>
                            <Text><Ionicons name="hammer" size={24} color="black" /></Text>
                            <Text className='text-lg'>Repair Expertise</Text>
                        </TouchableOpacity>
                        <TouchableOpacity className='w-full h-auto flex-row gap-4 items-center'>
                            <Text><MaterialIcons name="accessibility" size={24} color="black" /></Text>
                            <Text className='text-lg'>Accessibility</Text>
                        </TouchableOpacity>
                        <TouchableOpacity className='w-full h-auto flex-row gap-4 items-center'>
                            <Text><MaterialIcons name="dark-mode" size={24} color="black" /></Text>
                            <Text className='text-lg'>Dark Mode</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View className="flex-row items-center mb-8" style={{width: '100%'}}>
                    <View className="flex-1 h-[2px] bg-[#CBC4C4]" />
                </View>

                <View className='w-full h-auto gap-8 mb-8'>
                    <Text className='text-lg font-bold'>Others</Text>
                    <View className='w-full h-auto gap-4'>
                        <TouchableOpacity className='w-full h-auto flex-row gap-4 items-center'>
                            <Text><MaterialCommunityIcons name="headphones-box" size={24} color="black" /></Text>
                            <Text className='text-lg'>Contact Us</Text>
                        </TouchableOpacity>
                        <TouchableOpacity className='w-full h-auto flex-row gap-4 items-center'>
                            <Text><Ionicons name="help-circle" size={24} color="black" /></Text>
                            <Text className='text-lg'>Help Center</Text>
                        </TouchableOpacity>
                    </View>
                   
                </View>

                <View className='min-h-24'/>

            </ScrollView>
        </SafeAreaView>
    </>
  )
}

export default SettingsMainPage