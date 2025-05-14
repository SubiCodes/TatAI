import { useFocusEffect, useLocalSearchParams } from 'expo-router'
import { View, Text, ScrollView, ActivityIndicator, Image, TouchableOpacity, TextInput, Linking, RefreshControl, Alert } from 'react-native';
import React, { useCallback, useEffect, useState, useRef } from 'react'
import { useRouter } from 'expo-router';
import { Rating } from '@kolking/react-native-rating';
import { useColorScheme } from 'nativewind';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import AntDesign from '@expo/vector-icons/AntDesign';
import Entypo from '@expo/vector-icons/Entypo';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Ionicons from '@expo/vector-icons/Ionicons';
import Fontisto from '@expo/vector-icons/Fontisto';
import guideStore from '@/store/guide.store';
import userStore from '@/store/user.store';
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
import RBSheet from 'react-native-raw-bottom-sheet'
import { useNavigation } from '@react-navigation/native';
import { Video } from 'expo-av';
import axios from 'axios';
import { Modal } from 'react-native';
import Constants from 'expo-constants';

const API_URL =
  Constants.expoConfig?.extra?.API_URL ?? Constants.manifest?.extra?.API_URL;


function Guide() {
  const { id } = useLocalSearchParams();
  const refRBSheet = useRef(); //ref or user comment
  const refRBSheet2 = useRef(); //ref for reporting other comments
  const refRBSheet3 = useRef(); //ref for editing comment
  const refRBSheet4 = useRef(); //ref for confirmng delete
  const refRBSheet5 = useRef(); //ref for reporting guide
  const refRBSheet6 = useRef(); //ref for confirming rating
  const refRBSheetRatings = useRef(); //ref for confirming rating
  const user = userStore((state) => state.user);
  const getUserInfo = userStore((state) => state.getUserInfo);
  const guide = guideStore((state) => state.guide);
  const deleteGuide = guideStore((state) => state.deleteGuide);
  const isDeleting = guideStore((state) => state.isDeleting);
  const getGuide = guideStore((state) => state.getGuide);
  const isFetchingGuides = guideStore((state) => state.isFetchingGuides);
  const errorFetchingGuides = guideStore((state) => state.errorFetchingGuides);
  const feedbacks = guideStore((state) => state.feedbacks);
  const isFetchingFeedbacks = guideStore((state) => state.isFetchingFeedbacks);
  const errorFetchingFeedbacks = guideStore(
    (state) => state.errorFetchingFeedbacks
  );
  const getFeedbacks = guideStore((state) => state.getFeedbacks);
  const postFeedbackRating = guideStore((state) => state.postFeedbackRating);
  const postFeedbackComment = guideStore((state) => state.postFeedbackComment);
  const deleteFeedbackComment = guideStore(
    (state) => state.deleteFeedbackComment
  );
  const isBookmarked = guideStore((state) => state.isBookmarked);
  const checkIfBookmarked = guideStore((state) => state.checkIfBookmarked);
  const handleBookmark = guideStore((state) => state.handleBookmark);
  const deleteRating = guideStore((state) => state.deleteRating);
  const { colorScheme, toggleColorScheme } = useColorScheme();
  const [refreshing, setRefreshing] = useState(false);

  // const userFeedback =  feedbacks?.filter((feedback) => typeof feedback.comment === "string" && feedback.comment.trim() !== "" && feedback.userId === user._id);
  // const [userComment, setUserComment] = useState(userComment?.comment);
  const router = useRouter();

  const handleDeleteGuide = async () => {
    try {
      Alert.alert(
        "Delete Guide",
        "Are you sure you want to delete this guide?",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Delete",
            style: "destructive",
            onPress: async () => {
              try {
                console.log("Guide deleted");
                const coverImgObj = guide.coverImg
                  ? { url: guide.coverImg.url, public_id: guide.coverImg.public_id }
                  : null;

                const stepImgObjs = Array.isArray(guide.stepImg)
                  ? guide.stepImg.map(img => ({ url: img.url, public_id: img.public_id }))
                  : [];

                const imageData = coverImgObj ? [coverImgObj, ...stepImgObjs] : stepImgObjs;
                console.log(imageData);
                const res = await deleteGuide(guide, imageData);
                router.back();
              } catch (error) {
                console.error("Error deleting guide:", error);
                Alert.alert("Error", "Something went wrong while deleting the guide.");
              }
            },
          },
        ]
      );
    } catch (error) {
      console.error("Unexpected error:", error);
      Alert.alert("Error", "An unexpected error occurred.");
    }
  };

  const reportGuide = async () => {

    Alert.alert("Reporting Guide", "Please wait...", [], { cancelable: false });
    let success = false;

    try {
      const res = await axios.post(`${API_URL}user/report`, { from: user?.email, type: "Guide", guideTitle: guide?.title, comment: "", posterName: guide?.uploader })
      success = true
    } catch (error) {
      console.error("Report error:", error);
      success = false;
    } finally {
      // Step 3: Dismiss the first alert (workaround using timeout)
      setTimeout(() => {
        // Step 4: Show result alert
        Alert.alert(
          success ? "Report Submitted" : "Report Failed",
          success
            ? "Your report has been sent successfully."
            : "There was an error submitting your report. Please try again."
        );
      }, 500); // Wait briefly before showing final alert
    }
  };

  const reportComment = async (comment, commenter) => {

    Alert.alert("Reporting Guide", "Please wait...", [], { cancelable: false });
    let success = false;

    try {
      console.log(`${API_URL}user/report`);
      console.log(`from: ${user?.email}, type: ${"Guide"}, title: "", comment: ${comment}, posterName: ${commenter}`);
      const res = await axios.post(`${API_URL}user/report`, { from: user?.email, type: "Comment", guideTitle: guide?.title, comment: comment, posterName: commenter })
      success = true
    } catch (error) {
      console.error("Report error:", error);
      success = false;
    } finally {
      // Step 3: Dismiss the first alert (workaround using timeout)
      setTimeout(() => {
        // Step 4: Show result alert
        Alert.alert(
          success ? "Report Submitted" : "Report Failed",
          success
            ? "Your report has been sent successfully."
            : "There was an error submitting your report. Please try again."
        );
      }, 500); // Wait briefly before showing final alert
    }
  };

  const checkVerified = async () => {
    try {
      if (user) {
        if (user.status === "Banned") {
          Alert.alert(
            "Account Banned",
            "Your account has been banned. Please contact tataihomeassistant@gmail.com for more information.",
            [
              {
                text: "OK",
                onPress: async () => {
                  await AsyncStorage.removeItem("token");
                  await router.replace(`/(auth-screens)/signin`);
                },
              },
            ],
            { cancelable: false }
          );
          return;
        }

        if (user.status === "Unverified") {
          await AsyncStorage.removeItem("token");
          await router.replace(`/(auth-screens)/verify-account/${user.email}`);
          return;
        }
      }
    } catch (error) {
      console.log("error at home: ", error.message);
    }
  };

  const handleViewPoster = () => {
    if (guide?.userID) {
      router.push(`/user/${guide.userID}`);
    } else {
      Alert.alert(
        "User not found",
        "This user might have been banned or deleted.",
        [{ text: "OK" }]
      );
    }
  };

  const goBack = () => {
    navigation.goBack();
  };

  const [bookmark, setBookmark] = useState();

  const fetchBookmarkStatus = async () => {
    const status = await checkIfBookmarked(id, user?._id);
    setBookmark(status);
  };

  const handleBookmarking = async () => {
    await handleBookmark(id, user._id);
    fetchBookmarkStatus(id, user._id);
  };

  useEffect(() => {
    fetchBookmarkStatus();
  }, []);

  const navigation = useNavigation();

  useEffect(() => {
    getGuide(id, navigation, user._id);
    getFeedbacks(id);
    getUserInfo();
    checkVerified();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      getGuide(id, navigation, user._id);
      getFeedbacks(id);
      getUserInfo();
      checkVerified();
    } catch (error) {
      console.error("Error refreshing data:", error);
    } finally {
      setRefreshing(false);
    }
  }, []);

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

  //Functions and theyre requirements
  const [tempRating, setTempRating] = useState(0);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const checkExistingRating = () => {
    const existingFeedback = feedbacks?.find(
      (feedback) => feedback.userId === user._id
    );
    if (existingFeedback) {
      setRating(existingFeedback.rating);
    } else {
      setRating(0);
    }
  };

  const handleChange = useCallback(
    async (value) => {
      const roundedRating = Math.round(value);
      setRating(roundedRating);

      try {
        await postFeedbackRating(id, user._id, roundedRating, user, feedbacks);
      } catch (error) {
        console.log("Error posting feedback:", error);
      }
    },
    [id, user, feedbacks, postFeedbackRating]
  );

  const handleRemoveRating = async () => {
    deleteRating(id, user._id);
  };

  useEffect(() => {
    checkExistingRating();
  }, [feedbacks]);

  const handlePostComment = async () => {
    console.log(comment);
    if (comment.trim() !== "") {
      await postFeedbackComment(id, user._id, comment, user, feedbacks);
      setComment(""); // Clear comment after posting
      refRBSheet.current.close(); // Close the sheet after posting
    }
  };

  const handleDeleteComment = async () => {
    await deleteFeedbackComment(id, user._id, "", user, feedbacks);
    setComment("");
    refRBSheet.current.close();
  };

  if (errorFetchingGuides) {
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
              : `${guide?.type[0]?.toUpperCase() + guide?.type?.substring(1)
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
        <View className="flex-1 items-center justify-center">
          <Text className="text-xl text-red-400 font-bold">
            Unable to fetch guide.
          </Text>
        </View>
      </>
    );
  }

  return (
    <View className="w-full h-full flex bg-background dark:bg-background-dark">
      <View className="w-full px-4 py-4 bg-white flex flex-row justify-start items-center z-50 gap-4 dark:bg-[#2A2A2A]">
        <Text onPress={goBack} className="text-text dark:text-text-dark">
          <AntDesign name="arrowleft" size={24} />
        </Text>
        <Text className="text-xl text-text dark:text-text-dark">
          {" "}
          {isFetchingGuides
            ? ""
            : `${guide?.type[0]?.toUpperCase() + guide?.type?.substring(1)
            } Guide`}
        </Text>
        <View className="flex-1" />
        <TouchableOpacity
          onPress={() => {
            handleBookmarking();
          }}
        >
          {bookmark ? (
            <Text className="text-primary dark:text-secondary">
              <Fontisto name="bookmark-alt" size={24} />
            </Text>
          ) : (
            <Text className="text-text dark:text-text-dark">
              <Fontisto name="bookmark" size={24} />
            </Text>
          )}
        </TouchableOpacity>
        <Text
          className="text-text dark:text-text-dark"
          onPress={() => refRBSheet5?.current.open()}
        >
          <Entypo name="dots-three-vertical" size={24} />
        </Text>
      </View>

      <RBSheet
        ref={refRBSheet5}
        closeOnDragDown={true}
        closeOnPressMask={true}
        animationType="slide"
        customStyles={{
          wrapper: {
            backgroundColor: "rgba(0,0,0,0.5)",
          },
          container: {
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            paddingHorizontal: 16,
            backgroundColor: colorScheme === "dark" ? "#2A2A2A" : "#FFFFFF",
            maxHeight: 80, // Maximum constraint to prevent taking up the entire screen
          },
          draggableIcon: {
            backgroundColor: colorScheme === "dark" ? "#A0A0A0" : "#000",
            width: 60,
          },
        }}
      >
        <View className="py-4 gap-4">
          {guide?.userID !== user._id ? (
            <TouchableOpacity className="w-full bg-red-500 dark:bg-red-600 py-3 rounded-xl shadow-sm active:opacity-80" onPress={() => { reportGuide(); refRBSheet5?.current.close() }}>
              <Text className="text-center text-white text-lg font-semibold">
                Report Guide
              </Text>
            </TouchableOpacity>
          ) : null}

          {guide?.userID === user._id ? (
            <TouchableOpacity className="w-full bg-red-500 dark:bg-red-600 py-3 rounded-xl shadow-sm active:opacity-80" onPress={() => { handleDeleteGuide(); refRBSheet5?.current.close()}}>
              <Text className="text-center text-white text-lg font-semibold">
                Delete Guide
              </Text>
            </TouchableOpacity>
          ) : null}

        </View>
      </RBSheet>

      {/* Display Contents */}
      <ScrollView
        className="flex-1 z-50"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 50, paddingTop: 20 }}
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
        {isFetchingGuides ? (
          <View className="w-full h-full flex items-center justify-center">
            <ActivityIndicator color={"blue"} />
          </View>
        ) : (
          <View className="w-full h-auto flex flex-col gap-2 px-6">
            {/* Title */}
            <View className="w-full items-start justify-center mb-2">
              <Text className="text-justify text-text text-5xl font-bold dark:text-text-dark">
                {guide?.title}
              </Text>
            </View>
            {/* Guide informations */}
            <View className="w-full items-start justify-center flex-col mb-4">
              <Text className="text-justify text-text text-lg dark:text-text-dark">
                Posted by:{" "}
                <Text className="font-black underline" onPress={() => { handleViewPoster() }}>
                  {guide?.posterInfo.name}
                </Text>
              </Text>
              <Text className="text-justify text-text text-lg dark:text-text-dark">
                Last updated:{" "}
                {new Date(guide?.updatedAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
                </Text>
                {guide?.userID === user._id ? (
                  <Text className="text-justify text-text text-lg dark:text-text-dark">
                    Guide Status: {" "}
                    <Text className="font-black">
                      {guide?.status?.charAt(0).toUpperCase() + guide?.status?.slice(1)}
                    </Text>
                  </Text>
                ) : null}

            </View>
            <View className="w-full flex flex-row gap-6">
              <View className="flex flex-row items-center justify-center gap-2">
                <Text className="text-primary dark:text-secondary">
                  <AntDesign name="star" size={20} />
                </Text>
                <Text className="text-text dark:text-text-dark">
                  {guide?.feedbackInfo.averageRating}
                </Text>
              </View>
              <View className="flex flex-row items-center justify-center gap-2">
                <Text className="text-primary dark:text-secondary">
                  <MaterialCommunityIcons
                    name="comment-text-outline"
                    size={20}
                  />
                </Text>
                <Text className="text-text dark:text-text-dark">
                  {guide?.feedbackInfo.commentCount}
                </Text>
              </View>
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
                  <Text
                    key={index}
                    className="mb-2 text-lg text-text dark:text-text-dark"
                  >{`${index + 1}. ${tool}`}</Text>
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
            {guide?.stepTitles.map((title, index) => {
              const mediaUrl = guide.stepImg[index]?.url;
              const isVideo = mediaUrl?.toLowerCase().includes("video");

              return (
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

                  {/* Step Images or Video */}
                  <View className="w-auto h-[250px] items-start justify-start mb-2 py-0">
                    {isVideo ? (
                      <Video
                        source={{ uri: mediaUrl }}
                        rate={1.0}
                        volume={1.0}
                        isMuted={false}
                        resizeMode="contain"
                        shouldPlay={false}
                        useNativeControls
                        style={{ width: '100%', height: '100%' }}
                      />
                    ) : (
                      <Image
                        className="w-full h-full"
                        source={{
                          uri: mediaUrl || "https://via.placeholder.com/400x250",
                        }}
                        resizeMode="contain"
                      />
                    )}
                  </View>

                  {/* Step Descriptions */}
                  <View className="w-auto flex items-start justify-start mb-6">
                    <Text className="text-justify text-text text-lg dark:text-text-dark">
                      {guide?.description}
                    </Text>
                  </View>
                </View>
              );
            })}
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
        {/* Ratings */}
        <RBSheet
          ref={refRBSheet6}
          closeOnDragDown={true}
          closeOnPressMask={true}
          animationType="slide"
          customStyles={{
            wrapper: {
              backgroundColor: "rgba(0,0,0,0.5)",
            },
            container: {
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              paddingHorizontal: 16,
              backgroundColor: colorScheme === "dark" ? "#2A2A2A" : "#FFFFFF",
              maxHeight: 120,
            },
            draggableIcon: {
              backgroundColor: colorScheme === "dark" ? "#A0A0A0" : "#000",
              width: 60,
            },
          }}
        >
          <View className="py-4">
            <Text className="text-xl font-bold mb-4 text-text dark:text-text-dark">
              Remove Rating?
            </Text>
            <TouchableOpacity
              className="bg-red-400 dark:bg-red-500 py-3 rounded-lg items-center mb-4"
              onPress={() => {
                handleRemoveRating();
                setRating(0);
                refRBSheet6?.current.close();
              }}
            >
              <Text className="text-white font-semibold">Delete</Text>
            </TouchableOpacity>
          </View>
        </RBSheet>

      <RBSheet
        ref={refRBSheetRatings}
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
          <ScrollView
            className="flex-1 z-50"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 50, paddingTop: 20 }}
          >
            {isFetchingFeedbacks || isFetchingGuides ? null : (
              <View className="w-full flex flex-col gap-2 px-6 mb-4">
                {feedbacks
                  ?.filter(
                    (feedback) =>
                      feedback?.rating // Only feedbacks with rating, exclude own
                  )
                  .map((feedback) => (
                    <View key={feedback._id} className="flex flex-col mb-6 w-full">
                      {/* User Info */}
                      <View className="flex-row gap-4 mb-4">
                        <Image
                          source={
                            profileIcons[feedback?.userInfo?.profileIcon || "empty_profile"]
                          }
                          className="w-16 h-16 rounded-full"
                        />
                        <View className="mr-4">
                          <Text className="text-md font-semibold dark:text-text-dark">
                            {feedback?.userInfo?.name || "Anonymous"}
                          </Text>
                          <Text className="text-sm text-gray-500">
                            {feedback?.userInfo?.email || ""}
                          </Text>
                          <Text className="text-base text-gray-700 dark:text-gray-200">
                            Rating: {feedback.rating} ⭐
                          </Text>
                        </View>
                      </View>
                    </View>
                  ))}
              </View>
            )}
          </ScrollView>
        </RBSheet>

        {!isFetchingFeedbacks && !isFetchingGuides && (
          <>
            <View className="w-full items-center justify-start mb-8">
              <Text className="text-center text-text text-3xl font-bold dark:text-text-dark">
                Rate Guide
              </Text>
            </View>
            <View className="w-full flex flex-col gap-4 px-6 mb-8 items-center justify-center">
              <Rating
                size={40}
                rating={rating}
                onChange={handleChange}
                baseColor={colorScheme === "dark" ? "#A7C7E7" : "#A7C7E7"}
                fillColor={colorScheme === "dark" ? "#006FFD" : "#0818A8"}
              />
              <Text className="text-text dark:text-text-dark">
                You rated {rating} out of 5!
              </Text>
              <Text
                className="underline text-red-600 dark:text-red-500"
                onPress={() => {
                  refRBSheet6?.current.open();
                }}
              >
                Remove rating
              </Text>
              <Text className='underline text-text dark:text-text-dark' onPress={() => refRBSheetRatings?.current.open()}>
                Click to View Ratings.
              </Text>
            </View>
          </>
        )}
        {/* Comments */}
        {!isFetchingFeedbacks && !isFetchingGuides && (
          <View className="w-full items-center justify-start mb-8">
            <Text className="text-center text-text text-3xl font-bold dark:text-text-dark">
              Comments
            </Text>
          </View>
        )}

        {/* Add Comment */}
        {!isFetchingFeedbacks &&
          !isFetchingGuides &&
          user &&
          feedbacks &&
          (() => {
            const userHasCommented = feedbacks.some(
              (comment) =>
                comment.userId === user._id && comment.comment?.trim() // ensures it's not null/undefined/empty
            );

            if (userHasCommented) return null; // Don't render comment box if already commented
            

            return (
              <View className="w-full flex flex-col gap-2 px-6 mb-8">
                <View className="flex flex-row gap-4 mb-0">
                  <Image
                    source={profileIcons[user?.profileIcon || "empty_profile"]}
                    className="w-12 h-12 rounded-full"
                  />
                  <View className="flex-1">
                    <Text className="text-md font-semibold dark:text-text-dark">
                      {`${user?.firstName} ${user?.lastName}`}
                    </Text>
                    <Text className="text-sm text-gray-500">{user?.email}</Text>
                  </View>
                </View>

                <View className="w-full flex flex-row gap-6 pr-6">
                  <TextInput
                    className="flex-1 border-b-[1px] border-b-gray-200 text-text dark:text-text-dark"
                    placeholder={user?.status === "Verified" ? "Write a comment" : "Your account has been restricted by an administrator. You are currently unable to post comments."}
                    placeholderTextColor={
                      colorScheme === "dark" ? "#A0A0A0" : "#7A7A7A"
                    }
                    multiline={true}
                    textAlignVertical="top"
                    value={comment}
                    onChangeText={setComment}
                    editable={user?.status === 'Verified'}
                  />
                  <View className="flex justify-end">
                    <TouchableOpacity
                      onPress={() => {
                        handlePostComment();
                      }}
                      disabled={!comment}
                    >
                      <Text className="text-primary dark:text-secondary">
                        <Ionicons name="send" size={24} />
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            );
          })()}

        {/* Comments by the user */}
        {isFetchingFeedbacks || isFetchingGuides ? null : (
          <View className="w-full flex flex-col gap-4 px-6">
            {feedbacks
              ?.filter(
                (feedback) =>
                  typeof feedback.comment === "string" &&
                  feedback.comment.trim() !== "" &&
                  feedback.userId === user._id
              )
              .map((comment) => (
                <View key={comment._id} className="flex flex-col mb-6 w-full">
                  {/* User Info */}
                  <View className="flex-row gap-4 mb-4">
                    <Image
                      source={
                        profileIcons[
                        comment?.userInfo?.profileIcon || "empty_profile"
                        ]
                      }
                      className="w-12 h-12 rounded-full"
                    />
                    <View className="mr-4">
                      <Text className="text-md font-semibold dark:text-text-dark">
                        {comment?.userInfo?.name || "Deleted User"}
                      </Text>
                      <Text className="text-sm text-gray-500">
                        {comment?.userInfo?.email || ""}
                      </Text>
                    </View>
                    <View className="flex items-center justify-center">
                      <TouchableOpacity
                        onPress={() => {
                          if (user?.status === "Verified") {
                            refRBSheet.current.open()
                          } else {
                            Alert.alert(
                              "Account Restricted",
                              "Your account has been Restricted. Unabling you to comment, post and edit guides.",
                              [
                                {
                                  text: "OK",
                                  onPress: async () => {
                                    await AsyncStorage.removeItem("token");
                                    await router.replace(`/(auth-screens)/signin`);
                                  }
                                }
                              ],
                              { cancelable: false }
                            );
                          }
                        }}
                      >
                        <Text className="text-gray-600 dark:text-gray-300">
                          <Entypo name="dots-three-horizontal" size={18} />
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                  {/* Comment Text */}
                  <View className="flex-row gap-4">
                    <Text
                      className={`text-lg ${comment.hidden
                          ? "text-gray-400"
                          : "text-black dark:text-white"
                        }`}
                    >
                      {comment.comment}
                    </Text>
                  </View>
                  {/* Rating and Date */}
                  <View className="flex-row gap-4 mt-1">
                    <Text className="text-sm text-gray-700 dark:text-gray-200">
                      Rating: {comment.rating || "None"}
                    </Text>
                    <Text className="text-sm text-gray-700 dark:text-gray-200">
                      {new Date(comment.createdAt).toLocaleString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "numeric",
                        minute: "numeric",
                      })}
                    </Text>
                  </View>
                  {/* Bottom Sheet Actions */}
                  <RBSheet
                    ref={refRBSheet}
                    closeOnDragDown={true}
                    closeOnPressMask={true}
                    animationType="slide"
                    customStyles={{
                      wrapper: {
                        backgroundColor: "rgba(0,0,0,0.5)",
                      },
                      container: {
                        borderTopLeftRadius: 20,
                        borderTopRightRadius: 20,
                        paddingHorizontal: 16,
                        backgroundColor:
                          colorScheme === "dark" ? "#2A2A2A" : "#FFFFFF",
                        maxHeight: 150, // Maximum constraint to prevent taking up the entire screen
                      },
                      draggableIcon: {
                        backgroundColor:
                          colorScheme === "dark" ? "#A0A0A0" : "#000",
                        width: 60,
                      },
                    }}
                  >
                    <View className="py-4 pb-24 gap-4">
                      <TouchableOpacity className="w-full bg-blue-500 dark:bg-blue-600 py-3 rounded-xl shadow-sm active:opacity-80">
                        <Text
                          className="text-center text-white text-lg font-semibold"
                          onPress={() => {
                            setComment(comment.comment);
                            refRBSheet3?.current.open();
                          }}
                        >
                          Edit
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        className="w-full bg-red-500 dark:bg-red-600 py-3 rounded-xl shadow-sm active:opacity-80"
                        onPress={() => {
                          refRBSheet4?.current.open();
                        }}
                      >
                        <Text className="text-center text-white text-lg font-semibold">
                          Delete
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </RBSheet>
                  {/* Delete Confirmation */}
                  <RBSheet
                    ref={refRBSheet4}
                    closeOnDragDown={true}
                    closeOnPressMask={true}
                    animationType="slide"
                    customStyles={{
                      wrapper: {
                        backgroundColor: "rgba(0,0,0,0.5)",
                      },
                      container: {
                        borderTopLeftRadius: 20,
                        borderTopRightRadius: 20,
                        paddingHorizontal: 16,
                        backgroundColor:
                          colorScheme === "dark" ? "#2A2A2A" : "#FFFFFF",
                        maxHeight: "80%", // Maximum constraint to prevent taking up the entire screen
                      },
                      draggableIcon: {
                        backgroundColor:
                          colorScheme === "dark" ? "#A0A0A0" : "#000",
                        width: 60,
                      },
                    }}
                  >
                    <View className="py-4">
                      <Text className="text-xl font-bold mb-4 text-text dark:text-text-dark">
                        Delete Comment
                      </Text>

                      <View className="flex flex-row gap-4 mb-2">
                        <Image
                          source={
                            profileIcons[user?.profileIcon || "empty_profile"]
                          }
                          className="w-12 h-12 rounded-full"
                        />
                        <View>
                          <Text className="text-md font-semibold dark:text-text-dark">
                            {`${user?.firstName} ${user?.lastName}`}
                          </Text>
                          <Text className="text-sm text-gray-500">
                            {user?.email}
                          </Text>
                        </View>
                      </View>

                      <Text className="py-4 mb-4 text-text dark:text-text-dark">
                        {comment.comment}
                      </Text>

                      <TouchableOpacity
                        className="bg-red-400 dark:bg-red-500 py-3 rounded-lg items-center mb-4"
                        onPress={() => handleDeleteComment()}
                      >
                        <Text className="text-white font-semibold">
                          Delete Comment
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </RBSheet>
                </View>
              ))}
          </View>
        )}

        {/* Edit Comment */}
        {/* Bottom Sheet Edit */}
        <RBSheet
          ref={refRBSheet3}
          closeOnDragDown={true}
          closeOnPressMask={true}
          animationType="slide"
          customStyles={{
            wrapper: {
              backgroundColor: "rgba(0,0,0,0.5)",
            },
            container: {
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              paddingHorizontal: 16,
              backgroundColor: colorScheme === "dark" ? "#2A2A2A" : "#FFFFFF",
              maxHeight: "80%", // Maximum constraint to prevent taking up the entire screen
            },
            draggableIcon: {
              backgroundColor: colorScheme === "dark" ? "#A0A0A0" : "#000",
              width: 60,
            },
          }}
        >
          <View className="py-4">
            <Text className="text-xl font-bold mb-4 text-text dark:text-text-dark">
              Edit Comment
            </Text>

            <View className="flex flex-row gap-4 mb-2">
              <Image
                source={profileIcons[user?.profileIcon || "empty_profile"]}
                className="w-12 h-12 rounded-full"
              />
              <View>
                <Text className="text-md font-semibold dark:text-text-dark">
                  {`${user?.firstName} ${user?.lastName}`}
                </Text>
                <Text className="text-sm text-gray-500">{user?.email}</Text>
              </View>
            </View>

            <TextInput
              className="border border-gray-300 rounded-lg p-4 mb-4 text-text dark:text-text-dark"
              style={{ textAlignVertical: "top" }}
              placeholder="Write your comment here..."
              placeholderTextColor={
                colorScheme === "dark" ? "#A0A0A0" : "#7A7A7A"
              }
              multiline={true}
              numberOfLines={4}
              value={comment}
              onChangeText={setComment}
            />

            <TouchableOpacity
              className="bg-primary dark:bg-secondary py-3 rounded-lg items-center mb-4"
              onPress={() => {
                handlePostComment();
                refRBSheet3?.current.close();
              }}
            >
              <Text className="text-white font-semibold">Post Comment</Text>
            </TouchableOpacity>
          </View>
        </RBSheet>

        {/* Comments by other users */}
        {isFetchingFeedbacks || isFetchingGuides ? null : (
          <View className="w-full flex flex-col gap-2 px-6 mb-4">
            {feedbacks
              ?.filter(
                (feedback) =>{
                  const comment = feedback?.comment;
                  return (
                    typeof comment === "string" &&
                    comment.trim() !== "" &&
                    comment !== "null" &&
                    comment !== "undefined" &&
                    feedback.userId !== user._id
                  );
                }
              )
              .map((comment) => (
                <View key={comment._id} className="flex flex-col mb-6 w-full">
                  {/* User Info */}
                  <View className="flex-row gap-4 mb-4">
                    <Image
                      source={
                        profileIcons[
                        comment?.userInfo?.profileIcon || "empty_profile"
                        ]
                      }
                      className="w-12 h-12 rounded-full"
                    />
                    <View className="mr-4">
                      <Text className="text-md font-semibold dark:text-text-dark">
                        {comment?.userInfo?.name || "Anonymous"}
                      </Text>
                      <Text className="text-sm text-gray-500">
                        {comment?.userInfo?.email || ""}
                      </Text>
                    </View>
                  </View>
                  {/* Comment Text */}
                  <View className="flex-row gap-4">
                    <Text
                      className={`text-lg ${comment.hidden
                          ? "text-gray-400"
                          : "text-black dark:text-white"
                        }`}
                    >
                      {comment?.hidden
                        ? "This comment was hidden by the admin due to inappropriate content"
                        : comment.comment}
                    </Text>
                  </View>
                  {/* Rating and Date */}
                  <View className="flex-row gap-4 mt-1">
                    <Text className="text-sm text-gray-700 dark:text-gray-200">
                      Rating: {comment.rating || "None"}
                    </Text>
                    <Text className="text-sm text-gray-700 dark:text-gray-200">
                      {new Date(comment.createdAt).toLocaleString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "numeric",
                        minute: "numeric",
                      })}
                    </Text>
                  </View>
                </View>
              ))}
          </View>
        )}
        <Modal
          visible={isDeleting} // control this with your loading state
          transparent={true}
          animationType="fade"
        >
          <View
            style={{
              flex: 1,
              backgroundColor: 'rgba(0,0,0,0.7)',
              justifyContent: 'center',
              alignItems: 'center',
            }}
            // prevent all touch interactions underneath
            pointerEvents="auto"
          >
            <View
              style={{
                padding: 24,
                borderRadius: 16,
                backgroundColor: '#fff',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ActivityIndicator size="large" color="#000" />
              <Text style={{ marginTop: 12, fontSize: 18, fontWeight: 'bold' }}>
                Deleting guide...
              </Text>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </View>
  );
}

export default Guide;