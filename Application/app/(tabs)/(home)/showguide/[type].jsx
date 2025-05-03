import {
  View,
  Text,
  StatusBar,
  ScrollView,
  TextInput,
  ActivityIndicator,
  TouchableOpacity
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { Link, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useColorScheme } from "nativewind";
import { useRouter } from "expo-router";

import Octicons from "@expo/vector-icons/Octicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import CardRecentGuidePerTypeVertical from "@/components/card-recent-guide-pertype-vertical.jsx";

import guideStore from "@/store/guide.store";

const Type = () => {
  const { type } = useLocalSearchParams();
  const router = useRouter();
  const { colorScheme, toggleColorScheme } = useColorScheme();

  const isFetchingGuides = guideStore((state) => state.isFetchingGuides);
  const errorFetchingGuides = guideStore((state) => state.errorFetchingGuides);

  const getAllGuides = guideStore((state) => state.getAllGuides);
  const guides = guideStore((state) => state.guides);
  const getLatestGuidePerTypeAll = guideStore(
    (state) => state.getLatestGuidePerTypeAll
  );


  //Setup Filters
  const [searchText, setSearchText] = useState('');

  //Filter Guide
  const filteredGuides = guides.filter(
    (guide) =>
      guide.title.toLowerCase().includes(searchText.toLowerCase()) ||
      guide.posterInfo.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const fetchGuides = async () => {
    if (type === "recent") {
      getAllGuides();
      return;
    }
    getLatestGuidePerTypeAll(type);
  };

  useFocusEffect(
    useCallback(() => {
      fetchGuides();
    }, [])
  );

  return (
    <>
      <StatusBar className="dark:bg-background-dark" translucent={false} />

      {/* Sticky Search Bar */}
      <View className="absolute top-0 left-0 right-0 z-50 pointer-events-auto">
        <View className="w-full py-4 px-6 bg-white flex flex-row items-center justify-center gap-4 border-b border-gray-200 dark:bg-[#2A2A2A] dark:border-b-0">
          <Link className="text-text dark:text-text-dark" href={"/(tabs)/(home)/home"}>
            <MaterialIcons name="arrow-back" size={24} color={colorScheme === 'dark' ? '#fff' : '#000'} />
          </Link>
          <TextInput
            className="flex-1 bg-[#EBEBEB] text-md rounded-3xl px-4 dark:bg-background-dark dark:text-text-dark"
            placeholder="Search a guide"
            placeholderTextColor={
              colorScheme === "dark" ? "#A0A0A0" : "#7A7A7A"
            }
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>
      </View>

      {/* Scrollable Content */}
      <ScrollView
        className="flex-1 bg-background dark:bg-background-dark"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: 80, paddingBottom: 40 }}
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
