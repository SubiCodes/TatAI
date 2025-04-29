import { create } from 'zustand';
import axios from 'axios';

const userStore = create((set) => ({
    users: [],
    user: null,
    isLoading: false,
    message: null,
    addUser: async (firstName, lastName, gender, date, email, password, role) => {
        try {
            set({ isLoading: true });
    
            const res = await axios.post(`${import.meta.env.VITE_URI}admin/add-account`, {
                firstName,
                lastName,
                gender,
                birthday: date,
                email,
                password,
                role
            });
    
            const newUser = res.data.data;
    
            set((state) => ({
                users: [...state.users, newUser],
                message: `Successfully added ${email}.`,
                isLoading: false
            }));
    
            return `Successfully added ${email}`;
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Something went wrong.";
            console.error("Add failed:", errorMessage);
    
            set({ message: errorMessage, isLoading: false });
            return errorMessage;
        }
    },
    fetchUsers: async () => {
        try {
            set({ isLoading: true });
            const res = await axios.get(`${import.meta.env.VITE_URI}user`);
            console.log(res.data.data);
            set({users: res.data.data})
            const successMessage = `Successfully loaded users.`;
            set({ message: successMessage, isLoading: false });
            return successMessage;
          } catch (error) {
            const errorMessage = error.response?.data?.message || "Something went wrong.";
            console.error("Add failed:", errorMessage);
            set({ message: errorMessage, isLoading: false });
            return errorMessage;
          } finally {
            set({ isLoading: false });
          }
    },
    changeUserRole: async (user, newRole) => {
        try {
            const res = await axios.post(`${import.meta.env.VITE_URI}admin/role-change/${user._id}`, {
                role: newRole
            });
    
            const updatedUser = res.data.data;
    
            set((state) => ({
                users: state.users.map((u) =>
                    u._id === updatedUser._id ? updatedUser : u
                ),
                message: `Successfully updated ${updatedUser.email} to ${updatedUser.role}`
            }));
    
            return `Successfully updated ${updatedUser.email} to ${updatedUser.role}`;
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Something went wrong.";
            console.error("Role change failed:", errorMessage);
            set({ message: errorMessage, isLoading: false });
            return errorMessage;
        }
    },
    changeUserStatus: async (userID, action, email) => {
        try {
            set({ isLoading: true });
            const res = await axios.post(`${import.meta.env.VITE_URI}admin/status-change/${userID}`, {action: action});
            const updatedUser = res.data.data;
    
            set((state) => ({
                users: state.users.map((u) =>
                    u._id === updatedUser._id ? updatedUser : u
                ),
                message: `Successfully updated ${updatedUser.email} to ${updatedUser.role}`
            }));
    
            return `Successfully updated ${email} status to ${action}`;
        } catch (error) {
            set({ isLoading: false });
            const errorMessage = error.response?.data?.message || "Something went wrong.";
            console.error("Role change failed:", errorMessage);
            set({ message: errorMessage, isLoading: false });
            return errorMessage;
        } finally {
            set({ isLoading: false });
        }
    },
    deleteUser: async (user) => {
        try {
            set({ isLoading: true });
    
            const res = await axios.post(`${import.meta.env.VITE_URI}admin/delete-account/${user._id}`);
            console.log(res);
    
            set((state) => ({
                users: state.users.filter((u) => u._id !== user._id),
                message: `Successfully deleted ${user.email}`
            }));
    
            return `Successfully deleted ${user.email}`;
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Something went wrong.";
            console.error("Delete failed:", errorMessage);
    
            set({ message: errorMessage });
            return errorMessage;
        } finally {
            set({ isLoading: false });
        }
    },
    getUserData: async (id) => {
        try {
            set({ isLoading: true });
            const res = await axios.get(`${import.meta.env.VITE_URI}user/${id}`);
            set({user: res.data.data})
            return `Successfully loaded user.`;
          } catch (error) {
            const errorMessage = error.response?.data?.message || "Something went wrong.";
            console.error("Delete failed:", errorMessage);
            set({ message: errorMessage });
            return errorMessage;
          } finally {
            set({ isLoading: false });
          }
    }
}));

export default userStore;