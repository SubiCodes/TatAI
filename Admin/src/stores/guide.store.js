import { create } from 'zustand';
import axios from 'axios';

const guideStore = create((set) => ({
    guides: [],
    guide: {},
    isLoading: false,
    message: '',
    error: null,
    fetchGuides: async () => {
        try {
            set({isLoading: true})
            const res = await axios.get(`${import.meta.env.VITE_URI}guide`);
            const data = res.data.data;
            set({guides: data});
            set({message: `Successfully fetched guides.'`});
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
          set({ isLoading: true });
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
          const res = await axios.put(`${import.meta.env.VITE_URI}guide/guideStatus/${guideID}`, { status: status });
          console.log(res.data.data);
          const newGuide = await axios.get(`${import.meta.env.VITE_URI}guide/${guideID}`);
          const newGuideList = await axios.get(`${import.meta.env.VITE_URI}guide`);
          set({ isLoading: true, guide: newGuide.data.data, guides: newGuideList.data.data });
          return `Successfully updated guide status to ${status}.`;
      } catch (error) {
          console.error(error);
          set({message: `Something went wrong: ${error.message}`});
          return `Something went wrong while changing status.`;
      } finally {
        set({ isLoading: false });
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