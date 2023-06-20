import { configureStore } from '@reduxjs/toolkit'
import authReducer from './modules/authSlice';
import laptopOwnerReducer from './modules/laptopOwnerSlice';
import equipmentReducer from './modules/equipmentSlice';
import equipmentLaptopOwnerReducer from './modules/equipmentLaptopOwnerSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    carOwner: laptopOwnerReducer,
    equipment: equipmentReducer,
    equipmentLaptopOwner: equipmentLaptopOwnerReducer,
  },
})