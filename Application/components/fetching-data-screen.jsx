import { View, Text, ActivityIndicator } from 'react-native'
import React from 'react'

const FetchingDataScreen = () => {
  return (
    <View className='w-screen h-screen items-center justify-center flex-col'>
        <ActivityIndicator size={32} color={'#0818A8'}/>
        <Text>Fetching Data...</Text>
    </View>
  )
}

export default FetchingDataScreen