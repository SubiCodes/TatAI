import { View, Text } from 'react-native'
import { useRouter } from 'expo-router';
import React from 'react'
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';

const HeaderContactUs = () => {

    const router = useRouter();
    
    const openContactForm = async () => {
        router.push('/(auth-screens)/contactus');
    }

    return (
        <View>
            <Text onPress={openContactForm}> 
                <SimpleLineIcons name="earphones-alt" size={24} color="black" /> 
            </Text>
        </View>
    )
}

export default HeaderContactUs