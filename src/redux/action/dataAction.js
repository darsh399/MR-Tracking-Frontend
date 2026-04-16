export const REGISTER_USER_REQUEST = 'REGISTER_USER_REQUEST';
export const REGISTER_USER_SUCCESS = 'REGISTER_USER_SUCCESS';
export const REGISTER_USER_FAILURE = 'REGISTER_USER_FAILURE';

export const REQUEST_UPDATE_USER_STATUS_REQUEST = 'REQUEST_UPDATE_USER_STATUS_REQUEST';
export const REQUEST_UPDATE_USER_STATUS_SUCCESS = 'REQUEST_UPDATE_USER_STATUS_SUCCESS'; 
export const REQUEST_UPDATE_USER_STATUS_FAILURE = 'REQUEST_UPDATE_USER_STATUS_FAILURE';

export const LOGIN_USER_REQUEST = 'LOGIN_USER_REQUEST';
export const LOGIN_USER_SUCCESS = 'LOGIN_USER_SUCCESS';
export const LOGIN_USER_FAILURE = 'LOGIN_USER_FAILURE';

export const getUserById_REQUEST = 'GET_USER_BY_ID_REQUEST';
export const getUserById_SUCCESS = 'GET_USER_BY_ID_SUCCESS';
export const getUserById_FAILURE = 'GET_USER_BY_ID_FAILURE';

export const FETCH_USERS_REQUEST = 'FETCH_USERS_REQUEST';
export const FETCH_USERS_SUCCESS = 'FETCH_USERS_SUCCESS';
export const FETCH_USERS_FAILURE = 'FETCH_USERS_FAILURE';

export const UPDATE_USER_REQUEST = 'UPDATE_USER_REQUEST';
export const UPDATE_USER_SUCCESS = 'UPDATE_USER_SUCCESS';
export const UPDATE_USER_FAILURE = 'UPDATE_USER_FAILURE';

export const REQUEST_CURRENT_USER_REQUEST = 'REQUEST_CURRENT_USER_REQUEST';
export const REQUEST_CURRENT_USER_SUCCESS = 'REQUEST_CURRENT_USER_SUCCESS';
export const REQUEST_CURRENT_USER_FAILURE = 'REQUEST_CURRENT_USER_FAILURE';

export const LOGOUT_USER_REQUEST = 'LOGOUT_USER_REQUEST';
export const LOGOUT_USER_SUCCESS = 'LOGOUT_USER_SUCCESS';
export const LOGOUT_USER_FAILURE = 'LOGOUT_USER_FAILURE';

import { registerUser, updateUserStatus, loginUser, getAllUsers, updateUser, getCurrentUser,getUserById, logoutUser } from "../../api/dataApis";


export const registerUserAction = (userData) => {
    return async (dispatch) => {
        try{
            console.log('Registering user with data:', userData);
            dispatch({ type: REGISTER_USER_REQUEST });
            const response = await registerUser(userData);
            dispatch({ type: REGISTER_USER_SUCCESS, payload: response.user ?? null });
        }catch(error){
                dispatch({ type: REGISTER_USER_FAILURE, payload: error.message || 'Error registering user' });
        }
    }
}

export const requestCurrentUserAction = () => {
    return async (dispatch) => {
        try{
            dispatch({ type: REQUEST_CURRENT_USER_REQUEST });
            const response = await getCurrentUser();
            dispatch({ type: REQUEST_CURRENT_USER_SUCCESS, payload: response });
        }catch(error){
            dispatch({ type: REQUEST_CURRENT_USER_FAILURE, payload: error.message || 'Error fetching current user' });
        }
    }
}

export const loginUserAction = (loginData) => {
    console.log('Login data being sent to action:', loginData);
    return async (dispatch) => {
        try {
            dispatch({ type: LOGIN_USER_REQUEST });
            const response = await loginUser(loginData);
            console.log('Login response:', response);
            dispatch({ type: LOGIN_USER_SUCCESS, payload: response.user });
            return response;
        } catch (error) {
            dispatch({ type: LOGIN_USER_FAILURE, payload: error.message || 'Error logging in user' });
            throw error;
        }
    };
}


export const fetchUsersAction = () => {
    return async (dispatch) => {
        try{    
            dispatch({type: FETCH_USERS_REQUEST});
            const response = await getAllUsers();
            dispatch({type: FETCH_USERS_SUCCESS, payload: response});
        }catch(error){
            dispatch({type: FETCH_USERS_FAILURE, payload: error.message || 'Error fetching users'});
        }   
    }
}


export const updateUserAction = (id, updateData) => {
    return async (dispatch) => {
        try{    
            dispatch({type: UPDATE_USER_REQUEST});
            const response = await updateUser(id, updateData);
            dispatch({type: UPDATE_USER_SUCCESS, payload: response});
        }catch(error){
            dispatch({type: UPDATE_USER_FAILURE, payload: error.message || 'Error updating user'});
        }
    }
}


export const logoutUserAction = () => {
    return async (dispatch) => {
        try{
            dispatch({type: LOGOUT_USER_REQUEST});
            const res =await logoutUser();
            dispatch({type: LOGOUT_USER_SUCCESS, payload: res});
            return res;
        }catch(error){
            dispatch({type: LOGOUT_USER_FAILURE, payload: error.message || 'Error logging out user'});
            throw error;
        }
    }
}

export const getUserByIdAction = (id) => {
    console.log('getUserByIdAction called with ID:', id);
    return async (dispatch) => {
        try{
            dispatch({ type: getUserById_REQUEST });
            console.log('Dispatching getUserById_REQUEST for ID:', id);    
            const response = await getUserById(id);
            console.log('Fetched user by ID:', response);
            dispatch({ type: getUserById_SUCCESS, payload: response });
        }catch(error){
            dispatch({ type: getUserById_FAILURE, payload: error.message || 'Error fetching user by ID' });
        }
    }
}


export const updateUserStatusAction = (id) => {
    return async (dispatch) => {
        try{    
            dispatch({ type: REQUEST_UPDATE_USER_STATUS_REQUEST });
            const response = await updateUserStatus(id);
            dispatch({ type: REQUEST_UPDATE_USER_STATUS_SUCCESS, payload: response });
        }catch(error){
            dispatch({ type: REQUEST_UPDATE_USER_STATUS_FAILURE, payload: error.message || 'Error updating user status' });
        }
    }
}
