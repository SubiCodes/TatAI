import { View, Text, Image, TouchableOpacity } from "react-native";
import React, { useRef } from "react";
import { useColorScheme } from 'nativewind';

import Entypo from '@expo/vector-icons/Entypo';
import RBSheet from "react-native-raw-bottom-sheet";

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
import { useRouter } from "expo-router";

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

const CardUser = ({user}) => {
    const actionSheet = useRef();
    const { colorScheme, toggleColorScheme } = useColorScheme();
    const router = useRouter();

     const handleViewUser = () => {
        if (user?._id) {
          router.push(`/user/${user?._id}`);
        } else {
          Alert.alert(
            "User not found",
            "This user might have been banned or deleted.",
            [{ text: "OK" }]
          );
        }
      };
  return (
    <>
      <RBSheet
        ref={actionSheet}
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
            maxHeight: 140, // Maximum constraint to prevent taking up the entire screen
          },
          draggableIcon: {
            backgroundColor: colorScheme === "dark" ? "#A0A0A0" : "#000",
            width: 60,
          },
        }}
      >
        <View className="py-4 gap-4">
          <TouchableOpacity className="w-full bg-primary dark:bg-secondary py-3 rounded-xl shadow-sm active:opacity-80" onPress={() => handleViewUser()}>
            <Text className="text-center text-white text-lg font-semibold">
              View
            </Text>
          </TouchableOpacity>
          <TouchableOpacity className="w-full bg-red-500 dark:bg-red-600 py-3 rounded-xl shadow-sm active:opacity-80">
            <Text className="text-center text-white text-lg font-semibold">
              Report User
            </Text>
          </TouchableOpacity>
        </View>
      </RBSheet>
      <TouchableOpacity onPress={() => handleViewUser()}>
        <View className="w-full py-4 px-4 pr-6 gap-6 bg-white flex flex-row items-center rounded-xl overflow-hidden shadow-lg shadow-black dark:bg-[#2A2A2A]">
          <View className="items-center justify-center">
            <Image
              source={
                profileIcons[user?.profileIcon] || profileIcons.empty_profile
              }
              className="w-8 h-8 rounded-full"
            />
          </View>
          <View className="flex-1 flex-col justify-center">
            <Text
              className="text-xl font-semibold text-text dark:text-text-dark"
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {`${user?.firstName} ${user?.lastName}`}
            </Text>
            <View className="flex-row items-center gap-2">
              <Text className="font-light text-text dark:text-text-dark">{user?.status}</Text>
              <View
                className={`w-2 h-2 rounded-full ${
                  user?.status === "Verified" ? "bg-green-400" : user?.status === "Unverified" ? "bg-gray-400" : "bg-red-400"}`}                
              />
            </View>
          </View>
          <View className="w-auto items-center justify-center flex-row">
            <TouchableOpacity
              className="z-50"
              onPress={() => actionSheet?.current.open()}
            >
              <Text className="text-gray-600 dark:text-gray-400">
                <Entypo name="dots-three-vertical" size={24} />
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </>
  );
};

export default CardUser;
