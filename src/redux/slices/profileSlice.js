import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { completeProfile as completeProfileApi, fetchUserProfile } from '../../services/profileService';

const initialState = {
  profile: null,
  loading: false,
  error: null,
  success: null,
};

export const completeProfile = createAsyncThunk(
  'profile/completeProfile',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await completeProfileApi(formData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const loadUserProfile = createAsyncThunk(
  'profile/loadUserProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetchUserProfile();
      return response.profile;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    resetProfileState(state) {
      state.loading = false;
      state.error = null;
      state.success = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(completeProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(completeProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload.profile;
        state.success = action.payload.message;
      })
      .addCase(completeProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(loadUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(loadUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetProfileState } = profileSlice.actions;
export default profileSlice.reducer;
