import { View, Text, StatusBar, SafeAreaView, ScrollView, TextInput } from 'react-native'
import React from 'react'

const SignUp = () => {
  return (
    <>
      <StatusBar translucent={true} backgroundColor="transparent"/>
      <SafeAreaView className='h-[100%] w-screen flex justify-center items-center flex-col bg-background '>
        <ScrollView className='flex-1 gap-4 min-h-[100%] overflow-y-auto px-6 pt-12 pb-4'
        contentContainerStyle={{alignItems: 'center', justifyContent: 'center', gap: 24,width: 310, paddingLeft: 4}}>

          <View className='flex-row justify-between items-center w-80 self-start mt-20'>
            <View className='flex-col gap-2'>
              <Text className='font-extrabold text-4xl'>Sign up</Text>
              <Text className='text-base text-gray-500'>Create an account to get started</Text>
            </View>
          </View>

          <View className='flex-col w-80 self-start gap-4'>
            <View className='w-80 items-start gap-2 self-start'>
              <Text className='text-lg font-bold'>First Name</Text>
              <TextInput placeholder='Enter First Name' className='h-12 w-80 border-black border-2 rounded-md'></TextInput>
            </View>

            <View className='w-80 items-start gap-2 self-start'>
              <Text className='text-lg font-bold'>Last Name</Text>
              <TextInput placeholder='Enter Last Name' className='h-12 w-80 border-black border-2 rounded-md'></TextInput>
            </View>
          </View>

          


        </ScrollView>
      </SafeAreaView>
       
    </>
  )
}

export default SignUp