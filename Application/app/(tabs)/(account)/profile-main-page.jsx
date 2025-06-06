import { View, Text, TextInput, TouchableOpacity, StatusBar, SafeAreaView, Image, ActivityIndicator} from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { router } from 'expo-router'
import { useFocusEffect, useRouter } from 'expo-router'
import Dropdown from '@/components/dropdown.tsx'
import DateTimePicker from "@react-native-community/datetimepicker";
import FetchingDataScreen from '@/components/fetching-data-screen.jsx';
import AsyncStorage from '@react-native-async-storage/async-storage';

import empty_profile from '@/assets/images/profile-icons/empty_profile.png'
import boy_1 from '@/assets/images/profile-icons/boy_1.png'
import boy_2 from '@/assets/images/profile-icons/boy_2.png'
import boy_3 from '@/assets/images/profile-icons/boy_3.png'
import boy_4 from '@/assets/images/profile-icons/boy_4.png'
import girl_1 from '@/assets/images/profile-icons/girl_1.png'
import girl_2 from '@/assets/images/profile-icons/girl_2.png'
import girl_3 from '@/assets/images/profile-icons/girl_3.png'
import girl_4 from '@/assets/images/profile-icons/girl_4.png'
import lgbt_1 from '@/assets/images/profile-icons/lgbt_1.png'
import lgbt_2 from '@/assets/images/profile-icons/lgbt_2.png'
import lgbt_3 from '@/assets/images/profile-icons/lgbt_3.png'
import lgbt_4 from '@/assets/images/profile-icons/lgbt_4.png'

import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Ionicons from '@expo/vector-icons/Ionicons';
import Feather from '@expo/vector-icons/Feather';

import userStore from '@/store/user.store';

const Profile = () => {
    const user = userStore((state) => state.user);
    const isLoading = userStore((state) => state.isLoading);
    const error = userStore((state) => state.error);
    const checkUserLoggedIn = userStore((state) => state.checkUserLoggedIn);
    const getUserInfo = userStore((state) => state.getUserInfo);
    const logoutUser = userStore((state) => state.logoutUser);
    const getUserInfoBG = userStore((state) => state.getUserInfoBG);

    const profileIcons = {
          empty_profile: empty_profile,
          boy_1: boy_1,
          boy_2: boy_2,
          boy_3: boy_3,
          boy_4: boy_4,
          girl_1: girl_1,
          girl_2: girl_2,
          girl_3: girl_3,
          girl_4: girl_4,
          lgbt_1: lgbt_1,
          lgbt_2: lgbt_2,
          lgbt_3: lgbt_3,
          lgbt_4: lgbt_4,
    }

    const checkLoggedIn = async () => {
        checkUserLoggedIn();
    };

    const getUserData = async () => {
        if (!user) {
            getUserInfo();
        }
    }

    useFocusEffect(
        useCallback(() => {
            getUserInfoBG();
        }, [])
    )

    

    return (
        <>
            {isLoading ? (
                    <FetchingDataScreen/>
                ) : error ? (
                    <View className='w-screen h-screen items-center justify-center gap-4 bg-background dark:bg-background-dark'>
                         <Text className='text-3xl font-extrabold text-red-500'>Network Error</Text>
                                  <Text>Please connect to a stable internet.</Text>
                        <TouchableOpacity className='w-44 h-8 items-center justify-center bg-primary rounded-xl' onPress={() => {checkLoggedIn(); getUserData()}}>
                            <Text className='font-bold text-white text-lg'>Retry</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
            <SafeAreaView className="h-screen w-screen flex-col items-center bg-background px-8 py-4 gap-4 dark:bg-background-dark">
                
                <View className='w-full flex flex-col justify-end items-center gap-4 pb-8' style={{height: '48%'}}>
                   
                    <View className='w-52 h-52 flex flex-col justify-center items-center bg-[#A9A9A9] rounded-full'>
                        <Image source={profileIcons[user.profileIcon]} className='max-w-48 h-auto' resizeMode='contain'/>
                        <TouchableOpacity 
                        className='w-12 h-12 bg-primary rounded-full items-center justify-center'
                        style={{
                            position: 'absolute',
                            bottom: 24,
                            right: 12,
                            transform: [{ translateX: 10 }, { translateY: 10 }], 
                            elevation: 5, 
                            }}
                            onPress={() => router.push('/(tabs)/(account)/edit-profile')}
                        >
                            <Text className="text-white text-4xl">
                            <MaterialCommunityIcons name="pencil" size={24} color="white"/>
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <View className='w-full items-center justify-center flex-row gap-4'>
                        <View className={`w-2 h-2 rounded-full ${user?.status === "Verified" ? "bg-green-400" : "bg-red-500"}`}/>
                        <Text className='text-text text-lg dark:text-text-dark'>{user?.status}</Text>
                    </View>
                    <View className='w-auto h-auto flex-col items-center'>
                        <Text className='text-3xl text-secondary font-semibold'>{`${user.firstName} ${user.lastName}`}</Text>
                        <Text className='text-base text-text dark:text-text-dark'>{user.email}</Text>
                    </View>
                </View>

                <View className="flex-row items-center" style={{width: '100%'}}>
                    <View className="flex-1 h-[2px] bg-[#CBC4C4]" />
                </View>

                <View className='w-full flex flex-col justify-center items-center gap-4 px-2' style={{paddingVertical: 2}}>
                    <TouchableOpacity className='w-full flex-row justify-start items-center gap-2' onPress={() => {router.push('/(tabs)/(account)/edit-profile')}}>
                        <View className='w-12 h-auto border-0 items-center justify-center'>
                            <Text className="text-text text-2xl dark:text-text-dark">
                                <MaterialCommunityIcons name="pencil" size={20}/>
                            </Text>
                        </View>  
                        <Text className='text-xl font-bold dark:text-text-dark'>Edit Profile</Text>
                        <Text className="text-text text-xl ml-auto dark:text-text-dark"><AntDesign name="right" size={20}/></Text>
                    </TouchableOpacity>
                </View>

                <View className='w-full flex flex-col justify-center items-center gap-4 px-2' style={{paddingVertical: 2}}>
                    <TouchableOpacity className='w-full flex-row justify-start items-center gap-2' onPress={() => {router.push('/my-guides/user-guides')}}>
                        <View className='w-12 h-auto border-0 items-center justify-center'>
                            <Text className="text-text text-2xl dark:text-text-dark">
                                <FontAwesome name="book" size={20} />
                            </Text>
                        </View>
                        <Text className='text-xl font-bold dark:text-text-dark'>My Guides</Text>
                        <Text className="text-text text-xl ml-auto dark:text-text-dark"><AntDesign name="right" size={20}/></Text>
                    </TouchableOpacity>
                </View>

                <View className='w-full flex flex-col justify-center items-center gap-4 px-2' style={{paddingVertical: 2}}>
                    <TouchableOpacity className='w-full flex-row justify-start items-center gap-2' onPress={() => {router.push('/saved/saved-guides')}}>
                        <View className='w-12 h-auto border-0 items-center justify-cente'>
                            <Text className="text-text text-2xl dark:text-text-dark">
                                <FontAwesome name="bookmark" size={20}/>
                            </Text>
                        </View>
                        <Text className='text-xl font-bold dark:text-text-dark'>Saved</Text>
                        <Text className="text-text text-xl ml-auto dark:text-text-dark"><AntDesign name="right" size={20}/></Text>
                    </TouchableOpacity>
                </View>

                <View className='w-full flex flex-col justify-center items-center gap-4 px-2' style={{paddingVertical: 2}}>
                    <TouchableOpacity className='w-full flex-row justify-start items-center gap-2' onPress={() => {router.push('/(settings)/settings-main-page')}}>
                        <View className='w-12 h-auto border-0 items-center justify-cente'>
                            <Text className="text-text text-2xl dark:text-text-dark">
                                <Ionicons name="settings-sharp" size={20} />
                            </Text>
                        </View>
                        <Text className='text-xl font-bold dark:text-text-dark'>Settings</Text>
                        <Text className="text-text text-xl ml-auto dark:text-text-dark"><AntDesign name="right" size={20}/></Text>
                    </TouchableOpacity>
                </View>

                <View className="flex-row items-center" style={{width: '100%'}}>
                    <View className="flex-1 h-[2px] bg-[#CBC4C4]" />
                </View>

                <View className='w-full flex flex-col justify-center items-center gap-4 px-2' style={{paddingVertical: 2}}>
                    <TouchableOpacity className='w-full flex-row justify-start items-center gap-2' onPress={() => {
                        logoutUser();
                    }}>
                        <View className='w-12 h-auto border-0 items-center justify-cente'>
                            <Text className="text-text text-2xl dark:text-text-dark">
                              <Ionicons name="exit-outline" size={20}/>  
                            </Text>
                        </View>
                        <Text className='text-xl font-bold text-red-400'>Logout</Text>
                    </TouchableOpacity>
                </View>

            </SafeAreaView>
            )
        }
        </>
        
    )
}

export default Profile