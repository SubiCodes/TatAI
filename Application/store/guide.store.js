import { create } from "zustand";
import axios from "axios";
import Constants from "expo-constants";
import { Alert } from "react-native";
import * as FileSystem from "expo-file-system";

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
  bookmarkedGuides: [],
  isFetchingBookmarkedGuides: null,
  fetchingBookmarkedGuidesError: null,
  isPosting: false,
  isDeleting: false,
  getAllGuides: async () => {
    try {
      set({ isFetchingGuides: true, errorFetchingGuides: null });
      const res = await axios.get(`${API_URL}guide/accepted`);
      set({ guides: res.data.data });
    } catch (error) {
      console.log(error.message);
      set({ errorFetchingGuides: error.message });
    } finally {
      set({ isFetchingGuides: false });
    }
  },
  getLatestGuide: async () => {
    try {
      set({ isFetchingGuides: true, errorFetchingGuides: null });
      const res = await axios.post(`${API_URL}guide/latest`, { amount: 5 });
      set({ latestGuides: res.data.data });
    } catch (error) {
      console.log(error.message);
      set({ errorFetchingGuides: error.message });
    } finally {
      set({ isFetchingGuides: false });
    }
  },
  getLatestGuidePerType: async (type) => {
    try {
      set({ isFetchingGuides: true, errorFetchingGuides: null });
      const res = await axios.post(`${API_URL}guide/pertype`, {
        type: type,
        amount: 5,
      });
      if (type === "repair") set({ repairGuides: res.data.data });
      if (type === "diy") set({ diyGuides: res.data.data });
      if (type === "cooking") set({ cookingGuides: res.data.data });
      if (type === "tool") set({ toolGuides: res.data.data });
    } catch (error) {
      console.log("error in repair fetch", error.message);
      set({ errorFetchingGuides: error.message });
    } finally {
      set({ isFetchingGuides: false });
    }
  },

  getLatestGuidePerTypeAll: async (type) => {
    try {
      set({ isFetchingGuides: true, errorFetchingGuides: null });
      const res = await axios.post(`${API_URL}guide/pertype`, { type: type });
      set({ guides: res.data.data });
    } catch (error) {
      console.log("error in repair fetch", error.message);
      set({ errorFetchingGuides: error.message });
    } finally {
      set({ isFetchingGuides: false });
    }
  },
  getGuide: async (id, navigation, userID) => {
    try {
      set({ isFetchingGuides: true, errorFetchingGuides: null, guide: null });
      const res = await axios.get(`${API_URL}guide/${id}`);
      if (
        res.data.data?.status !== "accepted" &&
        userID !== res.data.data.userID
      ) {
        Alert.alert(
          "Guide not accepted",
          "This guide is currently unavailable because its status is either Pending or Rejected.",
          [
            {
              text: "OK",
              onPress: async () => {
                navigation.goBack();
              },
            },
          ],
          { cancelable: false }
        );
        return;
      }
      set({ guide: res.data.data });
    } catch (error) {
      Alert.alert(
        "Unable to view Guide",
        "This guide might no longer exist.",
        [
          {
            text: "OK",
            onPress: async () => {
              navigation.goBack();
            },
          },
        ],
        { cancelable: false }
      );
      console.log("error ins get guide", error.message);
    } finally {
      set({ isFetchingGuides: false });
    }
  },
  getFeedbacks: async (guideID) => {
    try {
      set({ isFetchingFeedbacks: true, errorFetchingFeedbacks: null });
      const res = await axios.get(`${API_URL}guide/getFeedback/${guideID}`);
      set({ feedbacks: res.data.data });
    } catch (error) {
      console.log("error in get feedback", error.message);
      set({ errorFetchingFeedbacks: error.message });
    } finally {
      set({ isFetchingFeedbacks: false });
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
      const res = await axios.post(`${API_URL}guide/delete-rating`, {
        guideId: guideId,
        userId: userId,
      });
    } catch (error) {
      console.log("Error updating feedback:", error);
      return error.message;
    }
  },
  checkIfBookmarked: async (guideId, userId) => {
    try {
      const res = await axios.post(`${API_URL}guide/is-bookmarked`, {
        guideId: guideId,
        userId: userId,
      });
      set({ isBookmarked: res.data.isBookmarked });
      return res.data.isBookmarked;
    } catch (error) {
      console.log("Error updating feedback:", error);
      return error.message;
    }
  },
  handleBookmark: async (guideId, userId) => {
    try {
      const res = await axios.post(`${API_URL}guide/bookmark`, {
        guideId: guideId,
        userId: userId,
      });
      if (res.data.message === "created") {
        set({ isBookmarked: true });
        return;
      } else {
        set({ isBookmarked: false });
      }
    } catch (error) {
      console.log("Error updating bookmark:", error);
      return error.message;
    }
  },
  getUserInfo: async (userId) => {
    try {
      set({ viewUserInfoLoading: true });
      const res = await axios.get(`${API_URL}user/${userId}`);
      set({ viewUserData: res.data.data });
    } catch (error) {
      console.log("Error getting user's info:", error);
      set({ viewUserInfoError: "Something went wrong." });
      return error.message;
    } finally {
      set({ viewUserInfoLoading: false });
    }
  },
  getUserGuides: async (userId) => {
    try {
      set({ viewUserInfoLoading: true });
      const res = await axios.get(
        `${API_URL}guide/user-guides-accepted/${userId}`
      );
      set({ viewUserGuides: res.data.data });
    } catch (error) {
      console.log("Error getting user's info:", error);
      set({ viewUserInfoError: "Something went wrong." });
      return error.message;
    } finally {
      set({ viewUserInfoLoading: false });
    }
  },
  getUserGuidesAll: async (userId) => {
    try {
      set({ viewUserInfoLoading: true });
      const res = await axios.get(`${API_URL}guide/user-guides/${userId}`);
      set({ viewUserGuides: res.data.data });
    } catch (error) {
      console.log("Error getting user's info:", error);
      set({ viewUserInfoError: "Something went wrong." });
      return error.message;
    } finally {
      set({ viewUserInfoLoading: false });
    }
  },
  getBookmarkedGuides: async (userId) => {
    try {
      set({ isFetchingBookmarkedGuides: true });
      const res = await axios.post(`${API_URL}guide/get-bookmarked-guides`, {
        userId: userId,
      });
      set({ bookmarkedGuides: res.data.data });
    } catch (error) {
      console.log("Error getting user's info:", error);
      set({ fetchingBookmarkedGuidesError: "Something went wrong." });
      return error.message;
    } finally {
      set({ isFetchingBookmarkedGuides: false });
    }
  },
  createGuide: async (guideData, coverImageUri, stepMediaArray) => {
    try {
      set({ isPosting: true });

      // Format the cover image properly if it exists
      let coverPhotoData = null;
      if (coverImageUri) {
        try {
          // Create a proper media item object from the URI string
          const coverMediaItem = {
            uri: coverImageUri,
            type: "image",
          };

          console.log("Processing cover photo:", coverMediaItem);
          const base64 = await convertToBase64(coverMediaItem);
          const res = await axios.post(`${API_URL}guide/upload`, {
            data: base64,
          });
          coverPhotoData = {
            ...res.data,
            mimeType: "image/jpeg", // Default for cover images
          };
        } catch (error) {
          console.error("Failed to process cover photo:", error);
          // Continue with the process even if cover photo fails
        }
      }

      // Handle step media files
      const stepFilesData = [];
      if (Array.isArray(stepMediaArray)) {
        for (let i = 0; i < stepMediaArray.length; i++) {
          const mediaItem = stepMediaArray[i];
          try {
            if (mediaItem && mediaItem.uri) {
              console.log(`Processing step media ${i + 1}:`, mediaItem);
              const base64 = await convertToBase64(mediaItem);
              const res = await axios.post(`${API_URL}guide/upload`, {
                data: base64,
              });
              stepFilesData.push({
                ...res.data,
                mimeType:
                  mediaItem.type === "video" ? "video/mp4" : "image/jpeg",
              });
            } else {
              console.log(`Skipping empty step media at index ${i}`);
            }
          } catch (error) {
            console.error(`Failed to process step media ${i + 1}:`, error);
            // Continue processing other files even if this one fails
          }
        }
      } else {
        console.warn("stepMediaArray is not an array:", stepMediaArray);
      }

      // Prepare final payload
      const payload = {
        ...guideData,
        coverImg: coverPhotoData || {},
        stepImg: stepFilesData.filter(Boolean),
      };

      console.log("Sending guide creation request");

      const res = await axios.post(`${API_URL}guide/create`, payload, {
        withCredentials: true,
      });

      const newGuide = res.data.guide;
      set((state) => ({
        guides: [newGuide, ...state.guides],
      }));

      const successMessage = `Successfully created "${guideData.title}"`;
      set({ message: successMessage });
      Alert.alert("Success", successMessage);
      return true;
    } catch (error) {
      const errorMessage = `Failed to create guide: ${error.message}`;
      console.error("Error creating guide:", errorMessage);
      set({ message: errorMessage });
      Alert.alert("Error", errorMessage);
      return errorMessage;
    } finally {
      set({ isPosting: false });
    }
  },
  deleteGuide: async (guide, imageIDs) => {
    try {
      set({isDeleting: true});
      // Check if imageIDs is valid
      if (!Array.isArray(imageIDs) || imageIDs.length === 0) {
        console.error("No images to delete");
        return `No images associated with guide '${guide.title}'`;
      }

      // Delete associated images first
      for (const { public_id, url } of imageIDs) {
        if (!public_id || !url) {
          console.error(`Invalid image data: public_id or url missing`);
          continue; // Skip this image if it's invalid
        }
        try {
          const deleteRes = await axios.post(
            `${API_URL}guide/deleteImage`,
            {
              images: [{ public_id, url }], // Send an array of images as expected by backend
            }
          );
          console.log(deleteRes.data);
        } catch (deleteError) {
          console.error("Error deleting media:", deleteError);
          // Continue deleting other images even if one fails
        }
      }

      // Delete the guide itself
      const guideDeleteRes = await axios.post(
        `${API_URL}guide/${guide._id}`
      );
      console.log(guideDeleteRes.data);

      // Update state to remove the deleted guide
      set((state) => ({
        guides: state.guides.filter((g) => g._id !== guide._id),
      }));

      return `Successfully deleted '${guide.title}' by '${guide.posterInfo.name}'`;
    } catch (error) {
      console.error(error);
      set({ message: `Something went wrong: ${error.message}` });
      return `Something went wrong while deleting '${guide.title}' by '${guide.posterInfo.name}'`;
    } finally {
      set({isDeleting: false});
    }
  },
}));

const convertToBase64 = async (mediaItem) => {
  try {
    // Validate we have a media item with a URI
    if (!mediaItem || !mediaItem.uri) {
      console.error("Invalid media item or missing URI:", mediaItem);
      throw new Error("Invalid media item: missing URI");
    }

    const uri = mediaItem.uri;
    console.log("Converting file to base64:", uri);

    // Read the file as base64
    const base64 = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    // Set the correct MIME type based on the media type
    const mimeType =
      mediaItem.type === "video"
        ? "video/mp4" // Default video type
        : "image/jpeg"; // Default image type

    return `data:${mimeType};base64,${base64}`;
  } catch (error) {
    console.error("Base64 conversion error:", error);
    throw error;
  }
};
export default guideStore;
