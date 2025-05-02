import { View, Text, Image, Platform } from 'react-native';
import React from 'react';

const CardRecentGuide = ({guide}) => {
  return (
    <View
      className="w-80 min-h-34 bg-white flex flex-col rounded-xl overflow-hidden shadow-black"
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
            transform: [{ scale: 1 }]
          }}
        />
      </View>
      <View className="w-full px-2 py-4 flex flex-col">
        <Text className="text-2xl text-text font-semibold">{guide?.title || 'Guide Title'}</Text>
      </View>
    </View>
  );
};

export default CardRecentGuide;