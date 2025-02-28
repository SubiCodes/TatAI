import { View, Text, Image, SafeAreaView } from 'react-native'
import React from 'react'

import splashImage from '../assets/images/splash-image.png'

const SplashScreen = () => {
  return (
    <SafeAreaView className='min-h-screen-safe w-screen items-center justify-center'>
      <Image source={splashImage} className='max-w-[80%] h-auto' resizeMode='contain'/>
    </SafeAreaView>
  )
}

export default SplashScreen