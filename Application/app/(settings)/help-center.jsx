import React, { useState, useEffect } from 'react';
import { Text, View, StatusBar, SafeAreaView, ScrollView } from 'react-native';
import { useColorScheme } from 'nativewind';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Accordion from 'react-native-collapsible/Accordion';
import Entypo from '@expo/vector-icons/Entypo';

const SECTIONS = [
  {
    title: 'What is TatAI, and how can it assist me in my daily tasks?',
    content: 'TatAI is an AI-powered virtual assistant designed to help you manage tasks and provide personalized assistance using Natural Language Processing (NLP) and Rule-Based Algorithms.',
  },
  {
    title: 'How do I set up and configure TatAI for my home?',
    content: (
      <View className="space-y-2">
        <Text className="text-base text-text dark:text-text-dark">• Install the TatAI app on your smartphone or smart device.</Text>
        <Text className="text-base text-text dark:text-text-dark">• Follow the on-screen instructions to connect it to your Wi-Fi network.</Text>
        <Text className="text-base text-text dark:text-text-dark">• Set up user preferences, voice recognition, and security settings.</Text>
      </View>
    ),
  },
  {
    title: 'Does TatAI require an internet connection to function?',
    content: 'Yes, TatAI needs an internet connection to process voice commands, fetch real-time information, and connect to cloud-based services.',
  },
  {
    title: 'How does TatAI use AI and rule-based algorithms to assist users?',
    content: 'TatAI combines NLP to understand and process voice commands with rule-based algorithms to execute predefined actions.',
  },
];

const SECTIONS2 = [
  {
    title: 'What types of voice commands does TatAI understand? ',
    content: (
        <View className="space-y-2">
            <Text className="text-base text-text dark:text-text-dark">• Repair Guides </Text>
            <Text className="text-base text-text dark:text-text-dark">• Tool Guides </Text>
            <Text className="text-base text-text dark:text-text-dark">• DIY Guides </Text>
        </View>
    ),
  },
  {
    title: `Can I customize TatAI's responses and behavior?`,
    content: 'Yes! You can set custom responses, define automation rules, and even teach TatAI how to handle specific tasks through the settings in the TatAI app.',
  },
  {
    title: `What should I do if TatAI doesn’t understand my command? `,
    content: (
        <View className="space-y-2">
            <Text className="text-base text-text dark:text-text-dark">• Try rephrasing your request in a clearer, simpler manner. </Text>
            <Text className="text-base text-text dark:text-text-dark">• Check your internet connection. </Text>
            <Text className="text-base text-text dark:text-text-dark">• Ensure your microphone is working properly. </Text>
            <Text className="text-base text-text dark:text-text-dark">• Update the TatAI software to the latest version. </Text>
        </View>
    ),
  },
];

const SECTIONS3 = [
  {
    title: `Is there a way to change TatAI’s voice or personality settings?`,
    content: 'Yes! You can switch between voice tones and adjust personality settings in the TatAI app.',
  },
];

const SECTIONS4 = [
  {
    title: `How does TatAI ensure the security of my personal data?`,
    content: 'TatAI uses end-to-end encryption and secure authentication methods to protect your data.',
  },
  {
    title: `What data does TatAI collect, and how is it used?`,
    content: 'TatAI collects only necessary data (e.g., voice commands, preferences) to improve user experience. It does not sell personal data.',
  },
  {
    title: `Can I disable voice recording or delete my data from TatAI?`,
    content: 'Yes! You can disable voice recording or delete stored data through the TatAI app settings.',
  },
  {
    title: `How do I prevent unauthorized access to my TatAI account?`,
    content: 'Use strong passwords. Enable multi-factor authentication (MFA).',
  },
  {
    title: `How do I prevent unauthorized access to my TatAI account?`,
    content: 'Use strong passwords. Enable multi-factor authentication (MFA).',
  },
];

const SECTIONS5 = [
  {
    title: `What should I do if TatAI is not responding?`,
    content: (        <View className="space-y-2">
            <Text className="text-base text-text dark:text-text-dark">• Check if TatAI is powered on. </Text>
            <Text className="text-base text-text dark:text-text-dark">• Ensure your microphone is working. </Text>
            <Text className="text-base text-text dark:text-text-dark">• Restart the TatAI app or device.</Text>
        </View>),
  },
    {
    title: `How can I reset or restart TatAI if it stops working?`,
    content: 'In the TatAI app, go to Settings > Device Management > Restart Device.',
  },
    {
    title: `Who do I contact for technical support?`,
    content: 'Reach out via TatAI’s support center in the app or email “tataihomeassistant@gmail.com”.',
  },
    {
    title: `Can I provide feedback or request new features for TatAI?`,
    content: 'Yes! Submit feedback through the TatAI app under "Help & Feedback" or email us directly.',
  },
];

const HelpCenter = () => {
  const { colorScheme, toggleColorScheme } = useColorScheme();
  const [activeSections1, setActiveSections1] = useState([]);
  const [activeSections2, setActiveSections2] = useState([]);
  const [activeSections3, setActiveSections3] = useState([]);
  const [activeSections4, setActiveSections4] = useState([]);
  const [activeSections5, setActiveSections5] = useState([]);

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const storedTheme = await AsyncStorage.getItem('theme');
        if (storedTheme && storedTheme !== colorScheme) {
          toggleColorScheme();
        }
      } catch (error) {
        console.error('Failed to load theme:', error);
      }
    };
    loadTheme();
  }, []);

  const _renderSectionTitle = () => <View style={{ padding: 10 }} />;

  const _renderHeader = (section, _, isActive) => (
    <View className="w-full flex-row gap-4 items-center py-3">
      <Text className="text-lg font-semibold w-4/5 text-text dark:text-text-dark">{section.title}</Text>
      <Entypo
        name={isActive ? 'chevron-small-up' : 'chevron-small-down'}
        size={24}
        color={colorScheme === 'dark' ? 'white' : 'black'}
      />
    </View>
  );

  const _renderContent = (section) => (
    <View className="pt-2 pb-4">
      {typeof section.content === 'string' ? (
        <Text className="text-text dark:text-text-dark">{section.content}</Text>
      ) : (
        section.content
      )}
    </View>
  );

  return (
    <>
      <StatusBar
        translucent={false}
        backgroundColor={colorScheme === 'dark' ? '#121212' : '#FAF9F6'}
        barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'}
      />
      <SafeAreaView className="min-w-screen min-h-screen bg-background dark:bg-background-dark">
        <ScrollView
          contentContainerStyle={{ paddingHorizontal: 32, paddingTop: 96, paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Section 1 */}
          <View className="w-full flex-row gap-4 mb-4">
            <Text className="text-3xl font-bold text-text dark:text-text-dark">General Questions</Text>
          </View>
          <Accordion
            sections={SECTIONS}
            activeSections={activeSections1}
            renderSectionTitle={_renderSectionTitle}
            renderHeader={_renderHeader}
            renderContent={_renderContent}
            onChange={setActiveSections1}
            underlayColor="transparent"
          />

          {/* Section 2 */}
          <View className="w-full flex-row gap-4 mt-8 mb-4">
            <Text className="text-3xl font-bold text-text dark:text-text-dark">Voice Commands & Interaction</Text>
          </View>
          <Accordion
            sections={SECTIONS2}
            activeSections={activeSections2}
            renderSectionTitle={_renderSectionTitle}
            renderHeader={_renderHeader}
            renderContent={_renderContent}
            onChange={setActiveSections2}
            underlayColor="transparent"
          />

          <View className="w-full flex-row gap-4 mt-8 mb-4">
            <Text className="text-3xl font-bold text-text dark:text-text-dark">Personalization & Customization </Text>
          </View>
          <Accordion
            sections={SECTIONS3}
            activeSections={activeSections3}
            renderSectionTitle={_renderSectionTitle}
            renderHeader={_renderHeader}
            renderContent={_renderContent}
            onChange={setActiveSections3}
            underlayColor="transparent"
          />

          <View className="w-full flex-row gap-4 mt-8 mb-4">
            <Text className="text-3xl font-bold text-text dark:text-text-dark">Security & Privacy </Text>
          </View>
          <Accordion
            sections={SECTIONS4}
            activeSections={activeSections4}
            renderSectionTitle={_renderSectionTitle}
            renderHeader={_renderHeader}
            renderContent={_renderContent}
            onChange={setActiveSections4}
            underlayColor="transparent"
          />

          <View className="w-full flex-row gap-4 mt-8 mb-4">
            <Text className="text-3xl font-bold text-text dark:text-text-dark">Troubleshooting & Support </Text>
          </View>
          <Accordion
            sections={SECTIONS5}
            activeSections={activeSections5}
            renderSectionTitle={_renderSectionTitle}
            renderHeader={_renderHeader}
            renderContent={_renderContent}
            onChange={setActiveSections5}
            underlayColor="transparent"
          />
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default HelpCenter;
