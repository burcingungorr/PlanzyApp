import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

export const fetchUserInfo = createAsyncThunk(
  'user/fetchUserInfo',
  async (_, thunkAPI) => {
    try {
      const userId = auth().currentUser?.uid;

      const userDoc = await firestore().collection('users').doc(userId).get();
      if (userDoc.exists) {
        const data = userDoc.data();

        const formattedData = {
          ...data,
          createdAt: data.createdAt?.toDate().toISOString() || null,
        };

        return formattedData;
      }
      return null;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);

const usernameSlice = createSlice({
  name: 'user',
  initialState: {
    userInfo: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearUserInfo(state) {
      state.userInfo = null;
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchUserInfo.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserInfo.fulfilled, (state, action) => {
        state.userInfo = action.payload;
        state.loading = false;
      })
      .addCase(fetchUserInfo.rejected, (state, action) => {
        state.error = action.payload || 'Bir hata oluştu';
        state.loading = false;
      });
  },
});

export const { clearUserInfo } = usernameSlice.actions;

export default usernameSlice.reducer;
