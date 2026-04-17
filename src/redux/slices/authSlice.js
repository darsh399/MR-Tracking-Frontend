import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { loginUser, signupUser, getUserById, fetchCurrentUser, logoutUser } from '../../api/authApi';

const storedUser = localStorage.getItem('currentUser');
const storedToken = localStorage.getItem('token');

const initialState = {
  currentUser: storedUser ? JSON.parse(storedUser) : null,
  token: storedToken || null,
  loading: false,
  error: null,
  message: null,
    selectedUser: null,
};

export const login = createAsyncThunk('auth/login', async (payload, { rejectWithValue }) => {
  try {
    const response = await loginUser(payload);
    return response;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const signup = createAsyncThunk('auth/signup', async (payload, { rejectWithValue }) => {
  try {
    const response = await signupUser(payload);
    return response;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const loadCurrentUser = createAsyncThunk('auth/loadCurrentUser', async (_, { rejectWithValue }) => {
  try {
    const response = await fetchCurrentUser();
    return response;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const logout = createAsyncThunk('auth/logout', async (_, { rejectWithValue }) => {
  try {
    const response = await logoutUser();
    return response;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const getUserByIdAction = createAsyncThunk('auth/getUserById', async (id, { rejectWithValue }) => {
  try {
    const response = await getUserById(id); 
    console.log('User data fetched by ID:', response);
    return response;
    } catch (error) {
    return rejectWithValue(error.response?.data?.message || error.message);
    }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload.user;
        state.token = action.payload.token || null;
        state.message = action.payload.message;
        localStorage.setItem('currentUser', JSON.stringify(action.payload.user));
        if (action.payload.token) {
          localStorage.setItem('token', action.payload.token);
        }
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(signup.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
      })
      .addCase(signup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(loadCurrentUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload.user;
        localStorage.setItem('currentUser', JSON.stringify(action.payload.user));
      })
      .addCase(loadCurrentUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(logout.fulfilled, (state) => {
        state.currentUser = null;
        state.token = null;
        state.error = null;
        state.message = null;
        localStorage.removeItem('currentUser');
        localStorage.removeItem('token');
      })
      .addCase(logout.rejected, (state, action) => {
        state.error = action.payload;
      }).addCase(getUserByIdAction.pending, (state) => {
        state.loading = true;
        state.error = null;
      }
        ).addCase(getUserByIdAction.fulfilled, (state, action) => { 
            state.loading = false;
            state.selectedUser = action.payload;
        }).addCase(getUserByIdAction.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
