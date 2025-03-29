import { View, Text, TextInput, TouchableOpacity, StatusBar, SafeAreaView, Image, ActivityIndicator} from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { useFocusEffect, useRouter } from 'expo-router'
import Dropdown from '@/components/dropdown.tsx'
import DateTimePicker from "@react-native-community/datetimepicker";
import FetchingDataScreen from '@/components/fetching-data-screen.jsx';

import { API_URL } from '@/constants/links.js'
import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { jwtDecode } from 'jwt-decode'

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

const Profile = () => {

    const router = useRouter();
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [profileIcon, setProfileIcon] = useState('');
    const [fetchingData, setFetchingData] = useState(false);
    const [errorFetching, setErrorFetching] = useState(false);

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
        setFetchingData(true);
        const token = await AsyncStorage.getItem('token');
        if (!token){
            setFetchingData(false);
            router.replace('/(auth-screens)/signin');
            return;
        };
        setFetchingData(false);
    };

    const getUserData = async () => {
        setFetchingData(true);
        setErrorFetching(false);
        try {
            const token = await AsyncStorage.getItem('token');
            const decryptedToken = await jwtDecode(token);
            if (!token) {
                router.dismissAll();
                router.replace('/(auth-screens)/signin');
            }
            const res = await axios.get(`${API_URL}/api/v1/user/${decryptedToken.userID}`);
            setFullName(`${res.data.data.firstName} ${res.data.data.lastName}`);
            setEmail(res.data.data.email);
            setProfileIcon(res.data.data.profileIcon);
        } catch (error) {
            setErrorFetching(true);
            console.log(error.message);
        }finally{
            setFetchingData(false);
        }
    }

    useFocusEffect(
        useCallback(() => {
            getUserData();
        }, [])
    )

    

    return (
        <>
            <StatusBar translucent={true} className='bg-background dark:bg-background-dark'/>
            {fetchingData ? (
                    <FetchingDataScreen/>
                ) : errorFetching ? (
                    <View className='w-screen h-screen items-center justify-center gap-4 bg-background dark:bg-background-dark'>
                         <Text className='text-3xl font-extrabold text-red-500'>Network Error</Text>
                                  <Text>Please connect to a stable internet.</Text>
                        <TouchableOpacity className='w-44 h-8 items-center justify-center bg-primary rounded-xl'>
                            <Text className='font-bold text-white text-lg'>Retry</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
            <SafeAreaView className="h-screen w-screen flex-col items-center bg-background px-8 py-4 gap-4 dark:bg-background-dark">
                
                <View className='w-full flex flex-col justify-end items-center gap-4 pb-8' style={{height: '48%'}}>
                    <View className='w-52 h-52 flex flex-col justify-center items-center bg-[#A9A9A9] rounded-full'>
                        <Image source={profileIcons[profileIcon]} className='max-w-48 h-auto' resizeMode='contain'/>
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

                    <View className='w-auto h-auto flex-col items-center'>
                        <Text className='text-3xl text-secondary font-semibold'>{fullName}</Text>
                        <Text className='text-base text-text dark:text-text-dark'>{email}</Text>
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
                    <View className='w-full flex-row justify-start items-center gap-2'>
                        <View className='w-12 h-auto border-0 items-center justify-cente'>
                            <Text className="text-text text-2xl dark:text-text-dark">
                                <FontAwesome name="book" size={20} />
                            </Text>
                        </View>
                        <Text className='text-xl font-bold dark:text-text-dark'>My Guides</Text>
                        <Text className="text-text text-xl ml-auto dark:text-text-dark"><AntDesign name="right" size={20}/></Text>
                    </View>
                </View>

                <View className='w-full flex flex-col justify-center items-center gap-4 px-2' style={{paddingVertical: 2}}>
                    <View className='w-full flex-row justify-start items-center gap-2'>
                        <View className='w-12 h-auto border-0 items-center justify-cente'>
                            <Text className="text-text text-2xl dark:text-text-dark">
                                <FontAwesome name="bookmark" size={20}/>
                            </Text>
                        </View>
                        <Text className='text-xl font-bold dark:text-text-dark'>Saved</Text>
                        <Text className="text-text text-xl ml-auto dark:text-text-dark"><AntDesign name="right" size={20}/></Text>
                    </View>
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
                        AsyncStorage.removeItem('token');
                        checkLoggedIn();
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