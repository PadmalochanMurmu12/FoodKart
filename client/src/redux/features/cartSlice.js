import { createSlice } from "@reduxjs/toolkit";

// Helper to load cart from LocalStorage
const loadCart = () => {
    const savedCart = localStorage.getItem("foodKart_cart");
    return savedCart ? JSON.parse(savedCart) : [];
};

const initialState = {
    carts: loadCart() // Initialize from storage, not an empty array
};

const cartSlice = createSlice({
    name: "cartslice",
    initialState,
    reducers: {
        addToCart: (state, action) => {
            const IteamIndex = state.carts.findIndex((iteam) => iteam.id === action.payload.id);
            if (IteamIndex >= 0) {
                state.carts[IteamIndex].qnty += 1;
            } else {
                state.carts.push({ ...action.payload, qnty: 1 });
            }
            // Sync to LocalStorage
            localStorage.setItem("foodKart_cart", JSON.stringify(state.carts));
        },

        removeToCart: (state, action) => {
            state.carts = state.carts.filter((ele) => ele.id !== action.payload);
            localStorage.setItem("foodKart_cart", JSON.stringify(state.carts));
        },

        removeSingleIteams: (state, action) => {
            const index = state.carts.findIndex((item) => item.id === action.payload.id);
            if (state.carts[index].qnty > 1) {
                state.carts[index].qnty -= 1;
            } else {
                state.carts = state.carts.filter((item) => item.id !== action.payload.id);
            }
            localStorage.setItem("foodKart_cart", JSON.stringify(state.carts));
        },

        emptycartIteam: (state) => {
            state.carts = [];
            localStorage.removeItem("foodKart_cart"); // Clear storage on success/manual clear
        }
    }
});

export const { addToCart, removeToCart, removeSingleIteams, emptycartIteam } = cartSlice.actions;
export default cartSlice.reducer;