import React, { useEffect, useRef } from 'react';
import { View, Text} from 'react-native';

import Octicons from '@expo/vector-icons/Octicons';

const Toast = ({ index, message }) => {
  return (
    <View className='flex-row gap-2 px-2 items-center justify-start rounded-lg min-h-12 border-2 border-red-600 bg-white' 
    style={{
        width: '94%',
        position: 'absolute',
        bottom: 20 + index * 60,  // Stack effect: 70px spacing between toasts
        alignSelf: 'center',
        zIndex: 999 - index,      // Ensure the topmost is the most recent
      }}>
        <View className='w-8 items-center justify-center'>
            <Text><Octicons name="x-circle-fill" size={18} color="red"/></Text>
        </View>
        <Text className='text-base font-bold text-black flex-1 flex-wrap'>{message}</Text>
    </View>
  );
};

export default Toast;
