import { View, Text, TouchableOpacity } from 'react-native'
import React, { useCallback, useState } from 'react'
import { Link, useFocusEffect } from 'expo-router';
import { useExpoRouter } from 'expo-router/build/global-state/router-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

    const handleSignIn = async() => {
        try {
            await AsyncStorage.setItem('token', 'sample token');
            checkLogin();
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
    
    return (
        <View style={{alignItems: 'center', justifyContent: 'center', flex: 1}}>
            <TouchableOpacity style={{backgroundColor: 'lightgreen', paddingVertical: 4, paddingHorizontal: 8, marginBottom: 12}}
            onPress={handleSignIn}>
                <Text>Sign In</Text>
            </TouchableOpacity>
            <Link href={'/signup'} style={{backgroundColor: 'lightblue', paddingVertical: 4, paddingHorizontal: 8, marginBottom: 12}}>
                <Text>Create an Account</Text>
            </Link>
            {error && <Text>{error}</Text>}
        </View>
    )
}

export default SignIn