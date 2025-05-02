import { View, Text, ActivityIndicator, StatusBar, Dimensions, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import React, { useCallback, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useRouter, useNavigation } from 'expo-router';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

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

  const [tabBarVisible, setTabBarVisible] = useState(false);

  const checkVerified = async () => {
    try {
      setTabBarVisible(false); // hide tab bar during check

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
      setTabBarVisible(true);
    } catch (error) {
      console.log('error at home: ', error.message);
    }
  };

  useFocusEffect(
    useCallback(() => {
      checkUserLoggedIn();
    }, [])
  );

  useEffect(() => {
    const checkVerifications = async () => {
      await checkUserLoggedIn();
      await checkVerified();
    };
    checkVerifications();
  }, []);

  //fetch guides:
  useEffect(() => {
    getLatestGuide();
    getLatestGuidePerType('repair');
    getLatestGuidePerType('diy');
    getLatestGuidePerType('cooking');
    getLatestGuidePerType('tool');
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

  useFocusEffect(
    useCallback(() => {
      navigation.setOptions({
        tabBarStyle: tabBarVisible
          ? {
              borderRadius: 0,
              width: '100%',
              height: 56,
              alignSelf: 'center',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: colorScheme === 'dark' ? '#4A4A4A' : 'white',
              borderWidth: 2,
              borderColor: colorScheme === 'dark' ? '#4A4A4A' : 'white',
            }
          : { display: 'none' },
      });
    }, [tabBarVisible, colorScheme])
  );

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
      <View className="w-screen h-screen items-center justify-center">
        <StatusBar translucent backgroundColor={'transparent'} />
        <Text className="text-3xl font-extrabold text-red-500">{error ? error : errorFetchingGuides}</Text>
        <Text>Please connect to a stable internet.</Text>
      </View>
    );
  }

  return (
    <>
      <StatusBar backgroundColor={'transparent'} />
      <ScrollView 
        className="flex-1 bg-background"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {/* Search Bar */}
  
        <View className='w-full py-4 px-6 bg-white border-t-[1px] border-b-[1px] border-gray-200 flex flex-row items-center justify-center gap-4'>
          <TextInput className='flex-1 bg-[#EBEBEB] text-md rounded-3xl px-2' placeholder='Search a guide'/>
          <Octicons name="three-bars" size={24} color="black" />
        </View>

        <View className="w-full px-6 pt-8">
          <View className='w-full flex flex-row justify-between items-center mb-2'>
            <Text className='text-4xl font-bold'>Recent</Text>
            <AntDesign name="arrowright" size={24} color="black" />
          </View>
          
          {/* fetch latest guides */}
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
            <Text className='text-4xl font-bold'>Repair</Text>
            <AntDesign name="arrowright" size={24} color="black" />
          </View>
          {/* fetch latest repair guides */}
          {isFetchingGuides ? (
            <View className="w-full items-center py-4">
              <ActivityIndicator size="large" color="blue" />
            </View>
          ) : (
            <View className="w-full overflow-y-visible py-2 mb-4 flex flex-col gap-2 items-center">
              {repairGuides.map((guide) => (
                <CardRecentGuidePerTypeVertical key={guide._id} guide={guide}/>
              ))}
            </View>
          )}

          <View className='w-full flex flex-row justify-between items-center mb-2'>
            <Text className='text-4xl font-bold'>DIY</Text>
            <AntDesign name="arrowright" size={24} color="black" />
          </View>
          {/* fetch latest diy guides */}
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
                  diyGuides.map((guide) => (
                    <CardRecentGuidePerTypeHorizontal key={guide._id} guide={guide}/>
                  ))
                ) : (
                  <Text>No Guides Posted Yet</Text>
                )}
              </ScrollView>
            </View>
          )}

          <View className='w-full flex flex-row justify-between items-center mb-2'>
            <Text className='text-4xl font-bold'>Cooking</Text>
            <AntDesign name="arrowright" size={24} color="black" />
          </View>
          {/* fetch latest cooking guides */}
          {isFetchingGuides ? (
            <View className="w-full items-center py-4">
              <ActivityIndicator size="large" color="blue" />
            </View>
          ) : (
            <View className="w-full overflow-y-visible py-2 mb-4 flex flex-col gap-2 items-center">
              {cookingGuides.map((guide) => (
                <CardRecentGuidePerTypeVertical key={guide._id} guide={guide}/>
              ))}
            </View>
          )}

          <View className='w-full flex flex-row justify-between items-center mb-2'>
            <Text className='text-4xl font-bold'>Tools</Text>
            <AntDesign name="arrowright" size={24} color="black" />
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
