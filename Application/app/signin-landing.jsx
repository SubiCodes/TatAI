import { View, Text, TouchableOpacity, StyleSheet, Image, StatusBar } from 'react-native'
import React, { useCallback, useState } from 'react'
import { Link, useFocusEffect } from 'expo-router';
import { useExpoRouter } from 'expo-router/build/global-state/router-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from 'react-native';

import googleIcon from '../assets/images/google-icon.png';
import facebookIcon from '../assets/images/facebook-icon.png';

import { Colors } from '@/constants/Color';

const SignIn = () => {

    const router = useExpoRouter();

    const [error, setError] = useState('');

    const checkLogin = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            if (token) {
                router.replace('(tabs)/(home)');
            }
        } catch (error) {
            console.log(error);
            setError(error.message);
        }
    };

    // const handleSignIn = async() => {
    //     try {
    //         await AsyncStorage.setItem('token', 'sample token');
    //         checkLogin();
    //     } catch (error) {
    //         console.log(error);
    //         setError(error.message);
    //     }
    // }

    const openSignInPage = async () => {
        try {
            router.replace('/signin')
        } catch (error) {
            console.log(error);
            setError(error.message);
        }
    }

    useFocusEffect(
        useCallback(() => {
            checkLogin();
        }, [])
    )

    const colorScheme = useColorScheme();
    const themeColors = Colors['light']

    const styles = StyleSheet.create({
        container: {
            flexDirection: 'column',
            alignItems: 'center', 
            flex: 1,
            gap: 12,
            backgroundColor: themeColors.background
        },
        topContainer: {
            width: '100%',
            height: '50%',
            alignItems: 'center',
            justifyContent: 'center',
            alignSelf: 'flex-start',
            borderWidth: 0,
            gap: 0,
        },
        imageContainer: {
            width: 240,
            height: 240,
            borderRadius: 9999,
            boxShadow: '0px 4px 30px rgba(0, 0, 0, 0.2)',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 32,
            marginBottom: 60
        },
        welcomeMessage: {
            fontSize: 26,
            fontWeight: 'bold'
        },
        buttonImageContainer: {
            borderWidth: 0,
            width: '16%',
            height: '90%',
            borderRadius: 999999,
            left: 24,
            position: 'absolute',
        },
        buttonImage: {
            maxWidth: '60%',
            height: '100%'
        },
        buttonContainer: {
            width: '100%',
            height: '34%',
            borderWidth: 0,
            alignItems: 'center',
            justifyContent: 'center',
            gap: 12
        },
        signinButton: {
            width: '80%',
            height: '22%',
            boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.2)',
            borderRadius: 24,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#ECB412',
            paddingVertical: 0,
            fontWeight: 'bold',
        },
        facebookButton: {
            width: '80%',
            height: '22%',
            boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.2)',
            borderRadius: 24,
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
            backgroundColor: 'white',
            fontWeight: 'bold'
        },
        googleButton: {
            width: '80%',
            height: '22%',
            boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.2)',
            borderRadius: 24,
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
            backgroundColor: 'white',
            fontWeight: 'bold',
            borderWidth: 0
        },
        
        termsContainer: {
            width: '100%',
            height: '20%',
            alignItems: 'center',
        },
        termsSubContainer: {
            width: '100%',
            height: '50%%',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
            borderWidth: 0,
            gap: 4
        },
        normalText: {
            fontSize: 14,
            fontWeight: '100'
        },
        linkText: {
            fontSize: 14,
            fontWeight: 'bold'
        }
    })

   
    
    return (
        <View style={styles.container}>
            <StatusBar backgroundColor={themeColors.background} />
            <View style={styles.topContainer}>
                <View style={styles.imageContainer}>
                    <Text>Image Here!</Text>  
                </View>
                <Text style={styles.welcomeMessage}>Welcome to TatAI</Text>
            </View>
            <View style={styles.buttonContainer}>
                <Link href={'/signin'} asChild>
                    <TouchableOpacity style={styles.signinButton}>
                        <Text style={{fontWeight: 'bold'}}>Sign In</Text>
                    </TouchableOpacity>
                </Link>
                <TouchableOpacity style={styles.facebookButton}>
                    <View style={styles.buttonImageContainer}>
                        <Image source={facebookIcon} style={styles.buttonImage} resizeMode='contain'/>
                    </View>
                    <Text style={{fontWeight: 'bold'}}>Continue with Facebook</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.googleButton}>
                    <View style={styles.buttonImageContainer}>
                        <Image source={googleIcon} style={styles.buttonImage} resizeMode='contain'/>
                    </View>
                    <Text style={{fontWeight: 'bold'}}>Continue with Google</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.termsContainer}>
                <Text style={styles.normalText}>By continuing you agree to our</Text>
                <View style={styles.termsSubContainer}>
                    <Text style={styles.linkText}>User Agreement</Text>
                    <Text style={styles.normalText}>and</Text>
                    <Text style={styles.linkText}>Privacy Policy</Text>
                </View>
            </View>
        </View>
    )
}

export default SignIn

