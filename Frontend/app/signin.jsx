import { View, Text, StyleSheet, useColorScheme, StatusBar, TextInput, Dimensions } from 'react-native'
import React from 'react'
import { Link } from 'expo-router'

import { Colors } from '@/constants/Color'

const SignIn = () => {

  const colorScheme = useColorScheme();
  const themeColors = Colors['light']

  const styles = StyleSheet.create({
    container: {
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height,
      alignItems: 'center',
      backgroundColor: themeColors.background,
      paddingTop: 48,
    },
    imageContainer: {
      width: '100%',
      height: '32%',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 12,
    },
    image: {
      width: '84%',
      height: '100%',
      backgroundColor: 'lightgray'
    },
    inputsContainer: {
      width: '84%',
      height: '30%',
      borderWidth: 2,
      alignItems: 'flex-start',
      paddingHorizontal: 0,
      gap: 12
    },
    welcomeText: {
      fontSize: 26,
      fontWeight: 'bold',
      alignSelf: 'flex-start'
    },
    inputs: {
      width: '100%',
      height: 48,
      borderWidth: 1,
      borderRadius: 8,
      fontSize: 14,
      paddingHorizontal: 12
    },
  });


  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={themeColors.background}/>
      <View style={styles.imageContainer}>
        <View style={styles.image}><Text>Image Here</Text></View>
      </View>
      <View style={styles.inputsContainer}>
        <Text style={styles.welcomeText}>Welcome!</Text>
        <TextInput style={styles.inputs} placeholder='Email Address'/>
        <TextInput style={styles.inputs} placeholder='Password' secureTextEntry={true}/>
      </View>
    </View>
  )
}

export default SignIn