import { View, Text, Image, Platform, TouchableOpacity } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { useFocusEffect, useRouter } from 'expo-router';

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

import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Fontisto from '@expo/vector-icons/Fontisto';

import guideStore from "@/store/guide.store";
import userStore from '@/store/user.store';

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

const CardRecentGuidePerTypeVertical = ({guide}) => {

      const router = useRouter();

      const [bookmark, setBookmark] = useState();

      const user = userStore((state) => state.user);
      const isBookmarked = guideStore((state) => state.isBookmarked);
      const checkIfBookmarked = guideStore((state) => state.checkIfBookmarked);
      const handleBookmark = guideStore((state) => state.handleBookmark);
    
      const handlePress = () => {
        if (guide?._id) {
          router.push(`/guide/${guide._id}`);
        } 
        else {
          Alert.alert(
            'Guide Not Found',
            'This guide may have been deleted or its link is no longer valid.',
            [{ text: 'OK' }]
          );
        }
      };

      const handleBookmarking = async () => {
        setBookmark(!bookmark)
        await handleBookmark(guide?._id, user._id);
      };

      const fetchBookmarkStatus = async () => {
        const status = await checkIfBookmarked(guide?._id, user?._id);
        setBookmark(status);
      };

      useFocusEffect(
        useCallback(() => {
            fetchBookmarkStatus();
      }, []))

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.8}>
   <View
        className="w-8/9 min-h-34 h-auto bg-white flex flex-col rounded-xl overflow-hidden shadow-black dark:bg-[#2A2A2A]"
        style={
        Platform.OS === 'android'
            ? { elevation: 6 }
            : {
                shadowColor: '#000',
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
               uri: guide?.coverImg?.url || 'https://via.placeholder.com/400x250',
             }}
             resizeMode="cover"
             style={{
               width: '100%',
               height: '100%', 
               transform: [{ scale: 1 }]
             }}
           />
        </View>
        <View className="w-full min-w-full flex flex-col border-b-[1px] border-gray-200">
            <View className="px-2 py-4">
                <Text className="text-2xl text-text font-semibold dark:text-text-dark" numberOfLines={2}>
                {guide?.title || 'Guide title fallback'}
                </Text>
            </View>
        </View>
        <View className="w-full px-2 py-3 pr-4 flex flex-row">
            <View className='flex-1 flex-row gap-2 items-center justify-start'>
                <View className='w-6 h-6 rounded-full'>
                    <Image source={profileIcons[guide.posterInfo.profileIcon]} className='max-w-full h-full rounded-full'/>
                </View>
                <Text className="text-md text-gray-400 font-semibold flex-1"
                    numberOfLines={1}
                    ellipsizeMode="tail">{!guide ? 'sample username': `${guide.posterInfo.name}`}
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

                {/* Bookmark */}
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
            </View>
           
        </View>
    </View>
    </TouchableOpacity>
  )
}

export default CardRecentGuidePerTypeVertical