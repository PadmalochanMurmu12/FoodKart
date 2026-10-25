import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Product } from "../data/CardData";

export interface CartItem extends Product {
  qnty: number;
}

interface CartState {
  carts: CartItem[];
}

const initialState: CartState = {
  carts: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<Product>) => {
      const itemIndex = state.carts.findIndex((item) => item.id === action.payload.id);

      if (itemIndex >= 0) {
        // Enforce maximum quantity of 10
        if (state.carts[itemIndex].qnty < 10) {
          state.carts[itemIndex].qnty += 1;
        }
      } else {
        const temp = { ...action.payload, qnty: 1 };
        state.carts.push(temp);
      }
    },
    removeFromCart: (state, action: PayloadAction<number>) => {
      state.carts = state.carts.filter((item) => item.id !== action.payload);
    },
    incrementQuantity: (state, action: PayloadAction<number>) => {
      const item = state.carts.find((item) => item.id === action.payload);
      // Enforce maximum quantity of 10
      if (item && item.qnty < 10) {
        item.qnty += 1;
      }
    },
    decrementQuantity: (state, action: PayloadAction<number>) => {
      const item = state.carts.find((item) => item.id === action.payload);
      // Enforce minimum quantity of 1
      if (item && item.qnty > 1) {
        item.qnty -= 1;
      }
    },
    clearCart: (state) => {
      state.carts = [];
    },
  },
});

export const { addToCart, removeFromCart, incrementQuantity, decrementQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;