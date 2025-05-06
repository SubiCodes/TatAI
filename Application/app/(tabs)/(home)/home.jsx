import {
  View,
  Text,
  ActivityIndicator,
  StatusBar,
  ScrollView,
  TextInput,
  TouchableOpacity,
  RefreshControl,
  SafeAreaView,
} from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter, useNavigation } from 'expo-router';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import AntDesign from '@expo/vector-icons/AntDesign';
import Constants from 'expo-constants';
import { useColorScheme } from 'nativewind';

import CardRecentGuide from '@/components/card-recent-guide.jsx';
import CardRecentGuidePerTypeHorizontal from '@/components/card-recent-guide-pertype-horizontal.jsx';
import CardRecentGuidePerTypeVertical from '@/components/card-recent-guide-pertype-vertical.jsx';

import userStore from '@/store/user.store';
import guideStore from '@/store/guide.store';

const API_URL =
  Constants.expoConfig?.extra?.API_URL ?? Constants.manifest?.extra?.API_URL;

const Home = () => {
  // 🔒 Hooks MUST be declared at the top and unconditionally
  const router = useRouter();
  const navigation = useNavigation();
  const { colorScheme, toggleColorScheme } = useColorScheme();

  const [refreshing, setRefreshing] = useState(false);
  const statusBarColor = colorScheme === 'dark' ? 'black' : 'white';

  // User store
  const user = userStore((state) => state.user);
  const isLoading = userStore((state) => state.isLoading);
  const error = userStore((state) => state.error);
  const getUserInfo = userStore((state) => state.getUserInfo);
  const checkUserLoggedIn = userStore((state) => state.checkUserLoggedIn);

  // Guide store
  const latestGuides = guideStore((state) => state.latestGuides);
  const getLatestGuide = guideStore((state) => state.getLatestGuide);
  const getLatestGuidePerType = guideStore((state) => state.getLatestGuidePerType);
  const repairGuides = guideStore((state) => state.repairGuides);
  const diyGuides = guideStore((state) => state.diyGuides);
  const cookingGuides = guideStore((state) => state.cookingGuides);
  const toolGuides = guideStore((state) => state.toolGuides);
  const isFetchingGuides = guideStore((state) => state.isFetchingGuides);
  const errorFetchingGuides = guideStore((state) => state.errorFetchingGuides);

  const openGuideList = (type) => {
    router.push(`/(tabs)/(home)/showguide/${type}`);
  };

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
    if (latestGuides.length === 0) getLatestGuide();
    if (repairGuides.length === 0) getLatestGuidePerType('repair');
    if (diyGuides.length === 0) getLatestGuidePerType('diy');
    if (cookingGuides.length === 0) getLatestGuidePerType('cooking');
    if (toolGuides.length === 0) getLatestGuidePerType('tool');
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await getLatestGuide();
      await getLatestGuidePerType('repair');
      await getLatestGuidePerType('diy');
      await getLatestGuidePerType('cooking');
      await getLatestGuidePerType('tool');
      await checkUserLoggedIn();
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    const checkVerifications = async () => {
      await checkUserLoggedIn();
      await checkVerified();
    };
    checkVerifications();
  }, []);

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

  if (error || errorFetchingGuides) {
    return (
      <View className="w-screen h-screen items-center justify-center dark:bg-background-dark dark:text-text-dark">
        <StatusBar translucent backgroundColor={'transparent'} />
        <Text className="text-3xl font-extrabold text-red-500">
          {error || errorFetchingGuides}
        </Text>
        <Text>Please connect to a stable internet.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-background-dark pt-36">
      <StatusBar translucent backgroundColor={statusBarColor} />
      {/* Sticky Search Bar */}
      <View className="absolute top-0 left-0 right-0 z-50 mt-10">
        <View className="w-full py-4 px-6 bg-white flex-row items-center gap-4 border-b border-gray-200 dark:bg-[#2A2A2A] dark:border-b-0">
          <TextInput
            className="flex-1 bg-[#EBEBEB] text-md rounded-3xl px-4 dark:bg-background-dark dark:text-text-dark"
            placeholder="Search a guide"
            placeholderTextColor={
              colorScheme === "dark" ? "#A0A0A0" : "#7A7A7A"
            }
          />
        </View>
      </View>

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color={"blue"} size={"large"} />
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#0066FF"]}
              tintColor={colorScheme === "dark" ? "#FFFFFF" : "#0066FF"}
              progressBackgroundColor={
                colorScheme === "dark" ? "#383838" : "#F2F2F2"
              }
            />
          }
        >
          <View className="px-6 pt-4 pb-10">
            {/* Each Section */}
            {[
              ["Recent", latestGuides, CardRecentGuide, "horizontal"],
              ["Repair", repairGuides, CardRecentGuidePerTypeVertical],
              [
                "DIY",
                diyGuides,
                CardRecentGuidePerTypeHorizontal,
                "horizontal",
              ],
              ["Cooking", cookingGuides, CardRecentGuidePerTypeVertical],
              [
                "Tools",
                toolGuides,
                CardRecentGuidePerTypeHorizontal,
                "horizontal",
              ],
            ].map(([title, guides, CardComponent, orientation]) => (
              <View key={title} className="mb-6">
                <View className="flex-row justify-between items-center mb-2">
                  <Text className="text-4xl font-bold dark:text-text-dark">
                    {title}
                  </Text>
                  <TouchableOpacity
                    onPress={() => openGuideList(title.toLowerCase())}
                  >
                    <Text className='text-text dark:text-text-dark'><AntDesign name="arrowright" size={24} /></Text>
                  </TouchableOpacity>
                </View>

                {isFetchingGuides ? (
                  <ActivityIndicator
                    size="large"
                    color="blue"
                    className="py-4"
                  />
                ) : orientation === "horizontal" ? (
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{
                      gap: 8,
                      alignItems: "center",
                      paddingRight: 16,
                      paddingVertical: 16, // allows shadow breathing room
                    }}
                    className="px-0"
                    style={{
                      minHeight:
                        title === "DIY" || title === "Tools" ? 300 : 220,
                    }}
                  >
                    {guides.length > 0 ? (
                      guides.map((guide) => (
                        <CardComponent key={guide._id} guide={guide} />
                      ))
                    ) : (
                      <Text>No Guides Yet</Text>
                    )}
                  </ScrollView>
                ) : (
                  <View className="gap-4 items-center py-2">
                    {guides.length > 0 ? (
                      guides.map((guide) => (
                        <CardComponent key={guide._id} guide={guide} />
                      ))
                    ) : (
                      <Text>No Guides Yet</Text>
                    )}
                  </View>
                )}
              </View>
            ))}
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default Home;
