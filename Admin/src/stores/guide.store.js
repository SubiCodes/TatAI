import { create } from "zustand";
import axios from "axios";

const guideStore = create((set) => ({
  guides: [],
  guide: {},
  isLoading: false,
  message: "",
  error: null,
  comments: [],
  feedback: null,
  fetchGuides: async () => {
    try {
      set({ isLoading: true, guides: [] });
      const res = await axios.get(`${import.meta.env.VITE_URI}guide`);
      const data = res.data.data;
      set({ guides: data, message: "Successfully fetched guides." });
    } catch (error) {
      set({ error: error.message });
      set({ message: `Something went wrong: ${error.message}` });
    } finally {
      set({ isLoading: false });
    }
  },
  deleteGuide: async (guide, imageIDs) => {
    try {
      set({ isLoading: true });

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
            `${import.meta.env.VITE_URI}guide/deleteImage`,
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
        `${import.meta.env.VITE_URI}guide/${guide._id}`
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
      set({ isLoading: false });
    }
  },
  createGuide: async (guideData, coverPhotoFile, stepFilesArray) => {
    try {
      set({ isLoading: true });

      const URI = import.meta.env.VITE_URI;

      // Upload cover photo
      let coverPhotoData = null;
      if (coverPhotoFile) {
        const base64 = await convertToBase64(coverPhotoFile);
        const res = await axios.post(`${URI}guide/upload`, { data: base64 });
        coverPhotoData = {
          ...res.data,
          mimeType: coverPhotoFile.type, // optional
        };
      }

      // ✅ Upload step media files (images or videos)
      const stepFilesData = [];
      for (const file of stepFilesArray) {
        if (file) {
          const base64 = await convertToBase64(file);
          const res = await axios.post(`${URI}guide/upload`, { data: base64 });
          stepFilesData.push({
            ...res.data,
            mimeType: file.type, // e.g., video/mp4 or image/jpeg
          });
        } else {
          stepFilesData.push(null);
        }
      }

      // Create guide
      const res = await axios.post(
        `${URI}guide/create`,
        {
          ...guideData,
          coverImg: coverPhotoData || {},
          stepImg: stepFilesData.filter(Boolean),
        },
        { withCredentials: true }
      );

      const newGuide = res.data.guide;
      set((state) => ({
        guides: [newGuide, ...state.guides],
      }));
      set({ message: `Successfully Created Guide '${guideData.title}'` });
      return `Successfully created ${guideData.title}`;
    } catch (error) {
      console.error("Error creating guide:", error.message);
      set({ message: `Something went wrong: ${error.message}` });
      return `Error creating ${guideData.title}: ${error.message}`;
    } finally {
      set({ isLoading: false });
    }
  },

  getGuide: async (guideID) => {
    try {
      set({ isLoading: true, guide: [] });
      const res = await axios.get(
        `${import.meta.env.VITE_URI}guide/${guideID}`
      );
      console.log("guide", res.data.data);
      set({ guide: res.data.data });
    } catch (error) {
      console.error(error);
      set({ error: `Something went wrong: ${error.message}` });
    } finally {
      set({ isLoading: false });
    }
  },

  updateGuide: async (
    guideID,
    guideData,
    coverPhotoFile,
    stepFilesArray,
    deletedStepImageIds = []
  ) => {
    set({ isLoading: true });

    try {
      const URI = import.meta.env.VITE_URI;

      // Delete explicitly removed step images or videos
      for (const public_id of deletedStepImageIds) {
        try {
          await axios.post(`${URI}guide/deleteImage`, { public_id });
        } catch (err) {
          console.error(
            `Failed to delete explicitly removed image with ID ${public_id}:`,
            err.message
          );
        }
      }

      // Handle cover photo
      let coverPhotoData = guideData.coverImg;
      if (coverPhotoFile) {
        if (guideData.coverImg?.public_id) {
          try {
            await axios.post(`${URI}guide/deleteImage`, {
              public_id: guideData.coverImg.public_id,
            });
          } catch (err) {
            console.error(`Failed to delete old cover photo:`, err.message);
          }
        }

        const base64 = await convertToBase64(coverPhotoFile);
        const res = await axios.post(`${URI}guide/upload`, { data: base64 });
        coverPhotoData = res.data;
      }

      // Trim step data to valid step count
      const validStepCount = guideData.stepTitles.length;
      const allStepImgs = guideData.stepImg || [];

      // Delete any excess step images from Cloudinary
      const excessStepImgs = allStepImgs.slice(validStepCount);
      for (const img of excessStepImgs) {
        if (img?.public_id) {
          try {
            await axios.post(`${URI}guide/deleteImage`, {
              public_id: img.public_id,
            });
          } catch (err) {
            console.error(
              `Failed to delete excess step image with ID ${img.public_id}:`,
              err.message
            );
          }
        }
      }

      const stepFilesData = allStepImgs.slice(0, validStepCount);
      const trimmedStepFilesArray = stepFilesArray.slice(0, validStepCount);

      for (let i = 0; i < trimmedStepFilesArray.length; i++) {
        const file = trimmedStepFilesArray[i];

        if (file) {
          // Check if file is a valid Blob or File
          if (!(file instanceof Blob)) {
            console.error(`Invalid file at index ${i}. Skipping upload.`);
            continue;
          }

          // If there was a previously uploaded image/video and a new file is being uploaded
          if (stepFilesData[i]?.public_id) {
            try {
              await axios.post(`${URI}guide/deleteImage`, {
                public_id: stepFilesData[i].public_id,
              });
            } catch (err) {
              console.error(
                `Failed to delete previous step image at index ${i}:`,
                err.message
              );
            }
          }

          // Handle file upload
          const base64 = await convertToBase64(file);
          const res = await axios.post(`${URI}guide/upload`, { data: base64 });

          stepFilesData[i] = {
            url: res.data.url,
            public_id: res.data.public_id,
          };
        }
      }

      const res = await axios.post(`${URI}guide/edit-guide`, {
        guideID,
        userID: guideData.userID,
        ...guideData,
        coverImg: coverPhotoData,
        stepImg: stepFilesData,
      });

      set({
        message: `Successfully updated guide '${guideData.title}'`,
        guide: res.data.guide,
      });

      return `Guide '${guideData.title}' updated.`;
    } catch (error) {
      console.error("Error updating guide:", error.message);
      set({ message: `Something went wrong: ${error.message}` });
      return `Error: ${error.message}`;
    } finally {
      set({ isLoading: false });
    }
  },

  changeGuideStatus: async (guideID, status) => {
    try {
      // Update status on server
      const res = await axios.put(
        `${import.meta.env.VITE_URI}guide/guideStatus/${guideID}`,
        { status }
      );
      const updatedGuide = res.data.data;

      // Update local state directly instead of refetching
      set((state) => {
        const updatedGuides = state.guides.map((guide) =>
          guide._id === guideID
            ? { ...guide, status: updatedGuide.status }
            : guide
        );
        return {
          guide: { ...state.guide, status: updatedGuide.status },
          guides: updatedGuides,
          isLoading: true,
        };
      });

      return `Successfully updated guide status to ${status}.`;
    } catch (error) {
      console.error(error);
      set({ message: `Something went wrong: ${error.message}` });
      return `Something went wrong while changing status.`;
    } finally {
      set({ isLoading: false });
    }
  },
  getUserGuides: async (id) => {
    try {
      set({ isLoading: true });
      const res = await axios.get(
        `${import.meta.env.VITE_URI}guide/user-guides/${id}`
      );
      const newGuides = res.data.data;

      set({ guides: newGuides, message: "User guides updated!" });
    } catch (error) {
      console.error(error);
    } finally {
      set({ isLoading: false });
    }
  },
  getComments: async () => {
    try {
      set({ isLoading: true, error: null });
      const res = await axios.get(
        `${import.meta.env.VITE_URI}guide/getAllComments`
      );
      console.log(res.data.data);
      set({ comments: res.data.data });
    } catch (error) {
      console.log(error);
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },
  getGuideFeedback: async (guideID) => {
    try {
      set({ isLoading: true, error: null });
      const res = await axios.get(
        `${import.meta.env.VITE_URI}guide/getFeedback/${guideID}`
      );
      console.log(res.data.data);
      set({ feedback: res.data.data });
    } catch (error) {
      console.log(error);
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },
  hideComment: async (commentId) => {
    try {
      set({ error: null });
      const res = await axios.put(
        `${import.meta.env.VITE_URI}guide/hideFeedback/${commentId}`
      );
      set((state) => {
        const updatedFeedback = state.feedback.map((comment) =>
          comment._id === commentId
            ? { ...comment, hidden: !comment.hidden }
            : comment
        );
        return { feedback: updatedFeedback };
      });
      console.log(res.data.data);
    } catch (error) {
      console.log(error);
    }
  },
}));

//helper function
const convertToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

export default guideStore;
