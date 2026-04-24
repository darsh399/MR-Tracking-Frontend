import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchDashboardStats, fetchAdminVisits, fetchUsersForAdmin, approveUser, rejectUser, toggleUserStatus } from '../../api/adminApi';

const initialState = {
  stats: null,
  visits: [],
  users: [],
  loading: false,
  error: null,
};



export const loadAdminStats = createAsyncThunk('admin/loadStats', async (_, { rejectWithValue }) => {
  try {
    const response = await fetchDashboardStats();
    return response;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const loadAdminVisits = createAsyncThunk('admin/loadVisits', async (filters, { rejectWithValue }) => {
  try {
    const response = await fetchAdminVisits(filters);
    return response;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const loadAdminUsers = createAsyncThunk('admin/loadUsers', async (_, { rejectWithValue }) => {
  try {
    const response = await fetchUsersForAdmin();
    return response;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const approveAdminUser = createAsyncThunk('admin/approveUser', async (userId, { rejectWithValue }) => {
  try {
    const response = await approveUser(userId);
    return response.user;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const rejectAdminUser = createAsyncThunk('admin/rejectUser', async (userId, { rejectWithValue }) => {
  try {
    const response = await rejectUser(userId);
    return userId;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const toggleAdminUserStatus = createAsyncThunk('admin/toggleUserStatus', async (userId, { rejectWithValue }) => {
  try {
    const response = await toggleUserStatus(userId);
    return response.user;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    clearAdminError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadAdminStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadAdminStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(loadAdminStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(loadAdminVisits.pending, (state) => {
        state.loading = true;
      })
      .addCase(loadAdminVisits.fulfilled, (state, action) => {
        state.loading = false;
        state.visits = action.payload;
      })
      .addCase(loadAdminVisits.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(loadAdminUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(loadAdminUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(loadAdminUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(approveAdminUser.fulfilled, (state, action) => {
        state.users = state.users.map((user) =>
          user._id === action.payload._id ? action.payload : user
        );
      })
      .addCase(toggleAdminUserStatus.fulfilled, (state, action) => {
        state.users = state.users.map((user) =>
          user._id === action.payload._id ? action.payload : user
        );
      })
      .addCase(rejectAdminUser.fulfilled, (state, action) => {
        state.users = state.users.filter((user) => user._id !== action.payload);
      })
      .addCase(approveAdminUser.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(toggleAdminUserStatus.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(rejectAdminUser.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearAdminError } = adminSlice.actions;
export default adminSlice.reducer;
