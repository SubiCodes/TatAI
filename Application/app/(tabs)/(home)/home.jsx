import { View, Text, ActivityIndicator, StatusBar, Dimensions, ScrollView, TextInput, TouchableOpacity, } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import React, { useCallback, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useRouter, useNavigation } from 'expo-router';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import { Link } from 'expo-router';

import logo from '@/assets/images/auth-images/logo1.png';
import CardRecentGuide from '@/components/card-recent-guide.jsx';
import CardRecentGuidePerTypeHorizontal from '@/components/card-recent-guide-pertype-horizontal.jsx';
import CardRecentGuidePerTypeVertical from '@/components/card-recent-guide-pertype-vertical.jsx';
import AntDesign from '@expo/vector-icons/AntDesign';
import Octicons from '@expo/vector-icons/Octicons';

import { useColorScheme } from 'nativewind';
import Constants from 'expo-constants';

import userStore from '@/store/user.store';
import guideStore from '@/store/guide.store'

const { width, height } = Dimensions.get('screen');
const API_URL = Constants.expoConfig?.extra?.API_URL ?? Constants.manifest?.extra?.API_URL;

const Home = () => {
  const { colorScheme, toggleColorScheme } = useColorScheme();

  const user = userStore((state) => state.user);
  const isLoading = userStore((state) => state.isLoading);
  const error = userStore((state) => state.error);
  const getUserInfo = userStore((state) => state.getUserInfo);
  const checkUserLoggedIn = userStore((state) => state.checkUserLoggedIn);

  const latestGuides = guideStore((state) => state.latestGuides);
  const getLatestGuide = guideStore((state) => state.getLatestGuide);

  const getLatestGuidePerType = guideStore((state) => state.getLatestGuidePerType);
  const repairGuides = guideStore((state) => state.repairGuides);
  const diyGuides = guideStore((state) => state.diyGuides);
  const cookingGuides = guideStore((state) => state.cookingGuides);
  const toolGuides = guideStore((state) => state.toolGuides);

  const isFetchingGuides = guideStore((state) => state.isFetchingGuides);
  const errorFetchingGuides = guideStore((state) => state.errorFetchingGuides);

  const router = useRouter();
  const navigation = useNavigation();

  const checkVerified = async () => {
    try {

      if (user) {
        if (user.status === 'Unverified') {
          await AsyncStorage.removeItem('token');
          await router.replace(`/(auth-screens)/verify-account/${user.email}`);
          return;
        }

        const preference = await axios.get(`${API_URL}preference/${user._id}`, {
          validateStatus: (status) => status < 500,
        });

        if (!preference.data.success) {
          await router.push('/modal/personalization');
          return;
        }
      }
    } catch (error) {
      console.log('error at home: ', error.message);
    }
  };

  const fetchGuides = async () => {
    if (!latestGuides) {getLatestGuide();}
    if (!repairGuides) {getLatestGuidePerType('repair');}
    if (!diyGuides) {getLatestGuidePerType('diy');}
    if (!cookingGuides) {getLatestGuidePerType('cooking')}
    if (!toolGuides) {getLatestGuidePerType('tool');}
  }

  useEffect(() => {
    const checkVerifications = async () => {
      await checkUserLoggedIn();
      await checkVerified();
    };
    checkVerifications();
  }, []);

  //fetch guides:
  useEffect(() => {
    fetchGuides();
  }, []);

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
  }, []);


  if (isLoading || isFetchingGuides) {
    return (
      <View className="w-screen h-screen items-center justify-center gap-4 dark:bg-background-dark dark:text-text-dark">
        <StatusBar translucent backgroundColor={'transparent'} />
        <ActivityIndicator size={32} color={'blue'} />
      </View>
    );
  }

  if (error || errorFetchingGuides) {
    return (
      <View className="w-screen h-screen items-center justify-center dark:bg-background-dark dark:text-text-dark">
        <StatusBar translucent backgroundColor={'transparent'} />
        <Text className="text-3xl font-extrabold text-red-500">{error ? error : errorFetchingGuides}</Text>
        <Text>Please connect to a stable internet.</Text>
      </View>
    );
  }

  return (
    <>
      <StatusBar className='dark:bg-background-dark' translucent={false}/>
      <ScrollView 
        className="flex-1 bg-background dark:bg-background-dark"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {/* Search Bar */}
  
        <View className='w-full py-4 px-6 bg-white flex flex-row items-center justify-center gap-4 border-t-[1px] border-b-[1px] border-gray-200 dark:bg-[#2A2A2A] dark:border-b-0 dark:border-t-0'>
          <TextInput className='flex-1 bg-[#EBEBEB] text-md rounded-3xl px-6` dark:bg-background-dark dark:text-text-dark' placeholder='Search a guide'  placeholderTextColor={colorScheme === 'dark' ? '#A0A0A0' : '#7A7A7A'}/>
        </View>

        <View className="w-full px-6 pt-8">
          <View className='w-full flex flex-row justify-between items-center mb-2'>
            <Text className='text-4xl font-bold dark:text-text-dark'>Recent</Text>
            <Link href="/(tabs)/(home)/showguide/recent" className='dark:text-text-dark'>
              <AntDesign name="arrowright" size={24} />
            </Link>
          </View>
          
          {/* fetch latest guides */}
          {isFetchingGuides ? (
            <View className="w-full items-center py-4 dark:bg-background-dark dark:text-text-dark">
              <ActivityIndicator size="large" color="blue" />
            </View>
          ) : (
            <View className="w-full overflow-y-visible py-2 mb-4">
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 8, alignItems: 'center', paddingVertical: 8, paddingRight:8 }}
                className="w-full"
                style={{ maxHeight: 250 }} // or any height you want the row to stay within
              >
                {latestGuides && latestGuides.length > 0 ? (
                  latestGuides.map((guide) => (
                    <CardRecentGuide key={guide._id} guide={guide} />
                  ))
                ) : (
                  <Text>No Guides Yet</Text>
                )}
              </ScrollView>
            </View>
          )}

          <View className='w-full flex flex-row justify-between items-center mb-2'>
            <Text className='text-4xl font-bold dark:text-text-dark'>Repair</Text>
            <Link href="/(tabs)/(home)/showguide/repair" className='dark:text-text-dark'>
              <AntDesign name="arrowright" size={24} />
            </Link>
          </View>
          {/* fetch latest repair guides */}
          {isFetchingGuides ? (
            <View className="w-full items-center py-4 dark:bg-background-dark dark:text-text-dark">
              <ActivityIndicator size="large" color="blue" />
            </View>
          ) : (
            <View className="w-full overflow-y-visible py-2 mb-4 flex flex-col gap-4 items-center">
              {repairGuides.map((guide) => (
                <CardRecentGuidePerTypeVertical key={guide._id} guide={guide}/>
              ))}
            </View>
          )}

          <View className='w-full flex flex-row justify-between items-center mb-2'>
            <Text className='text-4xl font-bold dark:text-text-dark'>DIY</Text>
            <Link href="/(tabs)/(home)/showguide/diy" className='dark:text-text-dark'>
              <AntDesign name="arrowright" size={24} />
            </Link>
          </View>
          {/* fetch latest diy guides */}
          {isFetchingGuides ? (
            <View className="w-full items-center py-4 dark:bg-background-dark dark:text-text-dark">
              <ActivityIndicator size="large" color="blue" />
            </View>
          ) : (
            <View className="w-full overflow-y-visible py-2 mb-4">
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 8, alignItems: 'center', paddingVertical: 8, paddingRight:8 }}
                className="w-full px-2"
                style={{ maxHeight: 300 }}
              >
                {latestGuides && latestGuides.length > 0 ? (
                  diyGuides.map((guide) => (
                    <CardRecentGuidePerTypeHorizontal key={guide._id} guide={guide}/>
                  ))
                ) : (
                  <Text>No Guides Posted Yet</Text>
                )}
              </ScrollView>
            </View>
          )}

          <View className='w-full flex flex-row justify-between items-center mb-2 dark:bg-background-dark dark:text-text-dark'>
            <Text className='text-4xl font-bold dark:text-text-dark '>Cooking</Text>
            <Link href="/(tabs)/(home)/showguide/cooking" className='dark:text-text-dark'>
              <AntDesign name="arrowright" size={24} />
            </Link>
          </View>
          {/* fetch latest cooking guides */}
          {isFetchingGuides ? (
            <View className="w-full items-center py-4">
              <ActivityIndicator size="large" color="blue" />
            </View>
          ) : (
            <View className="w-full overflow-y-visible py-2 mb-4 flex flex-col gap-4 items-center">
              {cookingGuides.map((guide) => (
                <CardRecentGuidePerTypeVertical key={guide._id} guide={guide}/>
              ))}
            </View>
          )}

          <View className='w-full flex flex-row justify-between items-center mb-2 dark:bg-background-dark dark:text-text-dark'>
            <Text className='text-4xl font-bold dark:text-text-dark'>Tools</Text>
            <Link href="/(tabs)/(home)/showguide/tool" className='dark:text-text-dark'>
              <AntDesign name="arrowright" size={24} />
            </Link>
          </View>
          {/* fetch latest tool guides */}
          {isFetchingGuides ? (
            <View className="w-full items-center py-4">
              <ActivityIndicator size="large" color="blue" />
            </View>
          ) : (
            <View className="w-full overflow-y-visible py-2 mb-4">
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 8, alignItems: 'center', paddingVertical: 8, paddingRight:8 }}
                className="w-full px-2"
                style={{ maxHeight: 300 }}
              >
                {latestGuides && latestGuides.length > 0 ? (
                  toolGuides.map((guide) => (
                    <CardRecentGuidePerTypeHorizontal key={guide._id} guide={guide}/>
                  ))
                ) : (
                  <Text>No Guides Posted Yet</Text>
                )}
              </ScrollView>
            </View>
          )}

        </View>

      </ScrollView>
    </>
  );
};

export default Home;
