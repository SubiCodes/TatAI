import { create } from 'zustand';
import axios from 'axios';

const guideStore = create((set) => ({
    guides: [],
    guide: {},
    isLoading: false,
    message: '',
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
            set({error: error.message})
            set({message: `Something went wrong: ${error.message}`});
        } finally {
            set({isLoading: false})
        }
        
    },
    deleteGuide: async (guide, imageIDs) => {
        try {
            set({isLoading: true})
            for (const imageID of imageIDs) {
                try {
                    const deleteRes = await axios.post(`${import.meta.env.VITE_URI}guide/deleteImage`, { public_id: imageID });
                    console.log(deleteRes.data);
                } catch (deleteError) {
                    console.error('Error deleting image:', deleteError);
                }
            }
            await axios.post(`${import.meta.env.VITE_URI}guide/${guide._id}`);
            set((state) => ({
                guides: state.guides.filter((g) => g._id !== guide._id),
            }));
            return `Successfully deleted '${guide.title}' by '${guide.posterInfo.name}'`;
        } catch (error) {
            console.error(error);
            set({message: `Something went wrong: ${error.message}`});
            return `Something went wrong while deleting ${guide.title} by ${guide.posterInfo.name}`;
        } finally {
            set({isLoading: false})
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
            coverPhotoData = res.data;
          }
    
          // Upload step images
          const stepFilesData = [];
          for (const file of stepFilesArray) {
            if (file) {
              const base64 = await convertToBase64(file);
              const res = await axios.post(`${URI}guide/upload`, { data: base64 });
              stepFilesData.push(res.data);
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
            guides: [newGuide, ...state.guides]
          }));
          set({message: `Successfully Created Guide '${guideData.title}'`});
          return `Successfully created ${guideData.title}`;
        } catch (error) {
          console.error('Error creating guide:', error.message);
          set({message: `Something went wrong: ${error.message}`});
          return `Error creating ${guideData.title}: ${error.message}`;
        } finally {
          set({ isLoading: false });
        }
      },
    getGuide: async (guideID) => {
      try {
          set({ isLoading: true, guide: []});
          const res = await axios.get(`${import.meta.env.VITE_URI}guide/${guideID}`);
          console.log("guide", res.data.data);
          set({guide: res.data.data})
      } catch (error) {
          console.error(error);
          set({error: `Something went wrong: ${error.message}`});
      } finally {
        set({ isLoading: false });
      }
    },

    changeGuideStatus: async (guideID, status) => {
      try {
        // Update status on server
        const res = await axios.put(`${import.meta.env.VITE_URI}guide/guideStatus/${guideID}`, { status });
        const updatedGuide = res.data.data;
    
        // Update local state directly instead of refetching
        set((state) => {
          const updatedGuides = state.guides.map((guide) =>
            guide._id === guideID ? { ...guide, status: updatedGuide.status } : guide
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
        const res = await axios.get(`${import.meta.env.VITE_URI}guide/user-guides/${id}`);
        const newGuides = res.data.data;
    
        set({guides: newGuides, message: "User guides updated!"})
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
        set({comments: res.data.data})
      } catch (error) {
        console.log(error);
        set({error: error.message})
      } finally {
        set({isLoading: false})
      }
    },
    getGuideFeedback: async (guideID) => {
      try {
        set({ isLoading: true, error: null });
        const res = await axios.get(`${import.meta.env.VITE_URI}guide/getFeedback/${guideID}`);
        console.log(res.data.data);
        set({feedback: res.data.data})
      } catch (error) {
        console.log(error);
        set({error: error.message})
      } finally {
        set({isLoading: false})
      }
    },
    hideComment: async (commentId) => {
      try {
        set({ error: null });
        const res = await axios.put(`${import.meta.env.VITE_URI}guide/hideFeedback/${commentId}`);
        set((state) => {
          const updatedFeedback = state.feedback.map(comment => 
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
    }
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