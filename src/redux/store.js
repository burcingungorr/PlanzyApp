import { configureStore } from '@reduxjs/toolkit';
import usernameReducer from './slices/usernameSlice';

const store = configureStore({
  reducer: {
    user: usernameReducer,
  },
});

export default store;
