import { create } from 'zustand';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import { router } from 'expo-router';
import Constants from 'expo-constants';
import {jwtDecode} from 'jwt-decode'

const API_URL =
  Constants.expoConfig?.extra?.API_URL ?? Constants.manifest?.extra?.API_URL;

const userStore = create((set) => ({
user: null,
preference: null,
isLoading: false,
error: null,
userLogin: async (email, password) => {
    set({ error: null, isLoading: true });
    try {
      if (email.trim() === '' || password.trim() === '') {
        set({ error: 'Please fill all fields.', isLoading: false });
        Alert.alert('Login error', 'Please fill in all the fields.', [{ text: 'OK' }]);
        return;
      }

      const res = await axios.post(`${API_URL}auth/sign-in`, { email, password }, {
        validateStatus: (status) => status < 500,
      });

      if (res.data.success) {
        await AsyncStorage.setItem('token', res.data.token);

        set({user: res.data.user});

        router.replace('/(tabs)/home');
      } else {
        set({ error: 'Invalid Credentials.' });
        Alert.alert('Login error', 'Please input valid credentials.', [{ text: 'OK' }]);
      }
    } catch (error) {
      console.error('Login error:', error);
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },
logoutUser: async () => {
    Alert.alert(
      'Confirm Logout',
      'Are you sure you want to log out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Log Out',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('token');
              set({ user: null });
              router.dismissTo('/(auth-screens)/signin');
            } catch (error) {
              set({ error: error.message });
            }
          },
        },
      ],
      { cancelable: true }
    );
},
checkUserLoggedIn: async () => {
    set({ error: null, isLoading: true });
    let shouldRedirect = false;
    try {
      const token = await AsyncStorage.getItem('token');
  
      if (!token) {
        shouldRedirect = true;
        return;
      }
  
      const decodedToken = jwtDecode(token);     
      const res = await axios.get(`${API_URL}user/${decodedToken.userID}`);
      set({ user: res.data.data });
    } catch (error) {
      await AsyncStorage.removeItem('token')
      Alert.alert(
      "Oops",
      "Unable to login.",
      [
        {
          text: "OK",
          onPress: () => router.dismissTo("/(auth-screens)/signin"),
        },
      ],
      { cancelable: false }
    );
      console.error('checkUserLoggedIn error:', error.message);
      set({ error: "User not found"});
    } finally {
      set({ isLoading: false });
      if (shouldRedirect) {
        router.replace('/(auth-screens)/signin');
      }
    }
  },
getUserInfo: async () => {
    set({ error: null, isLoading: true });
    try {
        const token = await AsyncStorage.getItem('token');
        const decryptedToken = await jwtDecode(token);
        if (!token) {
            router.dismissAll();
            router.replace('/(auth-screens)/signin');
        }
        const res = await axios.get(`${API_URL}user/${decryptedToken.userID}`);
        set({user: res.data.data});
    } catch (error) {
        set({error: error.message});
        console.log(error.message);
    }finally{
        set({isLoading: false});
    }    
},
editUserInfo: async (firstName, lastName, birthDate, gender, activeProfileIcon, userID) => {
  set({ error: null, isLoading: true });
  try {
    const res = await axios.put(`${API_URL}user/${userID}`, {
      firstName: firstName,
      lastName: lastName,
      birthday: birthDate,
      gender: gender,
      profileIcon: activeProfileIcon,
    });

    // Show success message
    Alert.alert("Success", "Your changes have been saved.");

    // Update the user in store with new values
    set((state) => ({
      user: state.user ? {
        ...state.user,
        firstName: firstName,
        lastName: lastName,
        birthday: birthDate,
        gender: gender,
        profileIcon: activeProfileIcon,
      } : null,
    }));
  } catch (error) {
    Alert.alert("Oops", "Cannot apply changes. Please check your connection or contact customer support.");
    console.log('Error in the store: ', error.message);
  } finally {
    set({ isLoading: false });
  }
},
  getUserPreference: async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const decryptedToken = jwtDecode(token);
      const res = await axios.get(`${API_URL}preference/${decryptedToken.userID}`);
      if (!res.data.success) {
        await router.push("/modal/personalization");
        return;
      }
      set({preference: res.data.data})
      return res.data.data;
    } catch (error) {
      Alert.alert(
        "Oops",
        error.message
      );
      console.log('Error in the store preference: ',error.message);
      return { success: false }
    }
  },
  updateUserPreference: async (updatedFields) => {
    try {
      const token = await AsyncStorage.getItem('token');
      const decryptedToken = await jwtDecode(token);
      const res = await axios.put(
        `${API_URL}preference/${decryptedToken.userID}`,
        updatedFields
      );
      console.log("Updated user preference:", res.data.data);
      set({ preference: res.data.data });
      return res.data.message
    } catch (error) {
      Alert.alert(
        "Oops",
        "Cannot apply changes. Please check your connection or contact customer support."
      );
      console.log("Error updating user preference:", error.message);
    }
  },
  addSearch: async (id, search) => {
    try {
      const res = await axios.post(`${API_URL}preference/add-search`, {userId: id, search: search});
      set({preference: res.data.data})
    } catch (error) {
      Alert.alert("Oops", "Cannot apply changes. Please check your connection or contact customer support.");
      console.log('Error in the store preference: ',error.message);
    }
  },
  removeSearch: async (id, search) => {
    try {
      const res = await axios.post(`${API_URL}preference/remove-search`, {userId: id, search: search});
      set({preference: res.data.data})
    } catch (error) {
      Alert.alert("Oops", "Cannot apply changes. Please check your connection or contact customer support.");
      console.log('Error in the store preference: ',error.message);
    }
  },
  clearSearch: async (id) => {
    try {
      const res = await axios.post(`${API_URL}preference/clear-search`, {userId: id});
      set({preference: res.data.data})
    } catch (error) {
      Alert.alert("Oops", "Cannot apply changes. Please check your connection or contact customer support.");
      console.log('Error in the store preference: ',error.message);
    }
  },

}));

export default userStore;