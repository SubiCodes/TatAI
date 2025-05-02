import { View, Text, ActivityIndicator, StatusBar, Dimensions } from 'react-native';
import React, { useCallback, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useRouter, useNavigation } from 'expo-router';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

import logo from '@/assets/images/auth-images/logo1.png';
import { useColorScheme } from 'nativewind';
import Constants from 'expo-constants';

import userStore from '@/store/user.store';

const { width, height } = Dimensions.get('screen');
const API_URL = Constants.expoConfig?.extra?.API_URL ?? Constants.manifest?.extra?.API_URL;

const Home = () => {
  const { colorScheme, toggleColorScheme } = useColorScheme();

  const user = userStore((state) => state.user);
  const isLoading = userStore((state) => state.isLoading);
  const error = userStore((state) => state.error);
  const getUserInfo = userStore((state) => state.getUserInfo);
  const checkUserLoggedIn = userStore((state) => state.checkUserLoggedIn);

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

      // All checks passed — show tab bar
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

  if (isLoading) {
    return (
      <View className="w-screen h-screen items-center justify-center gap-4 dark:bg-background-dark dark:text-text-dark">
        <StatusBar translucent backgroundColor={'transparent'} />
        <ActivityIndicator size={32} color={'blue'} />
      </View>
    );
  }

  if (error) {
    return (
      <View className="w-screen h-screen items-center justify-center">
        <StatusBar translucent backgroundColor={'transparent'} />
        <Text className="text-3xl font-extrabold text-red-500">Network Error</Text>
        <Text>Please connect to a stable internet.</Text>
      </View>
    );
  }

  return (
    <>
      <StatusBar translucent backgroundColor={'transparent'} />
      <View className="items-center justify-center bg-background" style={{ width, height }}>
        {/* Add home screen content here */}
      </View>
    </>
  );
};

export default Home;
