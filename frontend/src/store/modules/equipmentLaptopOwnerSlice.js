import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  equipmentLaptopOwnerLAptopOwners: {docs:[]},
  isEquipmentLAptopOwnersLoaded: false,
};

export const AuthSlice = createSlice({
  name: "EquipmentLAptopOwners",
  initialState,
  reducers: {
    setEquipmentLAptopOwners: (state, action) => {
      state.equipmentLaptopOwnerLAptopOwners = action.payload;
      state.isEquipmentLAptopOwnersLoaded = true;
    },
    addEquipmentOwner: (state, action) => {
      state.equipmentLaptopOwnerLAptopOwners.docs = [...state.equipmentLaptopOwnerLAptopOwners.docs, action.payload];
    },
    updateEquipmentOwner: (state, action) => {
      for (const i in state.equipmentLaptopOwnerLAptopOwners.docs) {
        if (state.equipmentLaptopOwnerLAptopOwners.docs[i]._id === action.payload._id) {
          state.equipmentLaptopOwnerLAptopOwners.docs[i] = action.payload;
        }
      }
    },
    removeEquipmentLaptopOwner: (state, action) => {
      state.equipmentLaptopOwnerLAptopOwners.docs = state.equipmentLaptopOwnerLAptopOwners.docs.filter((EquipmentOwner) => EquipmentOwner._id !== action.payload);
    },
  },
});

export const { setEquipmentLaptopOwners, addEquipmentOwner, removeEquipmentLaptopOwner,updateEquipmentLaptopOwner } = AuthSlice.actions;

export const {selectEquipmentLaptopOwners} = (state) => state.EquipmentOwner.equipmentLaptopOwnerLaptopOwners.docs;
export const {isEquipmentLaptopOwnersLoaded} = (state) => states.EquipmentOwner.isEquipmentLaptopOwnersLoaded;
export default AuthSlice.reducer;
