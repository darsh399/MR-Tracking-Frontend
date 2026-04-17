import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { applyLeave, fetchLeaveRequests, approveLeaveRequest } from '../../services/leaveService';

const initialState = {
  requests: [],
  loading: false,
  error: null,
  success: null,
};

export const requestLeave = createAsyncThunk(
  'leave/requestLeave',
  async (leaveData, { rejectWithValue }) => {
    try {
      const response = await applyLeave(leaveData);
      return response.leaveRequest;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const loadLeaveRequests = createAsyncThunk(
  'leave/loadLeaveRequests',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetchLeaveRequests();
      return response.leaveRequests;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const updateLeaveStatus = createAsyncThunk(
  'leave/updateLeaveStatus',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await approveLeaveRequest(id, status);
      return response.leaveRequest;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const leaveSlice = createSlice({
  name: 'leave',
  initialState,
  reducers: {
    clearLeaveMessage(state) {
      state.error = null;
      state.success = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(requestLeave.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(requestLeave.fulfilled, (state, action) => {
        state.loading = false;
        state.requests.unshift(action.payload);
        state.success = 'Leave request submitted successfully';
      })
      .addCase(requestLeave.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(loadLeaveRequests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadLeaveRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.requests = action.payload;
      })
      .addCase(loadLeaveRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateLeaveStatus.fulfilled, (state, action) => {
        state.requests = state.requests.map((request) =>
          request._id === action.payload._id ? action.payload : request
        );
        state.success = 'Leave request updated successfully';
      })
      .addCase(updateLeaveStatus.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearLeaveMessage } = leaveSlice.actions;
export default leaveSlice.reducer;
