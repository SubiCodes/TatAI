import { View, Text, SafeAreaView, TextInput, TouchableOpacity, ScrollView, Alert, StatusBar } from 'react-native'
import WelcomeBotHeader from '@/components/welcomeBotHeader.jsx';
import { API_URL } from '@/constants/links';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode'
import { useEffect, useRef, useState } from 'react';
import { useNavigation, useRouter } from 'expo-router';
import React from 'react'

import FontAwesome from '@expo/vector-icons/FontAwesome';
import axios from 'axios';

const AskName = () => {
    const navigation = useNavigation();
    const router = useRouter();
    const scrollViewRef = useRef();

    const removeHeader = () => {
        navigation.setOptions({
            title: "Customize Your Experience",
            headerShown: false,
        });
    }

    const [userID, setUserID] = useState();
    const [waitingForResponse, setWaitingForResponse] = useState(false);
    const [messages, setMessages] = useState([]);
    const [typedMessage, setTypedMessage] = useState("");
    const [lastUserMessage, setLastUserMessage] = useState("");
    const [botResponseCount, setBotResponseCount] = useState(0);
    const [replySuggestion, setReplySuggestion] = useState();
    const [showReplySuggestion, setShowReplySuggestion] = useState(false);
    const nameSuggestions = ["Son", "Daughter", "Sweetie", "Buddy"];
    const [showNameSuggestion, setShowNameSuggestion] = useState(false);

    const getID = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            if (token) {
                const decodedToken = jwtDecode(token);
                setUserID(decodedToken.userID);
                console.log("User ID:", decodedToken.userID);
            }
        } catch (error) {
            console.log(error.message);
        }
    };

    const updatePreference = async () => {
        if (!userID) {
            console.log("User ID not set, skipping update.");
            return;
        }

        try {
            const res = await axios.put(
                `${API_URL}/api/v1/user/${userID}`,
                { preferredName: lastUserMessage },
                { validateStatus: (status) => status < 500 }
            );

            if (!res.data.success) {
                console.log("API Error:", res.data.message);
            } else {
                console.log("Preference Updated:", res.data.message);
            }
        } catch (error) {
            Alert.alert("API Error", "An error occurred while updating your preference. You can change it in your profile page.");
            router.replace('/(tabs)/home');
            console.error("API Error:", error.response ? error.response.data.message : error.message);
        }
    }

    const loadInitialMessages = async () => {
        setMessages([]);
        setWaitingForResponse(true);

        const botResponses = [
            "Hello I'm TatAi. ",
            "Your intelligent home assistant designed to help you with home repairs, tool usage, DIY projects, and home repair management.",
            "What would you like me to call you?"
        ];

        botResponses.forEach((response, index) => {
            setTimeout(() => {
                setMessages((prevMessages) => [
                    ...prevMessages,
                    { message: response, sender: "bot" }
                ]);

                if (index === botResponses.length - 1) {
                    setShowNameSuggestion(true)
                }
            }, 1000 * index);
        });

        setTimeout(() => {
            setWaitingForResponse(false);
            setLastUserMessage("");
        }, 1000 * botResponses.length);
    }

    const handleSendMessage = async () => {
        setShowNameSuggestion(false);
        setShowReplySuggestion(false);
        if (typedMessage.trim()) {
            setWaitingForResponse(true);

            setMessages((prevMessages) => [
                ...prevMessages,
                { message: typedMessage, sender: "user" }
            ]);

            setLastUserMessage(typedMessage);
            setTypedMessage("");
        }
    };

    const handleSendSuggestedName = async (name) => {
        setWaitingForResponse(true);

        setMessages((prevMessages) => [
            ...prevMessages,
            { message: name, sender: "user" }
        ]);
        setLastUserMessage(name);
        setShowNameSuggestion(false);
    }

    const handleSendSuggestedMessage = async () => {
        setWaitingForResponse(true);
        setShowNameSuggestion(false);
        setShowReplySuggestion(false);

        setMessages((prevMessages) => [
            ...prevMessages,
            { message: replySuggestion, sender: "user" }
        ]);

        setLastUserMessage(replySuggestion);
        setTypedMessage("");
    }

    useEffect(() => {
        if (lastUserMessage && waitingForResponse) {
            if (botResponseCount === 0) {
                setBotResponseCount(1); // lock this block

                const botResponses = [
                    `Lovely to meet you, ${lastUserMessage}!`,
                    "A few things to keep in mind...",
                    "While I strive to provide clear and reliable guidance, always prioritize safety precautions and expert advice for complex repairs.",
                    "I offer predefined fix-it guides, diagnostics, and tool suggestions based on your queries, but I won’t physically perform repairs.",
                    "I improve over time, but my responses are based on trained data and predefined rules — I won’t browse the internet for live updates."
                ];

                botResponses.forEach((response, index) => {
                    setTimeout(() => {
                        setMessages((prevMessages) => [
                            ...prevMessages,
                            { message: response, sender: "bot" }
                        ]);

                        if (index === botResponses.length - 1) {
                            setReplySuggestion("I acknowledge that message.");
                            setShowReplySuggestion(true);
                        }
                    }, 1000 * index);
                });

                setTimeout(async () => {
                    await updatePreference();
                    setWaitingForResponse(false);
                    setLastUserMessage("");
                }, 1000 * botResponses.length);
            }

            else if (botResponseCount === 1) {
                setBotResponseCount(2); // lock this block

                const botResponses = [
                    "TatAI's features, functionality, and guidelines may evolve over time as we continue to improve the system. ",
                    "While I strive to provide accurate and helpful guidance, please verify information independently before making decisions."
                ];

                botResponses.forEach((response, index) => {
                    setTimeout(() => {
                        setMessages((prevMessages) => [
                            ...prevMessages,
                            { message: response, sender: "bot" }
                        ]);

                        if (index === botResponses.length - 1) {
                            setReplySuggestion("Sounds good! Let's begin.");
                            setShowReplySuggestion(true);
                        }
                    }, 1000 * index);
                });

                setTimeout(() => {
                    setWaitingForResponse(false);
                    setLastUserMessage("");
                }, 1000 * botResponses.length);
            }

            else if (botResponseCount === 2) {
                setBotResponseCount(3); // prevent rerun
                setTimeout(() => {
                    router.replace('/(tabs)/home');
                }, 1000);
            }
        }
    }, [lastUserMessage, waitingForResponse]);

    useEffect(() => {
        if (scrollViewRef.current) {
            scrollViewRef.current.scrollToEnd({ animated: true });
        }
    }, [messages]);

    useEffect(() => {
        getID();
        removeHeader();
        loadInitialMessages();
    }, []);

    return (
        <SafeAreaView className='w-screen h-screen flex items-center gap-4'>
            <WelcomeBotHeader />

            <ScrollView className='w-full h-screen flex-col border-0 pt-0 px-4' contentContainerStyle={{ gap: 12 }} ref={scrollViewRef}>
                <StatusBar translucent={true} backgroundColor={'#FAF9F6'} />
                <View className='w-40 h-40 justify-center items-center rounded-full bg-gray-200 self-center mb-8'></View>

                {messages.map((msg, index) => (
                    <View
                        key={index}
                        className={`w-auto h-auto justify-center p-4 rounded-xl ${msg.sender === "bot" ? "self-start bg-gray-200" : "self-end bg-blue-200"}`}
                    >
                        <Text>{msg.message}</Text>
                    </View>
                ))}

                {waitingForResponse && (
                    <View className="w-auto h-auto justify-center flex-row gap-2 p-4 rounded-xl self-start bg-gray-200">
                        <View className='w-2 h-2 rounded-full bg-gray-400' />
                        <View className='w-2 h-2 rounded-full bg-gray-400' />
                        <View className='w-2 h-2 rounded-full bg-gray-400' />
                    </View>
                )}

                {showNameSuggestion && (
                    <View className='w-full h-auto flex-wrap flex-row justify-center gap-2 p-2 rounded-3xl self-center mt-4'>
                        {nameSuggestions.map((name, index) => (
                            <TouchableOpacity key={index} className='w-auto h-auto justify-center p-4 rounded-3xl self-center bg-blue-200 mt-4' onPress={() => handleSendSuggestedName(name)}>
                                <Text className='text-black text-base'>{name}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}

                {showReplySuggestion && (
                    <TouchableOpacity className='w-auto h-auto justify-center p-4 rounded-3xl self-center bg-blue-200 mt-4' onPress={handleSendSuggestedMessage}>
                        <Text className='text-black text-base'>{replySuggestion}</Text>
                    </TouchableOpacity>
                )}
            </ScrollView>

            <View className='w-full h-auto justify-center items-center flex-row gap-2 pb-0 bg-transparent'>
                <TextInput className='w-72 h-12 rounded bg-gray-200 p-2' placeholder='Send a message...' value={typedMessage} onChangeText={setTypedMessage} editable={!waitingForResponse} />
                <TouchableOpacity className='w-12 h-12 rounded bg-secondary items-center justify-center' onPress={handleSendMessage} disabled={waitingForResponse}>
                    <FontAwesome name="send" size={24} color="white" />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default AskName;
