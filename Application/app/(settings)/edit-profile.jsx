import { View, Text, StatusBar, SafeAreaView, ScrollView, Dimensions, Image, TouchableOpacity, TextInput, Alert, Modal, ActivityIndicator } from 'react-native'
import DateTimePicker from "@react-native-community/datetimepicker";
import Dropdown from "@/components/dropdown.tsx";
import FetchingDataScreen from '@/components/fetching-data-screen.jsx';
import React, { useCallback, useEffect, useState } from 'react'

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
import Feather from '@expo/vector-icons/Feather';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '@/constants/links';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import { useFocusEffect } from 'expo-router';
import userStore from '@/store/user.store';

const {width, height} = Dimensions.get('screen');

const EditProfile = () => {

    const user = userStore((state) => state.user);
    const isLoading = userStore((state) => state.isLoading);
    const error = userStore((state) => state.error);
    const getUserInfo = userStore((state) => state.getUserInfo);
    const editUserInfo = userStore((state) => state.editUserInfo);
    const checkUserLoggedIn = userStore((state) => state.checkUserLoggedIn);

    const [activeProfileIcon, setActiveProfileIcon] = useState();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [birthDate, setBirthDate] = useState();
    const [gender, setGender] = useState('');
    const [openCalendar, setOpenCalendar] = useState(false);

    const [isFirstNameEmpty, setIsFirstNameEmpty] = useState(false);
    const [isLastNameEmpty, setIsLastNameEmpty] = useState(false);

    const [fetchingData, setFetchingData] = useState(false);
    const [postingData, setPostingData] = useState(false);

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

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProfileIcon, setSelectedProfileIcon] = useState();

    const handleDropdownChange = (item) => {
      setGender(item.value);
    };

    const handleChangeActiveProfileIcon = () => {
      setActiveProfileIcon(selectedProfileIcon);
      setIsModalOpen(false);
    };


    const checkNameEmpty = () => {
      if (firstName.trim() === ''){
        setIsFirstNameEmpty(true)
      }else{
        setIsFirstNameEmpty(false);
      }
      if (lastName.trim() === ''){
        setIsLastNameEmpty(true)
      }else{
        setIsLastNameEmpty(false)
      }
      return;
    }

    const getUserData = async () => {
      setFetchingData(true);
      try {
        if (!user) {
          checkUserLoggedIn();
        }
        setFirstName(user.firstName);
        setLastName(user.lastName);
        setGender(user.gender);
        setActiveProfileIcon(user.profileIcon);
        setSelectedProfileIcon(user.profileIcon);

        if (user.birthday) {
          const parsedDate = new Date(user.birthday);
          if (!isNaN(parsedDate.getTime())) {
            setBirthDate(parsedDate);
          }
        }
    
      } catch (error) {
        Alert.alert("⚠️Oops", "Cannot fetch information.");
        console.log(error.message);
      } finally {
        setFetchingData(false);
      }
    };

    useFocusEffect(
      useCallback(() => {
        getUserData();
      }, [])
    )

    useEffect(() => {
      checkNameEmpty();
    }, [firstName, lastName])


  return (
    <>
      <StatusBar translucent={false} className='bg-background dark:bg-background-dark'/>
      <SafeAreaView className="h-[100%] w-screen flex-col bg-background">
      {fetchingData ? (
        <ActivityIndicator size={24} color={blue}/>
      ) : (
        <ScrollView className="flex-1 gap-4 min-h-[100%] bg-background dark:bg-background-dark"
          contentContainerStyle={{
          alignItems: "center",
          justifyContent: "center",
          gap: 32,
          width: width,
          paddingTop: 24,
          paddingHorizontal: 36
          }}>

          <Modal visible={isModalOpen} transparent={true}>
            <View className='w-screen h-screen items-center justify-center' style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
              <View className='w-4/5 h-auto bg-white gap-4 pb-4 rounded-xl'>

                <View className='w-full h-auto flex-row items-center gap-4 py-4 px-4 border-b-2'>
                  <Text onPress={() => setIsModalOpen(false)}><Feather name="x" size={24} color="black" /></Text>
                  <Text className='text-xl font-bold'>Choose a Profile Icon</Text>
                </View>

                <View className='w-full h-auto items-center justify-center mb-4'>
                  <View className='w-24 h-24 rounded-full items-center justify-center bg-primary'>
                    <Image source={profileIcons[selectedProfileIcon]} className='max-w-20 h-20 rounded-full' resizeMode='contain'/>
                  </View>
                </View>

                <View className='w-full h-auto justify-center items-center flex-row flex-wrap gap-2 mb-4'>

                  {Object.keys(profileIcons).filter((key) => key !== "empty_profile").map((key) => (
                    <TouchableOpacity
                      key={key}
                      className='w-16 h-16 rounded-full items-center justify-center bg-[#A9A9A9]'
                      style={{backgroundColor: key === selectedProfileIcon ? '#006FFD' : '#A9A9A9'}}
                      onPress={() => {
                        setSelectedProfileIcon(key);
                      }}
                    >
                      <Image source={profileIcons[key]} className='max-w-14 h-14 rounded-full' resizeMode='contain' />
                    </TouchableOpacity>
                  ))}

                </View>

                <View className='w-full h-auto items-center justify-center'>
                  <TouchableOpacity className='w-4/5 h-12 bg-primary items-center justify-center rounded-3xl' onPress={handleChangeActiveProfileIcon}>
                    <Text className='text-lg font-extrabold text-white'>Save</Text>
                  </TouchableOpacity>
                </View>

              </View>
            </View>
          </Modal>

          <View className='w-52 h-52 flex flex-col justify-center items-center bg-[#A9A9A9] rounded-full'>
            <Image source={profileIcons[activeProfileIcon]} className='max-w-48 h-auto' resizeMode='contain'/>
            <TouchableOpacity 
            className='w-12 h-12 bg-primary rounded-full items-center justify-center'
            style={{
                position: 'absolute',
                bottom: 24,
                right: 12,
                transform: [{ translateX: 10 }, { translateY: 10 }], 
                elevation: 5, 
                }}
                onPress={() => {
                  setSelectedProfileIcon(activeProfileIcon);
                  setIsModalOpen(true)
                }}>
                <Text className="text-white text-xl">
                  <MaterialCommunityIcons name="pencil" size={24} color="white"/>
                </Text>
            </TouchableOpacity>
          </View>

          <View className='w-full h-auto gap-4 flex-col'>
              
              <View className='w-full h-auto gap-2 flex-col'>
                <Text className='text-black text-lg font-semibold dark:text-text-dark'>First Name</Text>
                <TextInput className='w-full h-auto text-base font-normal text-black border-black border-2 rounded px-4 bg-[#F8F8FF]' style={{borderColor: isFirstNameEmpty ? 'red' : 'black'}}
                value={firstName} onChangeText={(text) => {
                  setFirstName(text);
                }}/>
              </View>

              <View className='w-full h-auto gap-2 flex-col'>
                <Text className='text-black text-lg font-semibold dark:text-text-dark'>Last Name</Text>
                <TextInput className='w-full h-auto text-base font-normal text-black border-black border-2 px-4 rounded bg-[#F8F8FF]' style={{borderColor: isLastNameEmpty ? 'red' : 'black'}}
                value={lastName} onChangeText={(text) => {
                  setLastName(text);
                }}/>
              </View>

              <View className='w-full h-auto gap-2 flex-col'>
                <Text className='text-black text-lg font-semibold dark:text-text-dark'>Birthdate</Text>
                <TouchableOpacity onPress={() => setOpenCalendar(true)}>
                <TextInput
                  placeholder="e.g. 01/01/2001"
                  className="h-14 w-full border-black border-2 rounded bg-[#F8F8FF]"
                  editable={false}
                  value={birthDate ? birthDate.toLocaleDateString("en-US") : ""}
                />
                </TouchableOpacity>
                {openCalendar && (
                  <DateTimePicker
                    value={birthDate || new Date()}
                    mode="date"
                    display="default"
                    maximumDate={new Date()}
                    onChange={(event, selectedDate) => {
                      setOpenCalendar(false);
                      if (selectedDate) {
                        setBirthDate(selectedDate);
                      } 
                    }}
                  />
                )}
              </View>

              <View className='w-full h-auto gap-2 flex-col'>
                <Text className='text-black text-lg font-semibold dark:text-text-dark'>Gender</Text>
                <Dropdown
                  data={[
                    { value: "Male", label: "♂️ Male" },
                    { value: "Female", label: "♀️ Female" },
                    { value: "Non-Binary", label: "🏳️‍🌈 Non-Binary" },
                    { value: "Prefer not to say", label: "🤐 Prefer not to say" },
                  ]}
                  onChange={handleDropdownChange}
                  placeholder={gender}
                  height={46}
                  bgColor='#F8F8FF'
                />
              </View>

              <TouchableOpacity className='w-full h-12 items-center justify-center bg-primary rounded-md mt-4' onPress={() => {editUserInfo(firstName, lastName, birthDate, gender, activeProfileIcon, user._id)}} disabled={postingData}>
                  {isLoading ? (<ActivityIndicator color={'white'} size={24}/>) : (<Text className='text-white font-bold text-xl'>Save</Text>)}
              </TouchableOpacity>

          </View>


            
        </ScrollView>
      )}
        
      </SafeAreaView>
    </>
  )
}

export default EditProfile