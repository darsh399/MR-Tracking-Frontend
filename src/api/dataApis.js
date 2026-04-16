import axios from 'axios';

const baseURL = 'http://localhost:5000/api/data';

const API = axios.create({
    baseURL: baseURL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});


export const registerUser = async (userData) => {
    try{
         const response = await API.post('/register', userData);
         return response.data;
    }catch(error){
        console.error('Error registering user:', error.message || error);
        throw error;
    }
}

export const loginUser = async (credential) => {
    try{
        const response = await API.post('/login', credential);
        return response.data;
    }catch(error){
        console.error('Error logging in user:', error.message || error);
        throw error;
    }
}


export const getUser = (id) => {
    try{
        const response = API.get(`/user/${id}`);
        return response.data;

    }catch(error){
        console.error('Error fetching user:', error.message || error);
        throw error;
    }
}


export const updateUser = async (id, updateData) => {
    try{
        const response = await API.put(`/user/${id}`, updateData);
        return response.data;
    }catch(error){
        console.error('Error updating user:', error.message || error);
        throw error;
    }
}

export const getAllUsers = async () => {
    try{
        const response = await API.get('/users');
        return response.data;
    }catch(error){
        console.error('Error fetching users:', error.message || error);
        throw error;
    }
}

export const getCurrentUser = async () => {
    try {
        const response = await API.get('/me');
        return response.data;
    } catch (error) {
        console.error('Error fetching current user:', error.message || error);
        throw error;
    }
}


export const logoutUser = async () => {
    try{
        const response = await API.post('/logout');
        return response.data;
    }catch(error){
        console.error('Error logging out user:', error.message || error);
        throw error;
    }
}

export const updateUserStatus = async (id) => {
    try{
        const response = await API.put(`/user/${id}/status`);
        return response.data;
    }catch(error){
        console.error('Error updating user status:', error.message || error);
        throw error;
    }
}

export const getUserById = async (id) => {
    try{
        const response = await API.get(`/user/${id}`);
        return response.data;
    }catch(error){
        console.error('Error fetching user by ID:', error.message || error);
        throw error;
    }
}