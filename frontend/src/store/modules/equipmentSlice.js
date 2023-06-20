import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  equipment: {docs:[]},
  isEquipmentsLoaded: false,
};

export const AuthSlice = createSlice({
  name: "Equipment",
  initialState,
  reducers: {
    setEquipments: (state, action) => {
      state.equipment = action.payload;
      state.isEquipmentsLoaded = true;
    },
    addEquipment: (state, action) => {
      state.equipment.docs = [...state.equipment.docs, action.payload];
    },
    updateEquipment: (state, action) => {
      for (const i in state.equipment.docs) {
        if (state.equipment.docs[i]._id === action.payload._id) {
          state.equipment.docs[i] = action.payload;
        }
      }
    },
    removeEquipment: (state, action) => {
      state.equipment.docs = state.equipment.docs.filter((vehicle) => vehicle._id !== action.payload);
    },
  },
});

export const { setEquipments, addEquipment, removeEquipment,updateEquipment } = AuthSlice.actions;

export const selectEquipments = (state) => state.vehicle.equipment.docs;
export const isEquipmentsLoaded = (state) => states.vehicle.isEquipmentsLoaded;

export default AuthSlice.reducer;
