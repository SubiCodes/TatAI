import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';

import Constants from 'expo-constants';
import axios from 'axios';

const API_URL =
  Constants.expoConfig?.extra?.API_URL ?? Constants.manifest?.extra?.API_URL;

const ContactUs = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  
  // Add validation states
  const [emailError, setEmailError] = useState(false);
  const [messageError, setMessageError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Email validation function
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Check individual field validity
  const checkEmailValidity = (value) => {
    const isValid = value.trim() !== '' && validateEmail(value);
    setEmailError(!isValid);
    return isValid;
  };

  const checkMessageValidity = (value) => {
    const isValid = value.trim().length >= 10; // Require at least 10 characters
    setMessageError(!isValid);
    return isValid;
  };

  // Handle input changes with validation
  const handleEmailChange = (value) => {
    setEmail(value);
    if (emailError) {
      checkEmailValidity(value);
    }
  };

  const handleMessageChange = (value) => {
    setMessage(value);
    if (messageError) {
      checkMessageValidity(value);
    }
  };

  const submitEmail = async () => {
    // Validate all fields before submission
    const isEmailValid = checkEmailValidity(email);
    const isMessageValid = checkMessageValidity(message);
    
    if (!isEmailValid || !isMessageValid) {
      // Display error message
      Alert.alert('Validation Error', 'Please fix the highlighted fields before submitting.');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      console.log(`${API_URL}user/concern`,);
      const res = await axios.post(`${API_URL}user/concern`, {
        email: email, 
        message: message
      });
      
      if (res.data.success) {
        // Reset form on success
        Alert.alert('Success', 'Your message has been sent successfully!');
        setEmail('');
        setMessage('');
        setEmailError(false);
        setMessageError(false);
      } else {
        Alert.alert('Error', res.data.message || 'Failed to send message.');
      }
    } catch (error) {
      console.error('Error submitting concern:', error.response?.data || error.message);
      Alert.alert(
        'Error', 
        error.response?.data?.message || 'Failed to send message. Please try again later.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View className="w-full h-full items-center justify-start">
      <View className="w-[90%] flex flex-col justify-center mt-10">
        <View>
          <Text className="font-light text-lg mb-8">
            Let us know your questions, suggestions and concerns by filling out
            the contact form below.
          </Text>
        </View>

        <View className='mb-2'>
          <Text className="font-bold">
            Email
          </Text>
        </View>

        <View className={`border ${emailError ? 'border-red-500' : 'border-gray-300'} bg-white px-2 py-0 rounded-xl mb-1`}>
          <TextInput
            placeholder="Your Email"
            value={email}
            onChangeText={handleEmailChange}
            onBlur={() => checkEmailValidity(email)}
            keyboardType="email-address"
            autoCapitalize="none"
            className="text-base text-black"
          />
        </View>
        
        {emailError && (
          <Text className="text-red-500 text-xs mb-2">
            Please enter a valid email address
          </Text>
        )}
        {!emailError && <View className="mb-4" />}

        <View className='mb-2'>
          <Text className="font-bold">
            Concern
          </Text>
        </View>

        <View className={`h-40 border ${messageError ? 'border-red-500' : 'border-gray-300'} rounded-xl px-2 py-0 bg-white mb-1`}>
          <TextInput
            placeholder="Write your message..."
            value={message}
            onChangeText={handleMessageChange}
            onBlur={() => checkMessageValidity(message)}
            multiline
            textAlignVertical="top"
            className="text-base text-black h-full"
          />
        </View>
        
        {messageError && (
          <Text className="text-red-500 text-xs mb-2">
            Message must be at least 10 characters
          </Text>
        )}
        {!messageError && <View className="mb-4" />}

        <View className='flex flex-1'/>

        <TouchableOpacity 
          className={`w-full ${isSubmitting ? 'bg-gray-400' : 'bg-primary'} py-2 items-center justify-center rounded-xl`}
          onPress={submitEmail}
          disabled={isSubmitting}
        >
          <Text className='text-white text-xl font-bold'>
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ContactUs;