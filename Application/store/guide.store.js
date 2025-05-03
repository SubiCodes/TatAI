import { create } from "zustand";
import axios from "axios";
import Constants from 'expo-constants';

const API_URL =
  Constants.expoConfig?.extra?.API_URL ?? Constants.manifest?.extra?.API_URL;

const guideStore = create((set) => ({
    guide: null,
    guides: [],
    latestGuides: [],
    repairGuides: [],
    toolGuides: [],
    cookingGuides: [],
    diyGuides: [],
    isFetchingGuides: false,
    errorFetchingGuides: null,
    feedbacks: [],
    isFetchingFeedbacks: false,
    errorFetchingFeedbacks: null,
    getAllGuides: async () => {
        try {
            set({isFetchingGuides: true, errorFetchingGuides: null});
            const res = await axios.get(`${API_URL}guide`);
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
    
    getLatestGuidePerTypeAll: async (type) => {
        try {
            set({isFetchingGuides: true, errorFetchingGuides: null});
            const res = await axios.post(`${API_URL}guide/pertype`, {type: type});
            set({guides: res.data.data})
        } catch (error) {
            console.log('error in repair fetch', error.message);
            set({errorFetchingGuides: error.message});
        } finally {
            set({isFetchingGuides: false});
        }
    },
    getGuide: async (id) => {
        try {
            set({isFetchingGuides: true, errorFetchingGuides: null});
            const res = await axios.get(`${API_URL}guide/${id}`);
            set({guide: res.data.data})
        } catch (error) {
            console.log('error ins get guide', error.message);
            set({errorFetchingGuides: error.message});
        } finally {
            set({isFetchingGuides: false});
        }
    },
    getFeedbacks: async (guideID) => {
        try {
            set({isFetchingFeedbacks: true, errorFetchingFeedbacks: null});
            const res = await axios.get(`${API_URL}guide/getFeedback/${guideID}`);
            console.log(res.data.data);
            set({feedbacks: res.data.data});
        } catch (error) {
            console.log('error in get feedback', error.message);
            set({errorFetchingFeedbacks: error.message});
        } finally {
            set({isFetchingFeedbacks: false});
        }
    }
}));

export default guideStore