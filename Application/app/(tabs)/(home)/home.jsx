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
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter, useNavigation } from "expo-router";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from '@expo/vector-icons/Feather';
import Constants from "expo-constants";
import { useColorScheme } from "nativewind";

import CardRecentGuide from "@/components/card-recent-guide.jsx";
import CardRecentGuidePerTypeHorizontal from "@/components/card-recent-guide-pertype-horizontal.jsx";
import CardRecentGuidePerTypeVertical from "@/components/card-recent-guide-pertype-vertical.jsx";

import userStore from "@/store/user.store";
import guideStore from "@/store/guide.store";
import searchStore from "@/store/search.store";

const API_URL =
  Constants.expoConfig?.extra?.API_URL ?? Constants.manifest?.extra?.API_URL;

const Home = () => {
  // 🔒 Hooks MUST be declared at the top and unconditionally
  const router = useRouter();
  const navigation = useNavigation();
  const { colorScheme, toggleColorScheme } = useColorScheme();

  const [refreshing, setRefreshing] = useState(false);
  const statusBarColor = colorScheme === "dark" ? "black" : "white";

  // User store
  const user = userStore((state) => state.user);
  const isLoading = userStore((state) => state.isLoading);
  const error = userStore((state) => state.error);
  const getUserInfo = userStore((state) => state.getUserInfo);
  const checkUserLoggedIn = userStore((state) => state.checkUserLoggedIn);

  // Guide store
  const latestGuides = guideStore((state) => state.latestGuides);
  const getLatestGuide = guideStore((state) => state.getLatestGuide);
  const getLatestGuidePerType = guideStore(
    (state) => state.getLatestGuidePerType
  );
  const repairGuides = guideStore((state) => state.repairGuides);
  const diyGuides = guideStore((state) => state.diyGuides);
  const cookingGuides = guideStore((state) => state.cookingGuides);
  const toolGuides = guideStore((state) => state.toolGuides);
  const isFetchingGuides = guideStore((state) => state.isFetchingGuides);
  const errorFetchingGuides = guideStore((state) => state.errorFetchingGuides);

  //Search Store
  const users = searchStore((state) => state.users);
  const guides = searchStore((state) => state.guides);
  const isFetching = searchStore((state) => state.isFetching);
  const errors = searchStore((state) => state.errors);
  const getUsers = searchStore((state) => state.getUsers);
  const getGuides = searchStore((state) => state.getGuides);

  //preferences
  const preference = userStore((state) => state.preference);
  const getUserPreference = userStore((state) => state.getUserPreference);
  const addSearch = userStore((state) => state.addSearch);
  const removeSearch = userStore((state) => state.removeSearch);
  const clearSearch = userStore((state) => state.clearSearch);

  //searching functions
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    const delay = setTimeout(() => {
      if (searchTerm.trim() === "") {
        setSuggestions([]);
        return;
      }

      const lower = searchTerm.toLowerCase();

      const filteredUsers = users.filter((u) =>
        `${u.firstName} ${u.lastName}`.toLowerCase().includes(lower)
      );

      const filteredGuides = guides.filter((g) =>
        g.title.toLowerCase().includes(lower)
      );

      setSuggestions([...filteredUsers, ...filteredGuides]);
    }, 300); // debounce delay

    return () => clearTimeout(delay);
  }, [searchTerm, users, guides]);

  const openGuideList = (type) => {
    router.push(`/(tabs)/(home)/showguide/${type}`);
  };

  const doSearch = async (term) => {
    setSearchTerm(term)
    addSearch(user._id, term)
    router.push(`/(tabs)/(home)/searchresult/${term}`);
  };

  const handleRemoveSearch = async (search) => {
    removeSearch(user._id, search);
  }

  const checkVerified = async () => {
    try {
      if (user) {
        if (user.status === "Unverified") {
          await AsyncStorage.removeItem("token");
          await router.replace(`/(auth-screens)/verify-account/${user.email}`);
          return;
        }

        const preference = await axios.get(`${API_URL}preference/${user._id}`, {
          validateStatus: (status) => status < 500,
        });

        if (!preference.data.success) {
          await router.push("/modal/personalization");
          return;
        }
      }
    } catch (error) {
      console.log("error at home: ", error.message);
    }
  };

  const fetchGuides = async () => {
    if (latestGuides.length === 0) getLatestGuide();
    if (repairGuides.length === 0) getLatestGuidePerType("repair");
    if (diyGuides.length === 0) getLatestGuidePerType("diy");
    if (cookingGuides.length === 0) getLatestGuidePerType("cooking");
    if (toolGuides.length === 0) getLatestGuidePerType("tool");
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await getLatestGuide();
      await getLatestGuidePerType("repair");
      await getLatestGuidePerType("diy");
      await getLatestGuidePerType("cooking");
      await getLatestGuidePerType("tool");
      await checkUserLoggedIn();
      fetchGuides();
      getUsers();
      getGuides();
      getUserPreference();
    } catch (error) {
      console.error("Error refreshing data:", error);
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
    getUsers();
    getGuides();
    getUserPreference();
  }, []);


  useEffect(() => {
    const loadTheme = async () => {
      try {
        const storedTheme = await AsyncStorage.getItem("theme");
        if (storedTheme && storedTheme !== colorScheme) {
          toggleColorScheme();
        }
      } catch (error) {
        console.error("Failed to load theme:", error);
      }
    };
    loadTheme();
  }, []);

  if (error || errorFetchingGuides) {
    return (
      <View className="w-screen h-screen items-center justify-center dark:bg-background-dark dark:text-text-dark">
        <StatusBar backgroundColor={"transparent"} />
        <Text className="text-3xl font-extrabold text-red-500">
          {error || errorFetchingGuides}
        </Text>
        <Text>Please connect to a stable internet.</Text>
      </View>
    );
  }

  return (
    <>
      <SafeAreaView className="w-full h-full bg-background dark:bg-background-dark">
        {/* Sticky Search Bar */}
        <View className="w-full py-4 px-6 bg-white flex-row items-center gap-4 border-b border-gray-200 dark:bg-[#2A2A2A] dark:border-b-0">
          <TextInput
            className="flex-1 bg-[#EBEBEB] text-md rounded-3xl px-4 dark:bg-background-dark dark:text-text-dark"
            placeholder="Search a guide"
            placeholderTextColor={
              colorScheme === "dark" ? "#A0A0A0" : "#7A7A7A"
            }
            value={searchTerm}
            onChangeText={setSearchTerm}
            onSubmitEditing={() => {
              if (searchTerm.trim() !== "") {
                doSearch(searchTerm);
              }
            }}
          />
          {searchTerm.trim() !== "" && (
            <TouchableOpacity onPress={() => setSearchTerm("")}>
              <Text className="text-red-400">
                <Feather name="x-circle" size={24} />
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {searchTerm.trim() === "" ? (
          isLoading ? (
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
                        <Text className="text-text dark:text-text-dark">
                          <AntDesign name="arrowright" size={24} />
                        </Text>
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
          )
        ) : isFetching ? (
          <View className="w-full h-full item justify-center">
            <ActivityIndicator size={32} color={"blue"} />
          </View>
        ) : (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20, paddingTop: 20 }}
          >
            {preference?.previousSearches?.length > 0 ? (
              <>
                <View className="w-full flex-row mb-4 px-4 pr-6 items-center">
                  <Text className="text-2xl font-bold text-text dark:text-text-dark">History</Text>
                  <View className="flex-1" />
                  <TouchableOpacity onPress={() => clearSearch(user._id)}>
                    <Text className="text-text text-lg dark:text-text-dark underline">
                      Clear
                    </Text>
                  </TouchableOpacity>
                </View>

                <View className="w-full mb-4">
                  {preference.previousSearches.map((search, index) => (
                    <TouchableOpacity
                      key={index}
                      className="w-full flex-row px-4 py-4 border-b-[1px] border-t-[1px] border-gray-200 dark:border-gray-700"
                      onPress={() => doSearch(search)}
                    >
                      <Text className="text-md text-black dark:text-white">
                        {search}
                      </Text>
                      <View className="flex-1" />
                      <TouchableOpacity
                        onPress={() => handleRemoveSearch(search)}
                      >
                        <Text className="text-text dark:text-text-dark">
                          <Feather name="x" size={16} />
                        </Text>
                      </TouchableOpacity>
                    </TouchableOpacity>
                  ))}
                </View>
              </>
            ) : null}

            <View className="w-full flex-row mb-4 px-4">
              <Text className="text-2xl font-bold text-text dark:text-text-dark">Suggestions</Text>
            </View>
            {suggestions.map((item, index) => (
              <TouchableOpacity
                key={index}
                onPress={() =>
                  doSearch(
                    "title" in item
                      ? item.title
                      : `${item.firstName} ${item.lastName}`
                  )
                }
                className="w-full px-4 py-4 border-b-[1px] border-t-[1px] border-gray-200 dark:border-gray-700"
              >
                <Text className="text-md text-black dark:text-white">
                  {"title" in item
                    ? item.title
                    : `${item.firstName} ${item.lastName}`}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </SafeAreaView>
    </>
  );
};

export default Home;
