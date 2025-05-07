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
    isBookmarked: null,
    viewUserData: null,
    viewUserGuides: [],
    viewUserInfoError: null, 
    viewUserInfoLoading: false, 
    getAllGuides: async () => {
        try {
            set({isFetchingGuides: true, errorFetchingGuides: null});
            const res = await axios.get(`${API_URL}guide/accepted`);
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
            set({feedbacks: res.data.data});
        } catch (error) {
            console.log('error in get feedback', error.message);
            set({errorFetchingFeedbacks: error.message});
        } finally {
            set({isFetchingFeedbacks: false});
        }
    },
    postFeedbackRating: async (guideId, userId, rating, user, feedbacks) => {
        try {
            const existingFeedback = feedbacks?.find(
                (feedback) => feedback.guideId === guideId && feedback.userId === userId
            );
    
            const res = await axios.post(`${API_URL}guide/addFeedback`, {
                guideId,
                userId,
                rating,
            });

            console.log("Rating res: ", res.data.data);
    
            const newFeedback = {
                ...res.data.data,
                userInfo: {
                    name: `${user.firstName} ${user.lastName}`.trim(),
                    email: user.email,
                    profileIcon: user.profileIcon,
                },
            };
    
            set((state) => ({
                feedbacks: existingFeedback
                    ? state.feedbacks.map((feedback) =>
                          feedback._id === existingFeedback._id ? newFeedback : feedback
                      )
                    : [...state.feedbacks, newFeedback],
            }));
        } catch (error) {
            console.log("Error posting feedback:", error);
        }
    },
    postFeedbackComment: async (guideId, userId, comment, user, feedbacks) => {
        try {
            const existingFeedback = feedbacks?.find(
                (feedback) => feedback.guideId === guideId && feedback.userId === userId
            );
    
            const res = await axios.post(`${API_URL}guide/addFeedback`, {
                guideId,
                userId,
                comment,
            });
            
            console.log("Comment res: ", res.data.data);
            

            const newFeedback = {
                ...res.data.data,
                userInfo: {
                    name: `${user.firstName} ${user.lastName}`.trim(),
                    email: user.email,
                    profileIcon: user.profileIcon,
                },
            };
    
            set((state) => ({
                feedbacks: existingFeedback
                    ? state.feedbacks.map((feedback) =>
                          feedback._id === existingFeedback._id ? newFeedback : feedback
                      )
                    : [...state.feedbacks, newFeedback],
            }));
        } catch (error) {
            console.log("Error posting feedback:", error);
        }
    },       
    deleteFeedbackComment: async (guideId, userId, comment, user, feedbacks) => {
        try {
            // Find the existing feedback
            const existingFeedback = feedbacks?.find(
                (feedback) => feedback.guideId === guideId && feedback.userId === userId
            );
    
            if (!existingFeedback) {
                console.log("No feedback found for this user");
                return; // Exit if no feedback is found
            }
    
            // Update the feedback's comment with the new one
            const updatedFeedback = {
                ...existingFeedback,
                comment: comment, // Update the comment with the new value
            };
    
            // Optional: Make API call to update the feedback on the server
            const res = await axios.post(`${API_URL}guide/addFeedback`, {
                guideId,
                userId,
                comment,
            });
    
            console.log("Feedback updated: ", res.data.data);
    
            // Update the feedbacks state with the updated feedback
            set((state) => ({
                feedbacks: state.feedbacks.map((feedback) =>
                    feedback._id === existingFeedback._id ? updatedFeedback : feedback
                ),
            }));
        } catch (error) {
            console.log("Error updating feedback:", error);
            return error.message;
        }
    },
    deleteRating: async (guideId, userId) => {
        try {
            const res = await axios.post(`${API_URL}guide/delete-rating`, {guideId: guideId, userId: userId});
            console.log(res.data.data);
        } catch (error) {
            console.log("Error updating feedback:", error);
            return error.message;
        }
    },
    checkIfBookmarked: async (guideId, userId) => {
        try {
            const res = await axios.post(`${API_URL}guide/is-bookmarked`, {guideId: guideId, userId:userId});
            console.log(res.data.isBookmarked);
            set({isBookmarked: res.data.isBookmarked});
        } catch (error) {
            console.log("Error updating feedback:", error);
            return error.message;
        }
    },
    handleBookmark: async (guideId, userId) => {
        try {
            const res = await axios.post(`${API_URL}guide/bookmark`, {guideId: guideId, userId:userId})
            console.log(res.data);
            if (res.data.message === 'created') { 
                set({isBookmarked: true});
                return;
            } else {
                set({isBookmarked: false});
            }
        } catch (error) {
            console.log("Error updating bookmark:", error);
            return error.message;
        }
    },
    getUserInfo: async (userId) => {
        try {
            set({viewUserInfoLoading: true})
            const res = await axios.get(`${API_URL}user/${userId}`);
            set({viewUserData: res.data.data});
        } catch (error) {
            console.log("Error getting user's info:", error);
            set({viewUserInfoError: "Something went wrong."})
            return error.message;
        } finally {
            set({viewUserInfoLoading: false})
        }
    },
    getUserGuides: async (userId) => {
        try {
            set({viewUserInfoLoading: true})
            const res = await axios.get(`${API_URL}guide/user-guides/${userId}`);
            console.log(res.data.data);
            set({viewUserGuides: res.data.data});
        } catch (error) {
            console.log("Error getting user's info:", error);
            set({viewUserInfoError: "Something went wrong."})
            return error.message;
        } finally {
            set({viewUserInfoLoading: false})
        }
    }
}));

export default guideStore