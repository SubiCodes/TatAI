import { Text, View, SafeAreaView, StatusBar, Dimensions, FlatList, Image, StyleSheet, Touchable, TouchableOpacity } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';

import SplashScreen from "@/components/splash-screen";
import { useCallback, useState, useRef } from "react";
import { Link, router, useFocusEffect, useRouter } from "expo-router";

import HomeRepair from '../assets/images/initial-screen-images/HOME-REPAIR.jpg';

const {width, height} = Dimensions.get('window');

const slides = [
  {
    id: '1',
    image: HomeRepair,
    title: 'Instant Fix-it Guides',
    subtitle: 'Solve common household problems quickly with easy-to-follow repair solutions.'
  },
  {
    id: '2',
    image: require('../assets/images/initial-screen-images/CHATBOT.jpg'),
    title: 'Smart Troubleshooting & Diagnostics',
    subtitle: 'Identify issues easily with guided questions that helps you find the best fix.'
  },
  {
    id: '3',
    image: require('../assets/images/initial-screen-images/DIY.jpg'),
    title: 'DIY Projects & Home Improvement',
    subtitle: 'Explore creative and practical DIY projects for home decoration, organization and maintenance.'
  },
  {
    id: '4',
    image: require('../assets/images/initial-screen-images/TOOLS.jpg'),
    title: 'Learn proper tool usage',
    subtitle: 'Master essential tools with detailed usage guide, safety tips and best practices.'
  },
  {
    id: '5',
    image: require('../assets/images/initial-screen-images/COOKING.jpg'),
    title: 'Quick Recipes & Household Hacks',
    subtitle: 'Discover simple recipes and smart home organization tips to make daily tasks easier.'
  },
  {
    id: '6',
    image: require('../assets/images/initial-screen-images/AI.jpg'),
    title: 'AI-Powered Smart Assistance',
    subtitle: 'Get step-by-step home repair guidance. Ask questions through text or voice and receive clear, expert-backed instructions.'
  },
]

const Slide = ({ item }) => {
  return (
    <View style={{ alignItems: "center"}} className="border-0">
      <Image
        source={item.image}
        style={{ width: width, height: height * .65, resizeMode: "cover"}}
      />
      <View style={{ width: "90%", maxWidth: width * 0.9, paddingTop: 22, paddingLeft: 0, gap: 4 }}>
        <Text className="text-3xl flex-wrap font-extrabold">
          {item.title}
        </Text>
        <Text className="text-base">
          {item.subtitle}
        </Text>
      </View>
    </View>
  );
};

export default function Index() {

  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const ref = useRef(null);

  const firstOpen = async () => {

  }

  useFocusEffect(
    useCallback(() => {}, [])
  )

  const Footer = () => {
    return (
      <View style={{height: height * .12, justifyContent: "center", flexDirection: "row", gap: 16}}>

        {currentSlideIndex == slides.length - 1 ? (
          <TouchableOpacity className="w-5/6 h-12 items-center justify-center bg-blue-700 rounded-md " onPress={getStarted}>
          <Text className="font-bold text-white">Get Started</Text>
          </TouchableOpacity>
        ) : (
        <>
          <TouchableOpacity className="w-32 h-12 items-center justify-center bg-background rounded-md border-2 border-black" onPress={skip}>
            <Text className="font-bold text-black">SKIP</Text>
          </TouchableOpacity>
          <View style={{flexDirection: "row", justifyContent: "center", marginTop: 18}}>
            {slides.map((_, index) => (
            <View key={index} style={[styles.indicator, currentSlideIndex == index && {backgroundColor: 'black'}]}/> 
            ))}
          </View>
          <TouchableOpacity className="w-32 h-12 items-center justify-center bg-blue-700 rounded-md" onPress={goNextSlide}>
            <Text className="font-bold text-white">NEXT</Text>
          </TouchableOpacity>
        </>
        )}   
      </View>
    )
  }

  const updateCurrentSlideIndex = (e) => {
    const contentOffsetX = e.nativeEvent.contentOffset.x;
    const currentIndex = Math.round(contentOffsetX / width);
    setCurrentSlideIndex(currentIndex);
  }

  const goNextSlide = () => {
    const nextSlideIndex = currentSlideIndex + 1;
    if (nextSlideIndex != slides.length){
      const offset = nextSlideIndex * width;
      ref?.current?.scrollToOffset({offset});
      setCurrentSlideIndex(nextSlideIndex);
    }
  }

  const skip = () => {
    const lastSlideIndex = slides.length - 1;
    const offset = lastSlideIndex * width;
    ref?.current?.scrollToOffset({offset});
    setCurrentSlideIndex(lastSlideIndex);
  }

  const getStarted = () => {
    router.replace('/(auth-screens)/signin');
  }

  return (
    <>
      <StatusBar translucent={true} backgroundColor="transparent" />
      <SafeAreaView style={{ flex: 1}}>
        <FlatList
          ref = {ref}
          onMomentumScrollEnd={updateCurrentSlideIndex}
          pagingEnabled
          data={slides}
          contentContainerStyle={{ height: height * 0.85}}
          showsHorizontalScrollIndicator={false}
          horizontal
          renderItem={({ item }) => <Slide item={item} />}
        />
        <Footer />
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  indicator: {
    height: 8,
    width: 8,
    backgroundColor: 'lightgray',
    marginHorizontal: 2,
    borderRadius: '100%'
  }
})
