import { View, Text, Image, Platform, TouchableOpacity, Alert } from 'react-native';
import React from 'react';
import { useNavigation, useRouter } from 'expo-router';

const CardRecentGuide = ({ guide }) => {
  const router = useRouter();

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

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.8}>
      <View
        className="w-80 min-h-34 bg-white flex flex-col rounded-xl overflow-hidden shadow-black dark:bg-[#2A2A2A]"
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
        <View className="w-full h-40 overflow-hidden flex items-center justify-center">
          <Image
            className="min-w-full min-h-full"
            source={{
              uri: guide?.coverImg?.url || 'https://via.placeholder.com/400x250',
            }}
            resizeMode="cover"
            style={{
              width: '100%',
              height: '100%',
              transform: [{ scale: 1 }],
            }}
          />
        </View>
        <View className="w-full px-2 py-4 flex flex-col">
          <Text className="text-2xl text-text font-semibold dark:text-text-dark" numberOfLines={1} ellipsizeMode="tail">
            {guide?.title || 'Guide Title'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default CardRecentGuide;