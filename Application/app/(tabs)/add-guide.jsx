import { View, Text } from 'react-native'
import React from 'react'

const AddGuide = () => {
  return (
    <View className='w-full h-full bg-background dark:bg-background-dark'>

        {/* Floating Header */}
        <View className='w-full items-center justify-center py-4 bg-white dark:bg-[#2A2A2A]'>
            <Text className='text-text text-xl dark:text-text-dark'>Create a guide</Text>
        </View>
        
    </View>
  )
}

export default AddGuide