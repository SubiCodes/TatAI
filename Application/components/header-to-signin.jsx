import { View, Text } from 'react-native'
import { router } from 'expo-router'
import React from 'react'
import Ionicons from '@expo/vector-icons/Ionicons';

const HeaderToSignIn = () => {
  return (
    <View>
      <Text onPress={() => router.replace('/(auth-screens)/signin')}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </Text>
    </View>
  )
}

export default HeaderToSignIn