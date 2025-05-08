import {
  View,
  Text,
  StatusBar,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useColorScheme } from "nativewind";
import CheckBox from 'expo-checkbox'

import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import CardUser from "@/components/card-user.jsx";
import CardRecentGuidePerTypeVertical from "@/components/card-recent-guide-pertype-vertical.jsx";
import RBSheet from "react-native-raw-bottom-sheet";

import searchStore from "@/store/search.store.js";

const Results = () => {
  const { term } = useLocalSearchParams();
  const filterSheet = useRef();
  const { colorScheme, toggleColorScheme } = useColorScheme();

  const router = useRouter();
  const results = searchStore((state) => state.results);
  const getSearchResults = searchStore((state) => state.getSearchResults);
  const isFetching = searchStore((state) => state.isFetching);
  const errors = searchStore((state) => state.errors);

  const [activePage, setActivePage] = useState('all');

  const handleGoBack = () => {
    router.back();
  };

  useEffect(() => {
    getSearchResults(term);
  }, []);

  return (
    <>
      <SafeAreaView className="w-full h-full bg-background dark:bg-background-dark pt-16">
        <View className="absolute top-0 left-0 right-0 z-50">
          <View className="w-full py-4 px-6 bg-white flex-row items-center gap-4 border-b border-gray-200 dark:bg-[#2A2A2A] dark:border-b-0">
            <TouchableOpacity
              className="text-text dark:text-text-dark"
              onPress={() => {
                handleGoBack();
              }}
            >
              <Text className="text-text dark:text-text-dark">
                <MaterialIcons name="arrow-back" size={24} />
              </Text>
            </TouchableOpacity>
            <Text
              className="flex-1 text-base text-text dark:text-text-dark"
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {`Search result for:  "${term}"`}
            </Text>
          </View>
        </View>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
          // refreshControl={
          //   <RefreshControl
          //     refreshing={refreshing}
          //     onRefresh={onRefresh}
          //     colors={["#0066FF"]}
          //     tintColor={colorScheme === "dark" ? "#FFFFFF" : "#0066FF"}
          //     progressBackgroundColor={
          //       colorScheme === "dark" ? "#383838" : "#F2F2F2"
          //     }
          //   />
          // }
        >
          <View className="w-full flex-row mb-4 bg-white dark:bg-background-dark">
            <TouchableOpacity
              className={`flex-1 items-center justify-center py-4 ${
                activePage === "all" && "border-b-2 border-primary"
              }`}
              onPress={() => setActivePage("all")}
            >
              <Text className="text-lg text-text dark:text-text-dark">All</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={`flex-1 items-center justify-center py-4 ${
                activePage === "users" && "border-b-2 border-primary"
              }`}
              onPress={() => setActivePage("users")}
            >
              <Text className="text-lg text-text dark:text-text-dark">
                Users
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={`flex-1 items-center justify-center py-4 ${
                activePage === "guides" && "border-b-2 border-primary"
              }`}
              onPress={() => setActivePage("guides")}
            >
              <Text className="text-lg text-text dark:text-text-dark">
                Guides
              </Text>
            </TouchableOpacity>
          </View>
          {activePage === "all" ? (
            <View className="w-full flex-col gap-2 px-6">
              {results.length === 0 ? (
                <View className="w-full h-full items-center justify-center py-10">
                  <Text className="text-lg text-gray-400">No results.</Text>
                </View>
              ) : (
                results.map((item) => {
                  if (item.type === "user") {
                    return <CardUser key={item._id} user={item.data} />;
                  } else if (item.type === "guide") {
                    return (
                      <CardRecentGuidePerTypeVertical
                        key={item._id}
                        guide={item.data}
                      />
                    );
                  }
                  return null; // Unknown type
                })
              )}
            </View>
          ) : (
            null
          )}

          {activePage === "users" && (
            <View className="w-full flex-col gap-2 px-6">
              {results.filter((item) => item.type === "user").length > 0 ? (
                results
                  .filter((item) => item.type === "user")
                  .map((item) => <CardUser key={item._id} user={item.data} />)
              ) : (
                <View className="w-full h-full items-center justify-center mt-10">
                  <Text className="text-lg text-gray-400">No users found.</Text>
                </View>
              )}
            </View>
          )}

          {activePage === "guides" && (
            <View className="w-full flex-col gap-2 px-6">
              {results.filter((item) => item.type === "guide").length > 0 ? (
                results
                  .filter((item) => item.type === "guide")
                  .map((item) => (
                    <CardRecentGuidePerTypeVertical
                      key={item._id}
                      guide={item.data}
                    />
                  ))
              ) : (
                <View className="w-full h-full items-center justify-center mt-10">
                  <Text className="text-lg text-gray-400">
                    No guides found.
                  </Text>
                </View>
              )}
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default Results;
