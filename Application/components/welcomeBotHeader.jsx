import { View, Text, Image } from 'react-native'
import HeaderContactUs from './header-contactus.jsx'
import React from 'react'
import chatbotImage from "@/assets/images/chat-bot/tatai-chatbot.png"

const WelcomeBotHeader = () => {
  return (
    <>
    <View className='w-screen py-4 bg-white flex-row items-center px-6 '>
      <View className='flex-row items-center gap-4 w-1/2'>
        <View className='w-12 h-12 rounded-full bg-gray-200 items-center justify-center'>
          <Image source={chatbotImage} className='max-w-12' resizeMode='contain'/>
        </View>
        <Text className='font-bold text-xl'>Tatai Bot</Text>
      </View>

      <View className='flex-row items-end justify-end gap-2 w-1/2'>
      <HeaderContactUs/>
      </View>
    </View>
    
    </>
    
  )
}

export default WelcomeBotHeader