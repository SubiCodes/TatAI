import { View, Text, SafeAreaView, TextInput, TouchableOpacity } from 'react-native'
import CheckBox from 'expo-checkbox'
import React from 'react'

const ResetPassword = () => {
  return (
     <SafeAreaView className='h-[100%] w-screen flex items-center flex-col bg-background pt-32 md:pt-0 md:justify-center'>
        <View className='w-80 items-center justify-center gap-4 md:w-screen md:gap-12'>
            <View className='w-screen items-center md:w-3/5'>
                <Text className='text-4xl font-extrabold mb-6 md:text-5xl'>Forgot Password</Text>
                <Text className='text-lg mb-6 md:text-2xl md:mb-2'>Please, create a new Password</Text>
            </View>
            <View className='w-80 items-start gap-2 md:w-3/5'>
              <Text className='text-base font-bold md:text-2xl'>New Password</Text>
              <TextInput placeholder='Enter Password' className='h-12 w-80 border-black border-2 rounded-md md:w-full md:h-16'></TextInput>
              
              <View className='flex-row items-center gap-4 mr-auto mb-2 md:gap-8 md:mb-6'>
                <Text className='font-bold text-sm md:text-xl'>ⓘ Password Strength: <Text className='font-bold text-red-500 md:text-xl'>Weak</Text></Text>
                <View className='flex-row items-center gap-1 mr-auto md:gap-2'>
                  <CheckBox 
                  color={'black'}
                  className="transform scale-75 md:transform md:scale-150" 
                  />
                  <Text className='text-sm md:text-lg'>Show password</Text>
                </View>
              </View>

              <Text className='text-base font-bold md:text-2xl'>Re-enter Password</Text>
              <TextInput placeholder='Re-enter Password' className='h-12 w-80 border-black border-2 rounded-md md:w-full md:h-16'></TextInput>

              <View className='flex-row items-center gap-4 mr-auto mb-2 md:gap-8 md:mb-4'>
                <Text className='font-bold text-sm md:text-xl'>ⓘ Password Strength: <Text className='font-bold text-red-500 md:text-xl'>Weak</Text></Text>
                <View className='flex-row items-center gap-1 mr-auto md:gap-2'>
                  <CheckBox 
                  color={'black'}
                  className="transform scale-75 md:transform md:scale-150" 
                  />
                  <Text className='text-sm md:text-lg'>Show password</Text>
                </View>
              </View>
            </View>

            <TouchableOpacity className='w-80 h-12 items-center justify-center bg-blue-700 rounded-md md:w-3/5'>
              <Text className='text-lg text-white font-bold '>Change Password</Text>
            </TouchableOpacity>

        </View>
     </SafeAreaView>
                    
  )
}

export default ResetPassword