import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import visitReducer from './slices/visitSlice';
import doctorReducer from './slices/doctorSlice';
import adminReducer from './slices/adminSlice';
import profileReducer from './slices/profileSlice';
import leaveReducer from './slices/leaveSlice';

export default configureStore({
  reducer: {
    auth: authReducer,
    visits: visitReducer,
    doctors: doctorReducer,
    admin: adminReducer,
    profile: profileReducer,
    leave: leaveReducer,
  },
});
