import Product from "@/pages/product/Product";
import { createSlice } from "@reduxjs/toolkit";

const productSlice = createSlice({
  name: "product",
  initialState: {
    products: [],
    cart: null,
    addresses: [],
    selectedAddress: 0,
  },
  reducers: {
    //actions
    setProducts: (state, action) => {
      state.products = action.payload;
    },

    setCart: (state, action) => {
      state.cart = action.payload;
    },

    // address management
    addAddresses: (state, action) => {
      if (!state.addresses) state.addresses = [];
      state.addresses.push(action.payload);
    },

    // selected address
    setSelectedAddress: (state, action) => {
      state.selectedAddress = action.payload;
    },

    setDeleteAddress: (state, action) => {
      state.addresses = state.addresses.filter(
        (_, index) => index != action.payload,
      );

      // reset selected address if it was deleted
      if (state.selectedAddress === action.payload) {
        state.selectedAddress = null;
      }
    },
  },
});

export const {
  setProducts,
  setCart,
  addAddresses,
  setSelectedAddress,
  setDeleteAddress,
} = productSlice.actions;
export default productSlice.reducer;
