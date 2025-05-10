import { View, Text, StatusBar, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native'
import React, { useEffect } from 'react'

import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Entypo from '@expo/vector-icons/Entypo';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { useColorScheme } from 'nativewind';
import AsyncStorage from '@react-native-async-storage/async-storage';


const SettingsMainPage = () => {

    const {colorScheme, toggleColorScheme} = useColorScheme();
    const router = useRouter();

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
        <SafeAreaView className='min-w-screen min-h-screen'>
            <ScrollView className='w-screen h-screen bg-background dark:bg-background-dark' contentContainerStyle={{justifyContent: 'center', paddingHorizontal: 32, paddingTop: 80}}>

                <View className='w-full h-auto gap-8 mb-8'>
                    <Text className='text-lg font-bold text-text dark:text-text-dark'>Account Profile</Text>
                    <TouchableOpacity className='w-full h-auto flex-row gap-4 items-center' onPress={() => router.push('/(settings)/edit-profile')}>
                        <Text className='text-text dark:text-text-dark'><MaterialCommunityIcons name="pencil-circle" size={24}/></Text>
                        <Text className='text-lg text-text dark:text-text-dark'>Edit Profile</Text>
                    </TouchableOpacity>
                </View>

                <View className="flex-row items-center mb-8 text-text dark:text-text-dark" style={{width: '100%'}}>
                    <View className="flex-1 h-[2px] bg-[#CBC4C4]" />
                </View>

                <View className='w-full h-auto gap-8 mb-8'>
                    <Text className='text-lg font-bold text-text dark:text-text-dark'>Password and Security</Text>
                    <TouchableOpacity className='w-full h-auto flex-row gap-4 items-center' onPress={() => router.push('/(settings)/change-password')}>
                        <Text className='text-text dark:text-text-dark'><MaterialCommunityIcons name="shield-lock" size={24}/></Text>
                        <Text className='text-lg text-text dark:text-text-dark'>Change Password</Text>
                    </TouchableOpacity>
                </View>

                <View className="flex-row items-center mb-8" style={{width: '100%'}}>
                    <View className="flex-1 h-[2px] bg-[#CBC4C4]" />
                </View>

                <View className='w-full h-auto mb-8'>
                    <Text className='text-lg font-bold text-text dark:text-text-dark'>Preferences</Text>
                    <Text className='text-lg font-light mb-8 text-text dark:text-text-dark'>Personalize your experience on TatAi</Text>
                    <View className='w-full h-auto gap-4'>
                        <TouchableOpacity className='w-full h-auto flex-row gap-4 items-center' onPress={() => router.push('/(settings)/preferred-name')}>
                            <Text className='text-text dark:text-text-dark'><FontAwesome name="id-card" size={24}/></Text>
                            <Text className='text-lg text-text dark:text-text-dark'>Preferred Name</Text>
                        </TouchableOpacity>
                        <TouchableOpacity className='w-full h-auto flex-row gap-4 items-center' onPress={() => router.push('/(settings)/tone')}>
                            <Text className='text-text dark:text-text-dark'><Entypo name="sound" size={24}/></Text>
                            <Text className='text-lg text-text dark:text-text-dark'>Tone</Text>
                        </TouchableOpacity>
                        <TouchableOpacity className='w-full h-auto flex-row gap-4 items-center' onPress={() => router.push('/(settings)/tool-knowledge')}>
                            <Text className='text-text dark:text-text-dark'><MaterialCommunityIcons name="tools" size={24}/></Text>
                            <Text className='text-lg text-text dark:text-text-dark'>Tool Knowledge</Text>
                        </TouchableOpacity>
                        <TouchableOpacity className='w-full h-auto flex-row gap-4 items-center' onPress={() => router.push('/(settings)/repair-expertise')}>
                            <Text className='text-text dark:text-text-dark'><Ionicons name="hammer" size={24} /></Text>
                            <Text className='text-lg text-text dark:text-text-dark'>Repair Expertise</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View className="flex-row items-center mb-8" style={{width: '100%'}}>
                    <View className="flex-1 h-[2px] bg-[#CBC4C4]" />
                </View>

                <View className='w-full h-auto  mb-8'>
                    <Text className='text-lg font-bold text-text dark:text-text-dark'>Accessibility</Text>
                    <Text className='text-lg font-light mb-8 text-text dark:text-text-dark'>Enhance accesibility on the TatAI app.</Text>
                    <View className='w-full h-auto gap-4'>
                        <TouchableOpacity className='w-full h-auto flex-row gap-4 items-center' onPress={() => router.push('/(settings)/dark-mode')}>
                            <Text className='text-text dark:text-text-dark'><MaterialIcons name="dark-mode" size={24}/></Text>
                            <Text className='text-lg text-text dark:text-text-dark'>Dark Mode</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View className="flex-row items-center mb-8" style={{width: '100%'}}>
                    <View className="flex-1 h-[2px] bg-[#CBC4C4]" />
                </View>

                <View className='w-full h-auto gap-8 mb-8'>
                    <Text className='text-lg font-bold text-text dark:text-text-dark'>Others</Text>
                    <View className='w-full h-auto gap-4'>
                        <TouchableOpacity className='w-full h-auto flex-row gap-4 items-center' onPress={() => router.push('/(settings)/contact-us')}>
                            <Text className='text-text dark:text-text-dark'><MaterialCommunityIcons name="headphones-box" size={24}/></Text>
                            <Text className='text-lg text-text dark:text-text-dark'>Contact Us</Text>
                        </TouchableOpacity>
                        <TouchableOpacity className='w-full h-auto flex-row gap-4 items-center'>
                            <Text className='text-text dark:text-text-dark'><Ionicons name="help-circle" size={24}/></Text>
                            <Text className='text-lg text-text dark:text-text-dark '>Help Center</Text>
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