import { Text, View, SafeAreaView, StatusBar } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';

import SplashScreen from "@/components/splash-screen";
import { useCallback, useState, useEffect } from "react";
import { Link, useFocusEffect, useRouter } from "expo-router";

export default function Index() {

  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);

  const checkOpened = async () => {
    try {
      const isOpened = await AsyncStorage.getItem('opened');
      if (isOpened === 'true') {
        router.push('(auth-screens)/signin');
      } else {
        setIsLoading(false); 
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false); 
    }
  };
  
  const getStarted = async () => {
    try {
      await AsyncStorage.setItem('opened', 'true');
    } catch (error) {
      console.log(error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      checkOpened();
    }, [])
  )
  

  return (
    <>
      <StatusBar translucent={true} backgroundColor="transparent"/>
      <SafeAreaView
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
        className="bg-background flex gap-2 min-h-screen-safe"
      >
        
        {isLoading ? (
          <SplashScreen/> 
        ) : (
          <Link href={'/(auth-screens)/signin'} onPress={getStarted}>Get Started</Link>
        )}
        
        
      </SafeAreaView>
    </>
   
  );
}
