import { View, Text, SafeAreaView, StatusBar, FlatList, Dimensions, StyleSheet, TouchableOpacity, ScrollView, TextInput, Alert, Image, ActivityIndicator } from 'react-native'
import React, { useCallback, useRef, useState } from 'react'
import { useFocusEffect, useNavigation, useRouter } from 'expo-router'
import Constants from 'expo-constants';
import axios from 'axios';

const API_URL =
  Constants.expoConfig?.extra?.API_URL ?? Constants.manifest?.extra?.API_URL;


import illustration from '@/assets/images/illustrations/preference_illustration.png'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';

const {width, height} = Dimensions.get('window');

const Personalization = () => {

    const navigation = useNavigation();
    const router = useRouter();
    const [userID, setUserID] = useState();
    const [loading, setLoading] = useState(true);

    const removeHeader = () => {
        navigation.setOptions({
            title: "Customize Your Experience", // Change header title
            headerShown: false, // Ensure the header is visible
        });
    }

    const checkPreferenceExist = async () => {
        setLoading(true);
        try {
            const token = await AsyncStorage.getItem('token');
            if(!token){
                await router.replace('/(auth-screens)/signin');
                return;
            }
            const decodedToken = await jwtDecode(token);
            setUserID(decodedToken.userID);
            const preference = await axios.get(`${API_URL}preference/${decodedToken.userID}`, 
                { 
                  validateStatus: (status) => status < 500,
                }
              );
            if (preference.data.success){
                await router.replace('/(tabs)/home');
                return;
            }
            setLoading(false);
        } catch (error) {
            Alert.alert("Oops⚠️", "Error loading preference of your account");
            console.log(error.message);
            setLoading(false);
        }
    }

    useFocusEffect(
        useCallback(() => {
            removeHeader();
            checkPreferenceExist();
        }, [])
    )

    const ref = useRef(null);

    

    const [preferredNameToBeCalled, setPreferredNameToBeCalled] = useState('');

    const preferredName = () => {

        const [preferredNameToBeCalledTemp, setPreferredNameToBeCalledTemp] = useState('');
        const updatePreference = () => {
            if (preferredNameToBeCalledTemp.trim() === ''){
                Alert.alert("Oops⚠️", "Field cannot be empty. Fill them up before proceeding!", [
                    {text: 'OK'}
                ]);
                return;
            }
            setPreferredNameToBeCalled(preferredNameToBeCalledTemp);
            goNextPage();
        }

        return(
            <>
                <ScrollView contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 24, paddingVertical: 20, paddingBottom: 24 }}
                    style={{ width: width, height: height}}>
                    <View className='w-[80%] flex-col gap-4'>
                        <Text className='font-extrabold text-wrap text-4xl'>Personalize your Experience</Text>
                        <Text className='font-regular text-base'>What would you like TatAi to call you?</Text>
                    </View>
                    <View className='w-full items-center justify-center' style={{height: '40%'}}>
                        <TextInput value={preferredNameToBeCalledTemp} onChangeText={(text) => setPreferredNameToBeCalledTemp(text)} placeholder='TatAi will call you...' 
                        className='w-full h-auto border-b-2 border-b-gray-400 text-xl '/>
                    </View>
                    <View style={{ flex: 1 }} />
                    <TouchableOpacity className='w-full h-12 rounded items-center justify-center bg-primary' onPress={updatePreference}>
                        <Text className='font-bold text-xl text-white'>Next</Text>
                    </TouchableOpacity>
                </ScrollView>
            </>
        )
    }

    const [preferredToneToBeUsed, setPreferredToneToBeUsed] = useState('');

    const preferredTone = () => {
        const [preferredToneToBeUsedTemp, setPreferredToneToBeUsedTemp] = useState(''); 
        const updatePreference = () => {
            if (preferredToneToBeUsedTemp.trim() === ''){
                Alert.alert("Oops⚠️", "Field cannot be empty. Fill them up before proceeding!", [
                    {text: 'OK'}
                ]);
                return;
            }
            setPreferredToneToBeUsed(preferredToneToBeUsedTemp);
            goNextPage();
        }
        return(
            <>
               <ScrollView contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 24, paddingVertical: 20, paddingBottom: 24, gap: 12 }}
                    style={{ width: width, height: height}}>
                    <View className='w-[80%] flex-col gap-4'>
                        <Text className='font-extrabold text-wrap text-4xl'>Personalize your Experience</Text>
                        <Text className='font-regular text-base'>What kind of tone would you like TatAi to use when speaking?</Text>
                    </View>
                    <View className='w-full h-auto gap-2 pt-4'>
                        <TouchableOpacity className='w-full h-12 px-8 items-center flex-row bg-btnWhite shadow-lg rounded-lg' 
                        onPress={() => setPreferredToneToBeUsedTemp('formal')} style={{backgroundColor: preferredToneToBeUsedTemp === 'formal' ? "#e7f6fe" : "#F8F8FF"}}>
                            <Text className='font-semibold text-lg text-black'>Formal Tone</Text>
                            {preferredToneToBeUsedTemp === 'formal' ? <Text className='text-lg ml-auto text-secondary'>✔</Text> : null}
                        </TouchableOpacity>
                        <TouchableOpacity className='w-full h-12 px-8 items-center flex-row bg-btnWhite shadow-lg rounded-lg' 
                        onPress={() => setPreferredToneToBeUsedTemp('casual')} style={{backgroundColor: preferredToneToBeUsedTemp === 'casual' ? "#e7f6fe" : "#F8F8FF"}}>
                            <Text className='font-semibold text-lg text-black'>Casual Tone</Text>
                            {preferredToneToBeUsedTemp === 'casual' ? <Text className='text-lg ml-auto text-secondary'>✔</Text> : null}
                        </TouchableOpacity>
                        <TouchableOpacity className='w-full h-12 px-8 items-center flex-row bg-btnWhite shadow-lg rounded-lg' 
                        onPress={() => setPreferredToneToBeUsedTemp('soft spoken')} style={{backgroundColor: preferredToneToBeUsedTemp === 'soft spoken' ? "#e7f6fe" : "#F8F8FF"}}>
                            <Text className='font-semibold text-lg text-black'>Soft Spoken Tone</Text>
                            {preferredToneToBeUsedTemp === 'soft spoken' ? <Text className='text-lg ml-auto text-secondary'>✔</Text> : null}
                        </TouchableOpacity>
                        <TouchableOpacity className='w-full h-12 px-8 items-center flex-row bg-btnWhite shadow-lg rounded-lg' 
                        onPress={() => setPreferredToneToBeUsedTemp('strict')} style={{backgroundColor: preferredToneToBeUsedTemp === 'strict' ? "#e7f6fe" : "#F8F8FF"}}>
                            <Text className='font-semibold text-lg text-black'>Strict Tone</Text>
                            {preferredToneToBeUsedTemp === 'strict' ? <Text className='text-lg ml-auto text-secondary'>✔</Text> : null}
                        </TouchableOpacity>
                    </View>
                    <View style={{ flex: 1 }} />
                    <TouchableOpacity className='w-full h-12 rounded items-center justify-center bg-primary' onPress={updatePreference}>
                        <Text className='font-bold text-xl text-white'>Next</Text>
                    </TouchableOpacity>
                </ScrollView>
            </>
        )
    }

    const [toolKnowledgeLevel, setToolKnowledgeLevel] = useState('');

    const toolFamiliarity = () => {

        const [toolKnowledgeLevelTemp, setToolKnowledgeLevelTemp] = useState('');
        const updatePreference = () => {
            if (toolKnowledgeLevelTemp.trim() === ''){
                Alert.alert("Oops⚠️", "Field cannot be empty. Fill them up before proceeding!", [
                    {text: 'OK'}
                ]);
                return;
            }
            setToolKnowledgeLevel(toolKnowledgeLevelTemp);
            goNextPage();
        }

        return(
            <>
                <ScrollView contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 24, paddingVertical: 20, paddingBottom: 24, gap: 12 }}
                    style={{ width: width, height: height}}>
                    <View className='w-[80%] flex-col gap-4'>
                        <Text className='font-extrabold text-wrap text-4xl'>Personalize your Experience</Text>
                        <Text className='font-regular text-base'>How would you rate your knowledge and skill in selecting and using various tools?</Text>
                    </View>
                    <View className='w-full h-auto gap-2 pt-4'>
                        <TouchableOpacity className='w-full h-12 px-8 items-center flex-row bg-btnWhite shadow-lg rounded-lg' 
                        onPress={() => setToolKnowledgeLevelTemp('unfamiliar')} style={{backgroundColor: toolKnowledgeLevelTemp === 'unfamiliar' ? "#e7f6fe" : "#F8F8FF"}}>
                            <Text className='font-semibold text-lg text-black'>Unfamiliar</Text>
                            {toolKnowledgeLevelTemp === 'unfamiliar' ? <Text className='text-lg ml-auto text-secondary'>✔</Text> : null}
                        </TouchableOpacity>
                        <TouchableOpacity className='w-full h-12 px-8 items-center flex-row bg-btnWhite shadow-lg rounded-lg' 
                        onPress={() => setToolKnowledgeLevelTemp('recognizes basics')} style={{backgroundColor: toolKnowledgeLevelTemp === 'recognizes basics' ? "#e7f6fe" : "#F8F8FF"}}>
                            <Text className='font-semibold text-lg text-black'>Recognizes Basics</Text>
                            {toolKnowledgeLevelTemp === 'recognizes basics' ? <Text className='text-lg ml-auto text-secondary'>✔</Text> : null}
                        </TouchableOpacity>
                        <TouchableOpacity className='w-full h-12 px-8 items-center flex-row bg-btnWhite shadow-lg rounded-lg' 
                        onPress={() => setToolKnowledgeLevelTemp('functionally knowledgeable')} style={{backgroundColor: toolKnowledgeLevelTemp === 'functionally knowledgeable' ? "#e7f6fe" : "#F8F8FF"}}>
                            <Text className='font-semibold text-lg text-black'>Functionally Knowledgeable</Text>
                            {toolKnowledgeLevelTemp === 'functionally knowledgeable' ? <Text className='text-lg ml-auto text-secondary'>✔</Text> : null}
                        </TouchableOpacity>
                        <TouchableOpacity className='w-full h-12 px-8 items-center flex-row bg-btnWhite shadow-lg rounded-lg' 
                        onPress={() => setToolKnowledgeLevelTemp('knowledgeable')} style={{backgroundColor: toolKnowledgeLevelTemp === 'knowledgeable' ? "#e7f6fe" : "#F8F8FF"}}>
                            <Text className='font-semibold text-lg text-black'>Knowledgeable </Text>
                            {toolKnowledgeLevelTemp === 'knowledgeable' ? <Text className='text-lg ml-auto text-secondary'>✔</Text> : null}
                        </TouchableOpacity>
                        <TouchableOpacity className='w-full h-12 px-8 items-center flex-row bg-btnWhite shadow-lg rounded-lg' 
                        onPress={() => setToolKnowledgeLevelTemp('expert')} style={{backgroundColor: toolKnowledgeLevelTemp === 'expert' ? "#e7f6fe" : "#F8F8FF"}}>
                            <Text className='font-semibold text-lg text-black'>Expert</Text>
                            {toolKnowledgeLevelTemp === 'expert' ? <Text className='text-lg ml-auto text-secondary'>✔</Text> : null}
                        </TouchableOpacity>
                    </View>
                    <View style={{ flex: 1 }} />
                    <TouchableOpacity className='w-full h-12 rounded items-center justify-center bg-primary' onPress={updatePreference}>
                        <Text className='font-bold text-xl text-white'>Next</Text>
                    </TouchableOpacity>
                </ScrollView>
            </>
        )
    }

    const [skillLevel, setSkillLevel] = useState('');

    const skillsLevel = () => {

        const [skillLevelTemp, setSkillLevelTemp] = useState('');
        const updatePreference = () => {
            if (skillLevelTemp.trim() === ''){
                Alert.alert("Oops⚠️", "Field cannot be empty. Fill them up before proceeding!", [
                    {text: 'OK'}
                ]);
                return;
            }
            setSkillLevel(skillLevelTemp);
            goNextPage();
        }

        return(
            <>
                <ScrollView contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 24, paddingVertical: 20, paddingBottom: 24, gap: 12 }}
                    style={{ width: width, height: height}}>
                    <View className='w-[80%] flex-col gap-4'>
                        <Text className='font-extrabold text-wrap text-4xl'>Personalize your Experience</Text>
                        <Text className='font-regular text-base'>How would you assess your level of experience or expertise when it comes to home repairs?</Text>
                    </View>
                    <View className='w-full h-auto gap-2 pt-4'>
                        <TouchableOpacity className='w-full h-12 px-8 items-center flex-row bg-btnWhite shadow-lg rounded-lg' 
                        onPress={() => setSkillLevelTemp('beginner')} style={{backgroundColor: skillLevelTemp === 'beginner' ? "#e7f6fe" : "#F8F8FF"}}>
                            <Text className='font-semibold text-lg text-black'>Beginner</Text>
                            {skillLevelTemp === 'beginner' ? <Text className='text-lg ml-auto text-secondary'>✔</Text> : null}
                        </TouchableOpacity>
                        <TouchableOpacity className='w-full h-12 px-8 items-center flex-row bg-btnWhite shadow-lg rounded-lg' 
                        onPress={() => setSkillLevelTemp('intermediate')} style={{backgroundColor: skillLevelTemp === 'intermediate' ? "#e7f6fe" : "#F8F8FF"}}>
                            <Text className='font-semibold text-lg text-black'>Intermediate</Text>
                            {skillLevelTemp === 'intermediate' ? <Text className='text-lg ml-auto text-secondary'>✔</Text> : null}
                        </TouchableOpacity>
                        <TouchableOpacity className='w-full h-12 px-8 items-center flex-row bg-btnWhite shadow-lg rounded-lg' 
                        onPress={() => setSkillLevelTemp('advance')} style={{backgroundColor: skillLevelTemp === 'advance' ? "#e7f6fe" : "#F8F8FF"}}>
                            <Text className='font-semibold text-lg text-black'>Advance</Text>
                            {skillLevelTemp === 'advance' ? <Text className='text-lg ml-auto text-secondary'>✔</Text> : null}
                        </TouchableOpacity>
                        <TouchableOpacity className='w-full h-12 px-8 items-center flex-row bg-btnWhite shadow-lg rounded-lg' 
                        onPress={() => setSkillLevelTemp('expert')} style={{backgroundColor: skillLevelTemp === 'expert' ? "#e7f6fe" : "#F8F8FF"}}>
                            <Text className='font-semibold text-lg text-black'>Expert</Text>
                            {skillLevelTemp === 'expert' ? <Text className='text-lg ml-auto text-secondary'>✔</Text> : null}
                        </TouchableOpacity>
                        <TouchableOpacity className='w-full h-12 px-8 items-center flex-row bg-btnWhite shadow-lg rounded-lg' 
                        onPress={() => setSkillLevelTemp('professional')} style={{backgroundColor: skillLevelTemp === 'professional' ? "#e7f6fe" : "#F8F8FF"}}>
                            <Text className='font-semibold text-lg text-black'>Professional</Text>
                            {skillLevelTemp === 'professional' ? <Text className='text-lg ml-auto text-secondary'>✔</Text> : null}
                        </TouchableOpacity>
                    </View>
                    <View style={{ flex: 1 }} />
                    <TouchableOpacity className='w-full h-12 rounded items-center justify-center bg-primary' onPress={updatePreference}>
                        <Text className='font-bold text-xl text-white'>Next</Text>
                    </TouchableOpacity>
                </ScrollView>
            </>
        )
    }

    const [buttonLoading, setButtonLoading] = useState(false);

    const submitPreference = async() => {
        setButtonLoading(true);
        console.log(`----------------------- ${userID} ${preferredNameToBeCalled}, ${preferredToneToBeUsed}, ${toolKnowledgeLevel}, ${skillLevel}`);
        try {
            const res = await axios.post(`${API_URL}preference`, {userId: userID, preferredTone: preferredToneToBeUsed, toolFamiliarity: toolKnowledgeLevel, skillLevel: skillLevel}, 
                { 
                  validateStatus: (status) => status < 500, // Only throw errors for 500+ status codes
                })
            console.log("result on submit pref: ", res);
            
            if (!res.data.success){
                Alert.alert("Oops⚠️", res.data.message, [
                    {text: "Okay"}
                ]);
                setButtonLoading(false);
                return;
            }
            console.log(res.data.message);
            await router.replace('/modal/askName');
        } catch (error) {
            Alert.alert("Oops⚠️", error.message, [
                {text: "Okay"}
            ]);
            setButtonLoading(false);
        }

    }
    

    const getStarted = () => {
        return(
            <>
                <ScrollView contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 24, paddingVertical: 20, paddingBottom: 24, gap: 12 }}
                    style={{ width: width, height: height}}>
                    <View className='w-[80%] flex-col gap-4'>
                        <Text className='font-extrabold text-wrap text-4xl'>You're All Set!</Text>
                        <Text className='font-regular text-base'>Click the button to begin your journey in turning your house into a home!</Text>
                    </View>

                    <View className='w-full h-[50%] items-center justify-center'>
                    <Image 
                        source={illustration} 
                        style={{ width: '100%', height: '100%', marginTop: 42, resizeMode: 'contain' }} 
                    />
                    </View>

                    <View className='flex-1'/>
                   
                    <TouchableOpacity className='w-full h-12 rounded items-center justify-center bg-primary' onPress={submitPreference} disabled={buttonLoading}>
                        {buttonLoading ? <ActivityIndicator size={32} color={'white'}/> : <Text className='font-bold text-xl text-white'>Get Started</Text>}
                    </TouchableOpacity>
                </ScrollView>
            </>
        )
    }

    const pages = [ preferredTone, toolFamiliarity, skillsLevel, getStarted]

    const Page = ({Component}) => {
        return (
            <View style={{ alignItems: "center", justifyContent: 'center', width: width, height: height * .88}} className="border-0">
                <Component/>
            </View>
          );
    }

    const [currentPageIndex, setCurrentPageIndex] = useState(0);

    const updateCurrentPageIndex = (e) => {
        const contentOffsetX = e.nativeEvent.contentOffset.x;
        const currentIndex = Math.round(contentOffsetX / width);
        setCurrentPageIndex(currentIndex);
    }

    const goNextPage = () => {
        const nextPageIndex = currentPageIndex + 1;
        if (nextPageIndex != pages.length){
          const offset = nextPageIndex * width;
          ref?.current?.scrollToOffset({offset});
          setCurrentPageIndex(nextPageIndex);
        }
      }

    const Indicator = () => {
        return(
            <View style={{flexDirection: "row", alignItems: "center", justifyContent: "center", height: height * .10}} >
                <View style={{width: 280, height: 8, backgroundColor: '#D3D3D3'}} className='rounded'>
                    <View 
                         style={{
                            backgroundColor: "black", 
                            height: "100%", 
                            width: `${((currentPageIndex + 1 )/ (pages.length)) * 100}%`
                          }} 
                          className='rounded transition-all duration-500'
                    />
                </View>
            </View>
        )
    } 

    if (loading){
        return (
          <View className='w-screen h-screen items-center justify-center gap-4'>
            <ActivityIndicator size={32} color={'blue'}/>
            <Text>Loading Assets...</Text>
          </View>
        )
      }


  return (
    <>
        <SafeAreaView style={{ flex: 1}}>
            <Indicator/>
            <FlatList 
                //scrollEnabled={false}
                keyboardShouldPersistTaps="handled"
                //removeClippedSubviews={false}
                ref={ref}
                showsHorizontalScrollIndicator={true}
                horizontal
                onMomentumScrollEnd={updateCurrentPageIndex}
                pagingEnabled
                data={pages}
                renderItem={({ item }) => <Page Component={item} />}
            />
        </SafeAreaView>
    </>
    
  )
}

export default Personalization
