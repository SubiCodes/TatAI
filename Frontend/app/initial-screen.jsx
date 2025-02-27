import { View, Text } from 'react-native'
import React from 'react'
import { Link } from 'expo-router'

const InitialScreen = () => {
  return (
    <View style={{alignItems: 'center', justifyContent: 'center', flex: 1}}>
      <Text>InitialScreen</Text>
      <Link href={'/signin-landing'}
      style={{backgroundColor: 'lightgreen', paddingVertical: 4, paddingHorizontal: 8, marginBottom: 12}}
      >Create an account.</Link>
    </View>
  )
}

export default InitialScreen