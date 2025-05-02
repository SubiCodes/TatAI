import { create } from "zustand";
import axios from "axios";
import Constants from 'expo-constants';

const API_URL =
  Constants.expoConfig?.extra?.API_URL ?? Constants.manifest?.extra?.API_URL;

const guideStore = create((set) => ({
    guides: [],
    latestGuides: [],
    repairGuides: [],
    toolGuides: [],
    cookingGuides: [],
    diyGuides: [],
    isFetchingGuides: false,
    errorFetchingGuides: null,
    getAllGuides: async () => {
        try {
            set({isFetchingGuides: true, errorFetchingGuides: null});
            const res = await axios.get(`${API_URL}guide`);
            console.log(res.data.data);
            set({guides: res.data.data});
        } catch (error) {
            console.log(error.message);
            set({errorFetchingGuides: error.message})
        } finally {
            set({isFetchingGuides: false});
        }
    },
    getLatestGuide: async () => {
        try {
            set({isFetchingGuides: true, errorFetchingGuides: null});
            const res = await axios.post(`${API_URL}admin/latest-guides`, {amount: 5});
            set({latestGuides: res.data.data});
        } catch (error) {
            console.log(error.message);
            set({errorFetchingGuides: error.message});
        } finally {
            set({isFetchingGuides: false});
        }
    },
    getLatestGuidePerType: async (type) => {
        try {
            set({isFetchingGuides: true, errorFetchingGuides: null});
            const res = await axios.post(`${API_URL}guide/pertype`, {type: type, amount: 5});
            if(type === 'repair') set({repairGuides: res.data.data});
            if(type === 'diy') set({diyGuides: res.data.data});
            if(type === 'cooking') set({cookingGuides: res.data.data});
            if(type === 'tool') set({toolGuides: res.data.data});
        } catch (error) {
            console.log('error in repair fetch', error.message);
            set({errorFetchingGuides: error.message});
        } finally {
            set({isFetchingGuides: false});
        }
    },
}));

export default guideStore