import { View, Text, StatusBar, SafeAreaView, Switch } from 'react-native'
import { useColorScheme } from 'nativewind';
import React, { useState, useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';

const DarkMode = () => {

    const {colorScheme, toggleColorScheme} = useColorScheme();
    const [theme, setTheme] = useState(colorScheme);

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

    useEffect(() => {
        const saveTheme = async () => {
          try {
            await AsyncStorage.setItem('theme', colorScheme);
            setTheme(colorScheme);
          } catch (error) {
            console.error('Failed to save theme:', error);
          }
        };
    
        saveTheme();
    }, [colorScheme]);

  return (
    <>
        <StatusBar
        translucent={false}
        backgroundColor={colorScheme === 'dark' ? '#121212' : '#FAF9F6'}
        barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'}
        />

        <SafeAreaView className={`min-w-screen min-h-screen px-8 pt-24 bg-background dark:bg-background-dark`}>
        <View className='w-full h-auto flex-row items-center px-4'>
            <Text className='text-xl font-bold text-text flex-1 dark:text-text-dark'>
            {colorScheme === 'dark' ? 'On' : 'Off'}
            </Text>

            <View style={{ transform: [{ scale: 1.2 }] }}>
            <Switch
                trackColor={{ false: '#767577', true: '#A9A9A9' }}
                thumbColor={colorScheme === 'dark' ? '#0818A8' : '#f4f3f1'}
                ios_backgroundColor="#3e3e3e"
                onValueChange={toggleColorScheme}
                value={colorScheme === 'dark'}
            />
            </View>
        </View>
    </SafeAreaView>
  </>
  )
}

export default DarkMode