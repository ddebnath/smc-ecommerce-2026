import Product from "@/pages/product/Product";
import { createSlice } from "@reduxjs/toolkit";

const productSlice = createSlice({
  name: "product",
  initialState: {
    products: [],
    cart: null,
  },
  reducers: {
    //actions
    setProducts: (state, action) => {
      state.products = action.payload;
    },

    setCart: (state, action) => {
      state.cart = action.payload;
    },
  },
});

export const { setProducts, setCart } = productSlice.actions;
export default productSlice.reducer;
