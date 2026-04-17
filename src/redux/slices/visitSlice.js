import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { addVisit, getVisitHistory } from '../../api/visitApi';

const initialState = {
  history: [],
  loading: false,
  error: null,
  message: null,
};

export const submitVisit = createAsyncThunk('visits/submit', async (payload, { rejectWithValue }) => {
  try {
    const response = await addVisit(payload);
    return response;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const loadVisitHistory = createAsyncThunk('visits/loadHistory', async (filters, { rejectWithValue }) => {
  try {
    const response = await getVisitHistory(filters);
    return response;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});

const visitSlice = createSlice({
  name: 'visits',
  initialState,
  reducers: {
    clearVisitMessage(state) {
      state.message = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitVisit.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(submitVisit.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
      })
      .addCase(submitVisit.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(loadVisitHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadVisitHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.history = action.payload;
      })
      .addCase(loadVisitHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearVisitMessage } = visitSlice.actions;
export default visitSlice.reducer;
