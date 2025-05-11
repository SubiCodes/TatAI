import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CheckBox from 'expo-checkbox'
import { colorScheme } from "nativewind";
import { useColorScheme } from "nativewind";

import empty_profile from "@/assets/images/profile-icons/empty_profile.png";
import boy_1 from "@/assets/images/profile-icons/boy_1.png";
import boy_2 from "@/assets/images/profile-icons/boy_2.png";
import boy_3 from "@/assets/images/profile-icons/boy_3.png";
import boy_4 from "@/assets/images/profile-icons/boy_4.png";
import girl_1 from "@/assets/images/profile-icons/girl_1.png";
import girl_2 from "@/assets/images/profile-icons/girl_2.png";
import girl_3 from "@/assets/images/profile-icons/girl_3.png";
import girl_4 from "@/assets/images/profile-icons/girl_4.png";
import lgbt_1 from "@/assets/images/profile-icons/lgbt_1.png";
import lgbt_2 from "@/assets/images/profile-icons/lgbt_2.png";
import lgbt_3 from "@/assets/images/profile-icons/lgbt_3.png";
import lgbt_4 from "@/assets/images/profile-icons/lgbt_4.png";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import RBSheet from "react-native-raw-bottom-sheet";
import CardViewProfile from "@/components/card-view-profile.jsx";

import guideStore from "@/store/guide.store.js";

function User() {
  const { id } = useLocalSearchParams();
  const filterSheet = useRef();
  const { colorScheme, toggleColorScheme } = useColorScheme();

  const getUserInfo = guideStore((state) => state.getUserInfo);
  const viewUserData = guideStore((state) => state.viewUserData);
  const viewUserInfoError = guideStore((state) => state.viewUserInfoError);
  const viewUserInfoLoading = guideStore((state) => state.viewUserInfoLoading);
  const getUserGuides = guideStore((state) => state.getUserGuides);
  const viewUserGuides = guideStore((state) => state.viewUserGuides);

  //get user age
  const getAge = (b) =>
    new Date(Date.now() - new Date(b)).getUTCFullYear() - 1970;
  //get total guides and average rating
  const totalGuides = viewUserGuides?.length;

  // Filter guides that have at least one rating
  const ratedGuides = viewUserGuides.filter(
    (g) => g.feedbackInfo.ratingCount > 0
  );

  // Sum up the averageRating * ratingCount for each rated guide
  const totalRatingValue = ratedGuides.reduce((sum, g) => {
    return sum + g.feedbackInfo.averageRating * g.feedbackInfo.ratingCount;
  }, 0);

  // Sum of all ratings submitted
  const totalRatingCount = ratedGuides.reduce((sum, g) => {
    return sum + g.feedbackInfo.ratingCount;
  }, 0);

  // Calculate average rating
  const averageRating =
    totalRatingCount > 0 ? totalRatingValue / totalRatingCount : 0;

  //Guide filtering
  const openSheet = () => {
    setTempCategory(category);
    setTempDate(date);
    setTempRatings(ratings);
    filterSheet?.current.open();
  };

  //filter states
  const [tempCategory, setTempCategory] = useState("all");
  const [tempDate, setTempDate] = useState("latest first");
  const [tempRatings, setTempRatings] = useState("any");

  const [category, setCategory] = useState("all");
  const [date, setDate] = useState("latest first");
  const [ratings, setRatings] = useState("any");

  const applyFilter = () => {
    setCategory(tempCategory);
    setDate(tempDate);
    setRatings(tempRatings);
  };

  //Setup Filters
  const [searchText, setSearchText] = useState("");

  // Filter Guides
  const filteredGuides = viewUserGuides
    ?.filter((guide) => {
      // Text search filter
      const matchesSearch =
        searchText === "" ||
        guide.title.toLowerCase().includes(searchText.toLowerCase()) ||
        guide.posterInfo.name.toLowerCase().includes(searchText.toLowerCase());

      // Category filter
      const matchesCategory =
        category === "all" || guide.type === category.toLowerCase();

      return matchesSearch && matchesCategory;
    })
    // Date filter
    .sort((a, b) => {
      const dateA = new Date(a.updatedAt);
      const dateB = new Date(b.updatedAt);

      if (date === "latest first") {
        return dateB - dateA; // Newest first
      } else {
        return dateA - dateB; // Oldest first
      }
    })
    // Ratings filter (applied after sorting by date)
    .sort((a, b) => {
      if (ratings === "any") {
        return 0; // Keep the date sorting
      } else if (ratings === "most") {
        return b.feedbackInfo.ratingCount - a.feedbackInfo.ratingCount;
      } else if (ratings === "highest") {
        return b.feedbackInfo.averageRating - a.feedbackInfo.averageRating;
      }
      return 0;
    });

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
  };

  useEffect(() => {
    getUserInfo(id);
    getUserGuides(id);
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

  //error display:
  if (viewUserInfoError) {
    return (
      <>
        <View className="w-full h-full  px-4 py-4 bg-white flex flex-col justify-start items-center z-50 gap-4 dark:bg-background-dark">
          <Text className="text-2xl text-red-500">Oops</Text>
          <Text className="text-lg text-red-400">Something went wrong.</Text>
        </View>
      </>
    );
  }

  //loading display:
  if (viewUserInfoLoading) {
    return (
      <>
        <View className="w-full h-full  px-4 py-4 bg-white flex flex-col justify-start items-center z-50 gap-4 dark:bg-background-dark">
          <ActivityIndicator size={32} color={"blue"} />
        </View>
      </>
    );
  }

  return (
    <View className="w-full h-full flex  bg-background dark:bg-background-dark">
      {/* Filtering Sheet */}
      <RBSheet
        ref={filterSheet}
        closeOnDragDown={true}
        closeOnPressMask={true}
        customStyles={{
          wrapper: {
            backgroundColor: "rgba(0,0,0,0.5)",
          },
          container: {
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            paddingHorizontal: 16,
            backgroundColor: colorScheme === "dark" ? "#2A2A2A" : "#FFFFFF",
            maxHeight: 450,
            minHeight: 450,
          },
          draggableIcon: {
            backgroundColor: colorScheme === "dark" ? "#A0A0A0" : "#000",
            width: 60,
          },
        }}
        customModalProps={{
          animationType: "slide",
          statusBarTranslucent: true,
        }}
      >
        <View className="w-full h-full flex py-4">
          <View className="w-full flex flex-col gap-4">
            <Text className="text-text text-2xl font-bold dark:text-text-dark mb-2 mt-2">
              Filter by category
            </Text>
            <View className="w-full flex-row gap-6 items-center flex-wrap">
              <View className="flex-row gap-2 items-center">
                <CheckBox
                  className="border-white dark:border-black"
                  value={tempCategory === "all"}
                  onValueChange={() => setTempCategory("all")}
                />
                <Text className="text-lg text-text dark:text-text-dark">
                  All
                </Text>
              </View>
              <View className="flex-row gap-2 items-center">
                <CheckBox
                  className="border-white dark:border-black"
                  value={tempCategory === "repair"}
                  onValueChange={() => setTempCategory("repair")}
                />
                <Text className="text-lg text-text dark:text-text-dark">
                  Repair
                </Text>
              </View>
              <View className="flex-row gap-2 items-center">
                <CheckBox
                  className="border-white dark:border-black"
                  value={tempCategory === "tool"}
                  onValueChange={() => setTempCategory("tool")}
                />
                <Text className="text-lg text-text dark:text-text-dark">
                  Tool
                </Text>
              </View>
              <View className="flex-row gap-2 items-center">
                <CheckBox
                  className="border-white dark:border-black"
                  value={tempCategory === "diy"}
                  onValueChange={() => setTempCategory("diy")}
                />
                <Text className="text-lg text-text dark:text-text-dark">
                  DIY
                </Text>
              </View>
            </View>
          </View>
          <View className="w-full flex flex-col gap-4">
            <Text className="text-text text-2xl font-bold dark:text-text-dark mb-2 mt-4">
              Filter by date
            </Text>
            <View className="w-full flex-row gap-6 items-center flex-wrap">
              <View className="flex-row gap-2 items-center">
                <CheckBox
                  className="border-white dark:border-black"
                  value={tempDate === "latest first"}
                  onValueChange={() => setTempDate("latest first")}
                />
                <Text className="text-lg text-text dark:text-text-dark">
                  Latest First
                </Text>
              </View>
              <View className="flex-row gap-2 items-center">
                <CheckBox
                  className="border-white dark:border-black"
                  value={tempDate === "latest last"}
                  onValueChange={() => setTempDate("latest last")}
                />
                <Text className="text-lg text-text dark:text-text-dark">
                  Latest Last
                </Text>
              </View>
            </View>
            <Text className="text-text text-2xl font-bold dark:text-text-dark mb-2 mt-2">
              Filter by ratings
            </Text>
            <View className="w-full flex-row gap-6 items-center flex-wrap">
              <View className="flex-row gap-2 items-center">
                <CheckBox
                  className="border-white dark:border-black"
                  value={tempRatings === "any"}
                  onValueChange={() => setTempRatings("any")}
                />
                <Text className="text-lg text-text dark:text-text-dark">
                  Any
                </Text>
              </View>
              <View className="flex-row gap-2 items-center">
                <CheckBox
                  className="border-white dark:border-black"
                  value={tempRatings === "most"}
                  onValueChange={() => setTempRatings("most")}
                />
                <Text className="text-lg text-text dark:text-text-dark">
                  Most Ratings
                </Text>
              </View>
              <View className="flex-row gap-2 items-center">
                <CheckBox
                  className="border-white dark:border-black"
                  value={tempRatings === "highest"}
                  onValueChange={() => setTempRatings("highest")}
                />
                <Text className="text-lg text-text dark:text-text-dark">
                  Highest Ratings
                </Text>
              </View>
            </View>
          </View>
          <TouchableOpacity
            className="w-full items-center justify-center py-2 bg-primary dark:bg-secondary rounded-lg mt-6"
            onPress={() => {
              applyFilter();
              filterSheet.current.close(); // Close the sheet after applying
            }}
          >
            <Text className="text-lg font-bold text-white dark:text-text-dark">
              Apply
            </Text>
          </TouchableOpacity>
        </View>
      </RBSheet>
      <ScrollView
        className="flex-1 z-50"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 50 }}
      >
        <View className="w-full px-6 py-8 flex flex-row gap-8 mb-4 bg-[#f8f6f2] rounded-2xl shadow-lg shadow-black/30 elevation-5 dark:bg-[#1f1f1f]">
          <View className="w-auto flex items-center justify-center">
            <Image
              source={
                profileIcons[viewUserData?.profileIcon || "empty_profile"]
              }
              className="w-20 h-20 rounded-full"
            />
          </View>

          <View className="flex-1 flex-col justify-center gap-4">
            <View className="w-full flex-col">
              <Text className="text-text text-xl font-bold dark:text-text-dark">{`${viewUserData?.firstName} ${viewUserData?.lastName}`}</Text>
              <View className="flex-row">
                <Text className="text-gray-400 dark:text-gray-500 mr-2">
                  Age:{" "}
                  <Text className="font-bold">
                    {getAge(viewUserData?.birthday)}
                  </Text>
                </Text>
                <Text className="text-gray-400 dark:text-gray-500">
                  Gender:{" "}
                  <Text className="font-bold">{viewUserData?.gender}</Text>
                </Text>
              </View>
            </View>
            <View className="w-full flex-row gap-6">
              <Text className="text-text font-bold text-base dark:text-text-dark">
                Guides: <Text className="font-normal">{totalGuides}</Text>
              </Text>
              <Text className="text-text font-bold text-base dark:text-text-dark">
                Rating:{" "}
                <Text className="font-normal">{averageRating.toFixed(2)}</Text>
              </Text>
            </View>
          </View>
        </View>

        <View className="w-full px-4 flex-row items-center justify-center gap-4 mb-4">
          <TextInput
            className="flex-1 bg-[#EBEBEB] text-md rounded-3xl px-4 text-text dark:bg-gray-200 dark:text-text"
            placeholder="Search a guide"
            placeholderTextColor={
              colorScheme === "dark" ? "#A0A0A0" : "#7A7A7A"
            }
            value={searchText}
            onChangeText={setSearchText}
          />
          <TouchableOpacity
            onPress={() => {
              openSheet();
            }}
          >
            <Text className="text-text dark:text-text-dark">
              <MaterialIcons name="filter-list" size={32} />
            </Text>
          </TouchableOpacity>
        </View>

        <View className="w-full flex-col px-6 items-center justify-center gap-2">
          {filteredGuides?.map((guide) => (
            <CardViewProfile guide={guide} key={guide._id}/>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

export default User;
