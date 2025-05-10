import { SafeAreaView, ScrollView, View, Image, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import React, { useState, useRef } from 'react';

import BotHeader from "@/components/chatbot-header";
import chatBotLBlue from "@/assets/images/chat-bot/chatbot-lightblue.png";
import chatBotBlack from "@/assets/images/chat-bot/chatbot-black.png";

const INITIAL_MESSAGES = [
  { id: 1, text: "Hello, I'm TatAI!", sender: 'bot' },
  { id: 2, text: "Your intelligent home assistant designed to help you with home repairs, tool usage, DIY projects, and home repair management.", sender: 'bot' },
  { id: 3, text: "I'd love to get to know you and assist you with your home improvement needs.", sender: 'bot' }
];

const ChatBot = () => {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');
  const scrollViewRef = useRef();

  const handleSendMessage = () => {
    if (inputText.trim() === '') return;
    
    // Add user message
    const newUserMessage = {
      id: messages.length + 1,
      text: inputText,
      sender: 'user'
    };
    
    // Add bot response
    const newBotMessage = {
      id: messages.length + 2,
      text: `I'm still under development, so I might not have the answer right now. Let’s check again later!`,
      sender: 'bot'
    };
    
    setMessages([...messages, newUserMessage, newBotMessage]);
    setInputText('');
    
    // Scroll to bottom after adding new messages
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const handleClearChat = () => {
    // Reset to initial welcome messages
    setMessages(INITIAL_MESSAGES);
  };

  return (
    <SafeAreaView className="w-screen h-screen flex items-center gap-4 bg-background dark:bg-background-dark">
      <BotHeader onClearChat={handleClearChat} />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1 w-full"
        keyboardVerticalOffset={100}
      >
        <ScrollView
          ref={scrollViewRef}
          className="w-full flex-col border-0 pt-0 px-4"
          contentContainerStyle={{ gap: 12, paddingBottom: 40 }}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        >
          <View className="w-40 h-40 justify-center items-center rounded-full self-center">
            <Image
              source={chatBotLBlue}
              className="w-52 h-52"
              resizeMode="contain"
            />
          </View>

          {/* Dynamic message list */}
          {messages.map((message) => (
            <View 
              key={message.id} 
              className={`${message.sender === 'user' ? 'self-end bg-secondary' : 'self-start bg-gray-200'} p-4 rounded-xl max-w-[80%]`}
            >
              <Text className={message.sender === 'user' ? 'text-white' : 'text-black'}>
                {message.text}
              </Text>
            </View>
          ))}
        </ScrollView>
      </KeyboardAvoidingView>

      <View className="w-full h-auto justify-center items-center flex-row gap-2 bg-transparent pb-24 px-4">
        <TextInput
          className="flex-1 h-12 rounded bg-gray-200 p-2"
          placeholder="Send a message..."
          value={inputText}
          onChangeText={setInputText}
          onSubmitEditing={handleSendMessage}
        />
        <TouchableOpacity 
          className="w-12 h-12 rounded bg-secondary items-center justify-center"
          onPress={handleSendMessage}
        >
          <FontAwesome name="send" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ChatBot;