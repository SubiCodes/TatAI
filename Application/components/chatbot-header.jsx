import { View, Text, Image, TouchableOpacity, Alert } from 'react-native'
import HeaderContactUs from './header-contactus.jsx'
import React from 'react'
import chatbotImage from "@/assets/images/chat-bot/tatai-chatbot.png"
import chatBotBlack from "@/assets/images/chat-bot/chatbot-black.png";
import { MaterialIcons } from '@expo/vector-icons';

const BotHeader = ({ onClearChat }) => {
  const handleClearPress = () => {
    Alert.alert(
      "Clear Chat",
      "Are you sure you want to clear all messages?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "Clear", 
          onPress: () => {
            if (onClearChat) onClearChat();
          },
          style: "destructive"
        }
      ],
      { cancelable: true }
    );
  };

  return (
    <>
    <View className='w-screen py-4 bg-white flex-row items-center px-6 dark:bg-[#2A2A2A] '>
      <View className='flex-row items-center gap-4 w-1/2'>
        <View className='w-12 h-12 rounded-full bg-gray-200 items-center justify-center '>
          <Image source={chatBotBlack} className='max-w-12' resizeMode='contain'/>
        </View>
        <Text className='font-bold text-xl text-text dark:text-text-dark'>TatAI Bot</Text>
      </View>

      <View className='flex-row items-end justify-end gap-2 w-1/2'>
        <TouchableOpacity 
          onPress={handleClearPress}
          className="px-3 py-2 rounded-lg flex-row items-cente"
        >
          <MaterialIcons name="delete-outline" size={32} color="#FF3B30" />
        </TouchableOpacity>
      </View>
    </View>
    
    </>
  )
}

export default BotHeader