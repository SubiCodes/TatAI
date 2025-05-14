import { create } from "zustand";
import axios from "axios";
import Constants from 'expo-constants';

const API_URL =
  Constants.expoConfig?.extra?.API_URL ?? Constants.manifest?.extra?.API_URL;

const searchStore = create((set) => ({
    users: [],
    guides: [],
    results: [],
    isFetching: false,
    errors: null,
    tools: [],
    isFetchingTools: null,
    getUsers: async () => {
        try {
            set({isFetching: true});
            const res = await axios.get(`${API_URL}user/all`);
            console.log(res.data.data);
            set({users: res.data.data});
        } catch (error) {
            console.log("Error getting user's:", error);
            set({errors: "Something went wrong."})
            return error.message;
        } finally {
            set({isFetching: false});
        }
    },
    getGuides: async () => {
        try {
            set({isFetching: true});
            const res = await axios.get(`${API_URL}guide/accepted`);
            set({guides: res.data.data});
        } catch (error) {
            console.log("Error getting guides:", error);
            set({errors: "Something went wrong."})
            return error.message;
        } finally {
            set({isFetching: false});
        }
    },
    getSearchResults: async (term) => {
        try {
          set({ isFetching: true });
          const res = await axios.post(`${API_URL}guide/search`, { query: term });
      
          const { users, guides } = res.data.data;
      
          // Tag the items and preserve the _id
          const taggedUsers = users.map((user) => ({ type: 'user', _id: user._id, data: user }));
          const taggedGuides = guides.map((guide) => ({ type: 'guide', _id: guide._id, data: guide }));
      
          // Combine and shuffle
          const combined = shuffleArray([...taggedUsers, ...taggedGuides]);
      
          set({ results: combined });
        } catch (error) {
          console.log("Error getting results: ", error);
          set({ errors: "Something went wrong." });
          return error.message;
        } finally {
          set({ isFetching: false });
        }
    },
    getTools: async (tool) => {
        try {
            set({ isFetchingTools: true, error: false, tools: [] });
            const res = await axios.post(`${API_URL}guide/search-tools`, { tool: tool });
            set({ tools: res.data.data });
        } catch (error) {
            console.log("Error getting results:", error);
            Alert.alert(
                "Fetch Error",
                "There was a problem fetching the tools. Please try again later.",
                [{ text: "OK" }]
            );
            set({ errors: "Something went wrong." });
            return error.message;
        } finally {
            set({ isFetchingTools: false });
        }
    }
}));

const shuffleArray = (array) => {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
};

export default searchStore;