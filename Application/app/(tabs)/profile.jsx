import { View, Text, TextInput, TouchableOpacity, StatusBar, SafeAreaView, ScrollView, Alert } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { useFocusEffect } from 'expo-router'
import Dropdown from '@/components/dropdown.tsx'
import DateTimePicker from "@react-native-community/datetimepicker";

import { API_URL } from '@/constants/links.js'
import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { jwtDecode } from 'jwt-decode'

const Profile = () => {

    const [userID, setUserID] = useState(null);
    const [data, setData] = useState({});
    const [openCalendar, setOpenCalendar] = useState(false);

    const handleDropdownChangeGender = (item) => {
        setData(prev => ({...prev, gender: item.value}));
    };

    const handleDropdownChangeTone = (item) => {
        setData(prev => ({...prev, preferredTone: item.value}));
    };

    const handleDropdownChangeTool = (item) => {
        setData(prev => ({...prev, toolFamiliarity: item.value}));
    };

    const handleDropdownChangeSkill = (item) => {
        setData(prev => ({...prev, skillLevel: item.value}));
    };

    const handleSubmit = async () => {
        try {
            const res = await axios.put(`${API_URL}/api/v1/user/${userID}`, {...data},
                { 
                  validateStatus: (status) => status < 500,
                }
              );
            if (!res.data.success){
                Alert.alert("⚠️Oops", res.data.message, [{
                    "text": "OK"
                }])
                return;
            }
            Alert.alert("🎊Profile Updated", res.data.message, [{
                "text": "OK"
            }])

            getUserInfo();
        } catch (error) {
            Alert.alert("⚠️Oops", error.message, [{
                "text": "OK"
            }])
            console.log(error.message);
        }
    }

    const handleTest = () => {
        console.log(`Data: ${JSON.stringify(data, null, 2)}`);
    }

    const prepareID = async () => {
        try {
            const token = await AsyncStorage.getItem('token'); // Use `getItem`, not `get`
            if (token) {
                const decodedToken = jwtDecode(token);
                setUserID(decodedToken.userID);
                console.log("User ID:", decodedToken.userID);
            }
        } catch (error) {
            console.error("Error fetching token:", error);
        }
    };

    const getUserInfo = async () => {
        if (!userID) return;
        try {
            const res = await axios.get(`${API_URL}/api/v1/user/${userID}`, {
                validateStatus: (status) => status < 500,
            });
            setData(res.data.data);
            console.log("User Data:", res.data.data);
            const res2 = await axios.get(`${API_URL}/api/v1/preference/${userID}`, {
                validateStatus: (status) => status < 500,
            });
            setData(prev => ({...prev, ...res2.data.data}));
            console.log("User Preference:", res2.data.data);
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    };


    useFocusEffect(
        useCallback(() => {
            prepareID();
        }, [])
    )

    useEffect(() => {
        if (userID) {
            getUserInfo();
        }
    }, [userID]);


    return (
        <>
            <StatusBar translucent={true} backgroundColor="transparent" />
            <SafeAreaView className="h-screen w-screen flex justify-center items-center flex-col bg-background ">
                <ScrollView
                    className="flex-1 gap-4 min-h-[100%] overflow-y-scroll pt-8"
                    contentContainerStyle={{
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 16,
                    width: 320,
                    }}
                >       

                        <View className='w-80 h-auto flex-col gap-2'>
                            <Text className='text-xl font-bold'>Email</Text>
                            <TextInput value={data?.email || ""} editable={false}
                            className='border-2 border-gray-600 rounded-lg text-md p-2'/>
                        </View>
                        <View className='w-80 h-auto flex-col gap-2'>
                            <Text className='text-xl font-bold'>First Name</Text>
                            <TextInput value={data?.firstName || ""} onChangeText={(text) => (setData(prev => ({...prev, firstName: text})))}
                            className='border-2 border-gray-600 rounded-lg text-md p-2'/>
                        </View>
                        <View className='w-80 h-auto flex-col gap-2'>
                            <Text className='text-xl font-bold'>Last Name</Text>
                            <TextInput value={data?.lastName || ""} onChangeText={(text) => (setData(prev => ({...prev, lastName: text})))}
                            className='border-2 border-gray-600 rounded-lg text-md p-2'/>
                        </View>
                        <View className='w-80 h-auto flex-col gap-2'>
                            <Text className='text-xl font-bold'>Gender</Text>
                            <Dropdown
                                data={[
                                { value: "Male", label: "♂️ Male" },
                                { value: "Female", label: "♀️ Female" },
                                { value: "Non-Binary", label: "🏳️‍🌈 Non-Binary" },
                                { value: "Prefer not to say", label: "🤐 Prefer not to say" },
                                ]}
                                placeholder= {data?.gender || ""}
                                onChange={handleDropdownChangeGender}
                                height={40}
                                />
                        </View>
                        <View className='w-80 h-auto flex-col gap-2'>
                            <Text className='text-xl font-bold'>Birthdate</Text>
                            <TouchableOpacity onPress={() => setOpenCalendar(true)}>
                            <TextInput
                            placeholder="e.g. 01/01/2001"
                            className='border-2 border-gray-600 rounded-lg text-md p-2'
                            editable={false}
                            value={data?.birthday ? new Date(data.birthday).toLocaleDateString("en-US") : ""}
                            />
                        </TouchableOpacity>
                        {openCalendar && (
                            <DateTimePicker
                            value={new Date(data.birthday) || new Date()}
                            mode="date"
                            display="default"
                            maximumDate={new Date()}
                            onChange={(event, selectedDate) => {
                                setOpenCalendar(false);
                                if (selectedDate) {
                                setData(prev => ({...prev, birthday: selectedDate}));
                            }}}
                            />
                        )}
                        </View>

                        
                        <View className='w-80 h-auto flex-col gap-2'>
                            <Text className='text-xl font-bold'>Preferred Name</Text>
                            <TextInput value={data?.preferredName || ""} onChangeText={(text) => (setData(prev => ({...prev, preferredName: text})))}
                            className='border-2 border-gray-600 rounded-lg text-md p-2'/>
                        </View>
                        <View className='w-80 h-auto flex-col gap-2'>
                            <Text className='text-xl font-bold'>Preferred Tone</Text>
                            <Dropdown
                                data={[
                                { value: "formal", label: "Formal" },
                                { value: "casual", label: "Casual" },
                                { value: "soft spoken", label: "Soft Spoken" },
                                { value: "strict", label: "Strict" },
                                ]}
                                placeholder= {data?.preferredTone || ""}
                                onChange={handleDropdownChangeTone}
                                height={40}
                                />
                        </View>
                        <View className='w-80 h-auto flex-col gap-2'>
                            <Text className='text-xl font-bold'>Tool Familiarity</Text>
                            <Dropdown
                                data={[
                                { value: "unfamiliar", label: "unfamiliar" },
                                { value: "recognizes basics", label: "recognizes basics" },
                                { value: "functionally knowledgeable", label: "functionally knowledgeable" },
                                { value: "knowledgeable", label: "knowledgeable" },
                                ]}
                                placeholder= {data?.toolFamiliarity || ""}
                                onChange={handleDropdownChangeTool}
                                height={40}
                                />
                        </View>
                        <View className='w-80 h-auto flex-col gap-2'>
                            <Text className='text-xl font-bold'>Skill Level</Text>
                            <Dropdown
                                data={[
                                { value: "beginner", label: "beginner" },
                                { value: "intermediate", label: "intermediate" },
                                { value: "advance", label: "advance" },
                                { value: "expert", label: "expert" },
                                { value: "professional", label: "professional" },
                                ]}
                                placeholder= {data?.skillLevel || ""}
                                onChange={handleDropdownChangeSkill}
                                height={40}
                                />
                        </View>

                        <TouchableOpacity className='w-80 h-auto items-center justify-center p-2 rounded bg-primary' onPress={handleSubmit}>
                            <Text className='text-xl font-extrabold text-white'>Test</Text>
                        </TouchableOpacity>

                        <View className='min-h-72'><Text className='text-gray-400'>--------------------</Text></View>
                </ScrollView>
            </SafeAreaView>
        </>
        
    )
}

export default Profile