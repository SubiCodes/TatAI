import { View, Text, SafeAreaView, StatusBar, FlatList, Dimensions, StyleSheet, TouchableOpacity, ScrollView, TextInput, Alert } from 'react-native'
import React, { useCallback, useRef, useState } from 'react'
import { useFocusEffect, useNavigation } from 'expo-router'

const {width, height} = Dimensions.get('window');

const Personalization = () => {

    const navigation = useNavigation();

    const removeHeader = () => {
        navigation.setOptions({
            title: "Customize Your Experience", // Change header title
            headerShown: false, // Ensure the header is visible
        });
    }
    useFocusEffect(
        useCallback(() => {
            removeHeader();
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

    const preferredTone = () => {
        return(
            <>
                <Text>Page 2</Text>
            </>
        )
    }

    const experienceLevel = () => {
        return(
            <>
                <Text>Page 3</Text>
            </>
        )
    }

    const toolFamiliarity = () => {
        return(
            <>
                <Text>Page 4</Text>
            </>
        )
    }

    const interests = () => {
        return(
            <>
                <Text>Page 5</Text>
            </>
        )
    }

    const pages = [preferredName, preferredTone, experienceLevel, toolFamiliarity, interests]

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
            <View style={{flexDirection: "row", alignItems: "center", justifyContent: "center", height: height * .10}} className='mt-14'>
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


  return (
    <>
        <StatusBar translucent={true} backgroundColor="transparent" />
        <SafeAreaView style={{ flex: 1}}>
            <Indicator/>
            <FlatList 
                // scrollEnabled={false}
                keyboardShouldPersistTaps='handled'
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
