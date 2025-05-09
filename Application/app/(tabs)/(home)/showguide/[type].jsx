import {
  View,
  Text,
  ScrollView,
  TextInput,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl
} from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Link, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useColorScheme } from "nativewind";
import { useRouter } from "expo-router";
import CheckBox from 'expo-checkbox'

import Octicons from "@expo/vector-icons/Octicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import CardRecentGuidePerTypeVertical from "@/components/card-recent-guide-pertype-vertical.jsx";
import RBSheet from "react-native-raw-bottom-sheet";

import guideStore from "@/store/guide.store";

const Type = () => {
  const { type } = useLocalSearchParams();
  const router = useRouter();
  const { colorScheme, toggleColorScheme } = useColorScheme();
  const [refreshing, setRefreshing] = useState(false);

  const isFetchingGuides = guideStore((state) => state.isFetchingGuides);
  const errorFetchingGuides = guideStore((state) => state.errorFetchingGuides);

  const getAllGuides = guideStore((state) => state.getAllGuides);
  const guides = guideStore((state) => state.guides);
  const getLatestGuidePerTypeAll = guideStore(
    (state) => state.getLatestGuidePerTypeAll
  );

  const handleGoBack = () => {
    router.back();
  }

  const sheetHeight = type === 'recent' ? 450 : 320;

  const filterSheet = useRef();

  const openSheet = () => {
    setTempCategory(category);
    setTempDate(date);
    setTempRatings(ratings);
    filterSheet?.current.open();
  }

  //filter states
  const [tempCategory, setTempCategory] = useState('all');
  const [tempDate, setTempDate] = useState('latest first');
  const [tempRatings, setTempRatings] = useState('any');

  const [category, setCategory] = useState('all');
  const [date, setDate] = useState('latest first');
  const [ratings, setRatings] = useState('any');

  const applyFilter = () => {
    setCategory(tempCategory);
    setDate(tempDate);
    setRatings(tempRatings);
  }

  //Setup Filters
  const [searchText, setSearchText] = useState('');

// Filter Guides
const filteredGuides = guides
  .filter((guide) => {
    // Text search filter
    const matchesSearch = searchText === '' || 
      guide.title.toLowerCase().includes(searchText.toLowerCase()) ||
      guide.posterInfo.name.toLowerCase().includes(searchText.toLowerCase());
    
    // Category filter
    const matchesCategory = category === 'all' || guide.type === category.toLowerCase();
    
    return matchesSearch && matchesCategory;
  })
  // Date filter
  .sort((a, b) => {
    const dateA = new Date(a.updatedAt);
    const dateB = new Date(b.updatedAt);
    
    if (date === 'latest first') {
      return dateB - dateA; // Newest first
    } else {
      return dateA - dateB; // Oldest first
    }
  })
  // Ratings filter (applied after sorting by date)
  .sort((a, b) => {
    if (ratings === 'any') {
      return 0; // Keep the date sorting
    } else if (ratings === 'most') {
      return b.feedbackInfo.ratingCount - a.feedbackInfo.ratingCount;
    } else if (ratings === 'highest') {
      return b.feedbackInfo.averageRating - a.feedbackInfo.averageRating;
    }
    return 0;
  });

  const fetchGuides = async () => {
    if (type === "recent") {
      getAllGuides();
      return;
    }
    getLatestGuidePerTypeAll(type);
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await fetchGuides();
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setRefreshing(false);
    }
  }, [type]);

  useFocusEffect(
    useCallback(() => {
      fetchGuides();
    }, [])
  );

  return (
    <>
      {/* Sticky Search Bar */}
      <View className="absolute top-0 left-0 right-0 z-50 pointer-events-auto">
        <View className="w-full py-4 px-6 bg-white flex flex-row items-center justify-center gap-4 border-b border-gray-200 dark:bg-[#2A2A2A] dark:border-b-0">
          <TouchableOpacity
            className="text-text dark:text-text-dark"
            onPress={() => {
              handleGoBack();
            }}
          >
            <MaterialIcons
              name="arrow-back"
              size={24}
              color={colorScheme === "dark" ? "#fff" : "#000"}
            />
          </TouchableOpacity>
          <TextInput
            className="flex-1 bg-[#EBEBEB] text-md rounded-3xl px-4 dark:bg-background-dark dark:text-text-dark"
            placeholder="Search a guide"
            placeholderTextColor={
              colorScheme === "dark" ? "#A0A0A0" : "#7A7A7A"
            }
            value={searchText}
            onChangeText={setSearchText}
          />
          <TouchableOpacity
            className="text-text dark:text-text-dark"
            onPress={() => {
              openSheet();
            }}
          >
            <MaterialIcons
              name="filter-list"
              size={24}
              color={colorScheme === "dark" ? "#fff" : "#000"}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Filter Sheet */}
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
            maxHeight: sheetHeight,
            minHeight: sheetHeight,
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
          {type === "recent" ? (
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
                <View className="flex-row gap-2 items-center">
                  <CheckBox
                    className="border-white dark:border-black"
                    value={tempCategory === "cooking"}
                    onValueChange={() => setTempCategory("cooking")}
                  />
                  <Text className="text-lg text-text dark:text-text-dark">
                    Cooking
                  </Text>
                </View>
              </View>
            </View>
          ) : null}
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

      {/* Scrollable Content */}
      <ScrollView
        className="flex-1 bg-background dark:bg-background-dark mt-16"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: 32, paddingBottom: 40 }}
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
        {/* Page Title */}
        <View className="w-full py-4 px-6">
          <Text className="text-text text-2xl font-bold dark:text-text-dark">
            {type[0].toUpperCase() + type.substring(1)} Guides
          </Text>
        </View>

        {/* Guides Content */}
        <View className="w-full flex flex-col items-center gap-4 px-6">
          {isFetchingGuides ? (
            <View className="w-full items-center py-4">
              <ActivityIndicator size="large" color="blue" />
            </View>
          ) : (
            filteredGuides.map((guide) => (
              <CardRecentGuidePerTypeVertical key={guide._id} guide={guide} />
            ))
          )}
        </View>
      </ScrollView>
    </>
  );
};

export default Type;