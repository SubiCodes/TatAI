import { View, Text, TouchableOpacity } from 'react-native'
import { Link } from 'expo-router'
import React from 'react'

const SignUp = () => {
  return (
   <View style={{alignItems: 'center', justifyContent: 'center', flex: 1}}>
        <TouchableOpacity style={{backgroundColor: 'lightgreen', paddingVertical: 4, paddingHorizontal: 8, marginBottom: 12}}>
            <Text>Sign Up</Text>
        </TouchableOpacity>
        <Link href={'/signin'} style={{backgroundColor: 'lightblue', paddingVertical: 4, paddingHorizontal: 8, marginBottom: 12}}>
            <Text>Already have an Account</Text>
        </Link>
    </View>
  )
}

export default SignUp