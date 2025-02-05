import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import taskReducer from "./taskSlice";

// Configure the Redux store
const store = configureStore({
  reducer: {
    auth: authReducer, // Handles authentication state
    tasks: taskReducer, // Handles task-related state
  },
});

export default store;