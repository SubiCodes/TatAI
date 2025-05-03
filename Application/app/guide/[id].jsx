import { useFocusEffect, useLocalSearchParams } from 'expo-router'
import { View, Text, ScrollView, ActivityIndicator, Image, TouchableOpacity } from 'react-native';
import React, { useCallback, useEffect } from 'react'
import { useRouter } from 'expo-router';

import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import AntDesign from '@expo/vector-icons/AntDesign';
import Entypo from '@expo/vector-icons/Entypo';

import guideStore from '@/store/guide.store'

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


function Guide() {
    const {id} = useLocalSearchParams();

    const guide = guideStore((state) => state.guide);
    const getGuide = guideStore((state) => state.getGuide);
    const isFetchingGuides = guideStore((state) => state.isFetchingGuides);
    const errorFetchingGuides = guideStore((state) => state.errorFetchingGuides);

    const feedbacks = guideStore((state) => state.feedbacks);
    const isFetchingFeedbacks = guideStore((state) => state.isFetchingFeedbacks);
    const errorFetchingFeedbacks = guideStore((state) => state.errorFetchingFeedbacks);
    const getFeedbacks = guideStore((state) => state.getFeedbacks);

    const router = useRouter();

    const goBack = () => {
      router.back();
    };

    useEffect(() => {
      getGuide(id);
      getFeedbacks(id);
    }, [id])

    useFocusEffect(
      useCallback(() => {

      }, [])
    );

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

    if (errorFetchingGuides){
     return (
      <>
      <View className="w-full mt-10 px-4 py-4 bg-white flex flex-row justify-start items-center z-50 gap-4 dark:bg-background-dark">
        <Text onPress={goBack}>
          <AntDesign name="arrowleft" size={24} />
        </Text>
        <Text className="text-xl">
          {" "}
          {isFetchingGuides
            ? ""
            : `${
                guide?.type[0]?.toUpperCase() + guide?.type?.substring(1)
              } Guide`}
        </Text>
        <View className="flex-1" />
        <Text>
          <FontAwesome6 name="bookmark" size={24} />
        </Text>
        <Text>
          <Entypo name="dots-three-vertical" size={24} color="black" />
        </Text>
      </View>
      <View className='flex-1 items-center justify-center'>
              <Text className='text-xl text-red-400 font-bold'>Unable to fetch guide.</Text>
      </View>
      </>
      )
    }
  return (
    <View className="w-full h-full flex mt-10 bg-background dark:bg-background-dark">
      <View className="w-full px-4 py-4 bg-white flex flex-row justify-start items-center z-50 gap-4 dark:bg-[#2A2A2A]">
        <Text onPress={goBack} className='text-text dark:text-text-dark'>
          <AntDesign name="arrowleft" size={24} />
        </Text>
        <Text className="text-xl text-text dark:text-text-dark">
          {" "}
          {isFetchingGuides
            ? ""
            : `${
                guide?.type[0]?.toUpperCase() + guide?.type?.substring(1)
              } Guide`}
        </Text>
        <View className="flex-1" />
        <Text className='text-text dark:text-text-dark'>
          <FontAwesome6 name="bookmark" size={24} />
        </Text>
        <Text className='text-text dark:text-text-dark'>
          <Entypo name="dots-three-vertical" size={24}/>
        </Text>
      </View>

      {/* Diplay Contents */}
      <ScrollView
        className="flex-1 z-50"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 50, paddingTop: 20 }}
      >
        {isFetchingGuides ? (
          <View className="w-full h-full flex items-center justify-center">
            <ActivityIndicator color={"blue"} />
          </View>
        ) : (
          <View className="w-full h-auto flex flex-col gap-2 px-6">
            {/* Title */}
            <View className="w-full items-center justify-center">
              <Text className="text-center text-text text-4xl font-bold dark:text-text-dark">
                {guide?.title}
              </Text>
            </View>

            {/* Cover Image */}
            <View className="w-full h-[250px] items-start justify-start mb-2 py-0">
              <Image
                className="w-full h-full"
                source={{
                  uri:
                    guide?.coverImg?.url ||
                    "https://via.placeholder.com/400x250",
                }}
                resizeMode="contain"
              />
            </View>

            {/* Description */}
            <View className="w-full items-center justify-center mb-8">
              <Text className="text-justify text-text text-lg dark:text-text-dark">
                {guide?.description}
              </Text>
            </View>

            {/* Tools Needed */}
            {guide?.type !== "tool" && (
              <View className="w-full flex-col mb-4">
                <Text className="text-start text-text text-3xl font-bold mb-2 dark:text-text-dark">
                  {guide?.type === "repair" || guide?.type === "diy"
                    ? "Tools"
                    : "Kitchenware"}
                </Text>
                {guide?.toolsNeeded?.map((tool, index) => (
                  <Text key={index} className="mb-2 text-lg text-text dark:text-text-dark">{`${
                    index + 1
                  }. ${tool}`}</Text>
                ))}
              </View>
            )}

            {/* Materials Needed */}
            {(guide?.type === "cooking" || guide?.type === "diy") && (
              <View className="w-full flex-col mb-16">
                <Text className="text-start text-text text-3xl font-bold mb-2 dark:text-text-dark">
                  {guide?.type === "cooking" ? "Ingredients" : "Materials"}
                </Text>
                <Text className="text-justify text-text text-lg dark:text-text-dark">
                  {guide?.materialsNeeded}
                </Text>
              </View>
            )}

            {/* Procedures */}
            <View className="w-full items-center justify-center mb-4">
              <Text className="text-center text-text text-3xl font-bold dark:text-text-dark">
                {guide?.type === "tool" ? "Tool Uses" : "Procedures"}
              </Text>
            </View>

            {guide?.stepTitles.map((title, index) => (
              <View key={index} className="w-full flex-col gap-4">
                {/* Step Title */}
                <View className="w-full flex flex-row gap-4">
                  <View className="w-auto flex items-start justify-start">
                    <View className="w-12 h-12 rounded-full bg-blue-200 flex items-center justify-center">
                      <Text>{`${index + 1}`}</Text>
                    </View>
                  </View>

                  <View className="flex-1 justify-center">
                    <Text className="text-left text-lg font-semibold text-text dark:text-text-dark">
                      {title}
                    </Text>
                  </View>
                </View>

                {/* Step Images */}
                <View className="w-auto h-[250px] items-start justify-start mb-2 py-0">
                  <Image
                    className="w-full h-full"
                    source={{
                      uri:
                        guide.stepImg[index]?.url ||
                        "https://via.placeholder.com/400x250",
                    }}
                    resizeMode="contain"
                  />
                </View>

                {/* Step Descriptions */}
                <View className="w-auto flex items-start justify-start mb-6">
                  <Text className="text-justify text-text text-lg dark:text-text-dark">
                    {guide?.description}
                  </Text>
                </View>
              </View>
            ))}

            {/* Closing Message */}
            <View className="w-full items-start justify-start mb-4">
              <Text className="text-start text-text text-3xl font-bold dark:text-text-dark">
                Closing Message
              </Text>
            </View>
            <View className="w-auto flex items-start justify-start mb-6">
              <Text className="text-justify text-text text-lg dark:text-text-dark">
                {guide?.closingMessage}
              </Text>
            </View>

            {/* Additional Links */}
            <View className="w-full items-start justify-start mb-4">
              <Text className="text-start text-text text-3xl font-bold dark:text-text-dark">
                Additional Links
              </Text>
            </View>
            <View className="w-full items-start justify-start mb-12">
              {guide?.additionalLink &&
                guide.additionalLink.split(/[\s\n]+/)?.map((link, index) => {
                  const cleanLink = link.trim();
                  if (
                    cleanLink &&
                    (cleanLink.includes("http") || cleanLink.includes("www"))
                  ) {
                    return (
                      <TouchableOpacity
                        key={index}
                        onPress={() =>
                          Linking.openURL(
                            cleanLink.startsWith("http")
                              ? cleanLink
                              : `https://${cleanLink}`
                          )
                        }
                        className="w-full"
                      >
                        <Text className="text-justify text-blue-600 text-lg break-words">
                          {cleanLink}
                        </Text>
                      </TouchableOpacity>
                    );
                  }
                  return null;
                })}
            </View>
          </View>
        )}

        {/* Feedbacks */}
        <View className="w-full items-center justify-start mb-8">
          <Text className="text-center text-text text-3xl font-bold dark:text-text-dark">
            Comments
          </Text>
        </View>

        {isFetchingFeedbacks ? (
          <View className="w-full h-full flex flex-col gap-2 items-center justify-center">
            <Text className='text-text text-md dark:text-text-dark'>Fetching Feedbacks</Text>
            <ActivityIndicator color={"blue"} />
          </View>
        ) : (
          <View className='w-full flex flex-col gap-4 px-6'>
            {feedbacks?.filter(comment => comment?.comment?.trim() !== '').map(comment => (
              <View key={comment._id} className="flex flex-col mb-6 w-full">
                {/* User Info */}
                <View className="flex-row gap-4 mb-4">
                  <Image
                    source={profileIcons[comment?.userInfo?.profileIcon || 'empty_profile']}
                    className="w-12 h-12 rounded-full"
                  />
                  <View className="flex-1">
                    <Text className="text-md font-semibold dark:text-text-dark">
                      {comment?.userInfo?.name || 'Anonymous'}
                    </Text>
                    <Text className="text-sm text-gray-500">
                      {comment?.userInfo?.email || ''}
                    </Text>
                  </View>
                </View>

                {/* Comment Text */}
                <View className="flex-row gap-4">
                  <Text className={`text-lg ${comment.hidden ? 'text-gray-400' : 'text-black dark:text-white'}`}>
                    {comment.comment}
                  </Text>
                </View>

                {/* Rating and Date */}
                <View className="flex-row gap-4 mt-1">
                  <Text className="text-sm text-gray-700 dark:text-gray-200">
                    Rating: {comment.rating || 'None'}
                  </Text>
                  <Text className="text-sm text-gray-700 dark:text-gray-200">
                    {new Date(comment.createdAt).toLocaleString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: 'numeric',
                      minute: 'numeric',
                    })}
                  </Text>
                </View>
              </View>
            ))}

          </View>
        )}

      </ScrollView>
    </View>
  );
}

export default Guide