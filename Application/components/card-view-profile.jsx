import {
  View,
  Text,
  Image,
  Platform,
  TouchableOpacity,
  Alert,
} from "react-native";
import React from "react";
import { useRouter } from "expo-router";

import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';


const CardViewProfile = ({ guide }) => {
  const router = useRouter();

  const handlePress = () => {
    if (guide?._id) {
      router.push(`/guide/${guide._id}`);
    } else {
      Alert.alert(
        "Guide Not Found",
        "This guide may have been deleted or its link is no longer valid.",
        [{ text: "OK" }]
      );
    }
  };

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.8}>
      <View
        className="w-8/9 min-h-34 h-auto bg-white flex flex-col rounded-xl overflow-hidden shadow-black dark:bg-[#2A2A2A]"
        style={
          Platform.OS === "android"
            ? { elevation: 6 }
            : {
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.2,
                shadowRadius: 6,
              }
        }
      >
        <View className="w-full h-44 overflow-hidden flex items-center justify-center">
          <Image
            className="min-w-full min-h-full"
            source={{
              uri:
                guide?.coverImg?.url || "https://via.placeholder.com/400x250",
            }}
            resizeMode="cover"
            style={{
              width: "100%",
              height: "100%",
              transform: [{ scale: 1 }],
            }}
          />
        </View>
        <View className="w-full min-w-full flex flex-row px-4">
          <View className="flex-1 flex-wrap px-2 py-4 items-center">
            <Text
              className="text-2xl text-text font-semibold dark:text-text-dark"
              numberOfLines={2}
            >
              {guide?.title || "Guide title fallback"}
            </Text>
          </View>
          <View className='flex-row items-center justify-end gap-3'>
                          {/* Rating */}
                          <View className='flex-row items-center gap-1'>
                              <Text className='dark:text-text-dark'>
                                  <AntDesign name="star" size={20}/>
                              </Text>
                              <Text className="text-sm text-gray-400 font-semibold">
                                  {guide.feedbackInfo.averageRating}
                              </Text>
                          </View>
                          
                          {/* Comments */}
                          <View className='flex-row items-center gap-1'>
                              <Text className='dark:text-text-dark'>
                                  <MaterialCommunityIcons name="comment-text-outline" size={20}/>
                              </Text>
                              <Text className="text-sm text-gray-400 font-semibold">
                                  {guide.feedbackInfo.commentCount}
                              </Text>
                          </View>
                      </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default CardViewProfile;
