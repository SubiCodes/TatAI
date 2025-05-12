import { SafeAreaView, ScrollView, View, Image, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import React, { useState, useRef } from 'react';

import BotHeader from "@/components/chatbot-header";
import Entypo from '@expo/vector-icons/Entypo';
import chatBotLBlue from "@/assets/images/chat-bot/chatbot-lightblue.png";
import chatBotBlack from "@/assets/images/chat-bot/chatbot-black.png";

import userStore from "@/store/user.store";
import Constants from "expo-constants";
import axios from 'axios';

const INITIAL_MESSAGES = [
  { id: 1, text: "Hello, I'm TatAI!", sender: 'bot' },
  { id: 2, text: "Your intelligent home assistant designed to help you with home repairs, tool usage, DIY projects, and home repair management.", sender: 'bot' },
  { id: 3, text: "I'd love to get to know you and assist you with your home improvement needs.", sender: 'bot' }
];

const OPENAI_KEY =
  Constants.expoConfig?.extra?.OPENAI_KEY ?? Constants.manifest?.extra?.OPENAI_KEY;

const API_URL =
  Constants.expoConfig?.extra?.API_URL ?? Constants.manifest?.extra?.API_URL;

const ChatBot = () => {
  const preference = userStore((state) => state.preference);
  const user = userStore((state) => state.user);

  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [aiTyping, setAiTyping] = useState(false);
  const scrollViewRef = useRef();

  const handleSendMessage = async () => {
    try {
      if (inputText.trim() === '') return;

      setAiTyping(true);

      const initialMessage = `You are a bot named TatAi whose purpose is to teach home repairs and DIY home projects. Any question outside that, say that it is outside your scope. The user you're currently talking to prefers to be called "${preference?.preferredName}", is ${user?.gender}, has ${preference?.toolFamiliarity} tool familiarity, and is at a ${preference?.skillLevel} skill level.`;

      const newUserMessage = {
        id: messages.length + 1,
        text: inputText,
        sender: 'user',
      };

      const updatedMessages = [...messages, newUserMessage];
      setMessages(updatedMessages);
      setInputText('');

      const formattedMessages = [
        { role: 'system', content: initialMessage },
        ...updatedMessages.map((msg) => ({
          role: msg.sender === 'user' ? 'user' : 'assistant',
          content: msg.text,
        })),
      ];

      const response = await axios.post(`${API_URL}user/call-ai`, {
        messages: formattedMessages,
      });

      const aiReply = response.data.message.choices[0].message.content;

      console.log(response.data.message)

      const newBotMessage = {
        id: updatedMessages.length + 1,
        text:
          aiReply ||
          `I'm still under development, so I might not have the answer right now. Let’s check again later!`,
        sender: 'bot',
      };

      setMessages((prev) => [...prev, newBotMessage]);

      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    } catch (error) {
      console.log('Error:', error.response?.data || error.message);

      const fallbackBotMessage = {
        id: messages.length + 2,
        text: `Sorry, something went wrong. Let's try again later.`,
        sender: 'bot',
      };

      setMessages((prev) => [...prev, fallbackBotMessage]);
    } finally {
      setAiTyping(false); // 👈 Stop "typing" indicator
    }
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
              className="w-40 h-40"
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

          {/* Typing indicator */}
          {aiTyping && (
            <View className="self-start bg-gray-200 p-4 rounded-xl max-w-[80%]">
              <Text className="text-gray-600"><Entypo name="dots-three-horizontal" size={24} /></Text>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>

      <View className="w-full h-auto justify-center items-center flex-row gap-2 bg-transparent pb-24 px-4">
        <TextInput
          className="flex-1 h-12 rounded bg-gray-200 p-2"
          placeholder="Send a message..."
          value={inputText}
          onChangeText={setInputText}
          onSubmitEditing={handleSendMessage}
          editable={!aiTyping}
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