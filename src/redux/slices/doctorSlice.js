import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchDoctors, createDoctor, updateDoctor, deleteDoctor } from '../../api/doctorApi';

const initialState = {
  doctors: [],
  loading: false,
  error: null,
  message: null,
};

export const loadDoctors = createAsyncThunk('doctors/load', async (_, { rejectWithValue }) => {
  try {
    const response = await fetchDoctors();
    return response;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const addDoctor = createAsyncThunk('doctors/add', async (payload, { rejectWithValue }) => {
  try {
    const response = await createDoctor(payload);
    return response.doctor;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const editDoctor = createAsyncThunk('doctors/edit', async ({ id, data }, { rejectWithValue }) => {
  try {
    const response = await updateDoctor(id, data);
    return response.doctor;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const removeDoctor = createAsyncThunk('doctors/remove', async (id, { rejectWithValue }) => {
  try {
    await deleteDoctor(id);
    return id;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});

const doctorSlice = createSlice({
  name: 'doctors',
  initialState,
  reducers: {
    clearDoctorMessage(state) {
      state.message = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadDoctors.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadDoctors.fulfilled, (state, action) => {
        state.loading = false;
        state.doctors = action.payload;
      })
      .addCase(loadDoctors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addDoctor.fulfilled, (state, action) => {
        state.doctors.push(action.payload);
        state.message = 'Doctor created successfully';
      })
      .addCase(addDoctor.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(editDoctor.fulfilled, (state, action) => {
        state.doctors = state.doctors.map((doctor) =>
          doctor._id === action.payload._id ? action.payload : doctor
        );
        state.message = 'Doctor updated successfully';
      })
      .addCase(editDoctor.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(removeDoctor.fulfilled, (state, action) => {
        state.doctors = state.doctors.filter((doctor) => doctor._id !== action.payload);
        state.message = 'Doctor deleted successfully';
      })
      .addCase(removeDoctor.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearDoctorMessage } = doctorSlice.actions;
export default doctorSlice.reducer;
