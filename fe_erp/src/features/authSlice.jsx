import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import config from '../config'


      

const initialState = {
  token: null,
  loading: false,
  errorMessage: null,
}

export const signin = createAsyncThunk(
  "user/signin",
  async (params = {}, { rejectWithValue }) => {
    const apiUrl = config.apiBaseUrl
    try {
      const response = await axios.post(apiUrl + "signin", params);
      return response.data;
    } catch (err) {
      if (!err.response) {
        throw err;
      }
      return rejectWithValue(err.response.data);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(signin.pending, (state) => {
        state.loading = true;
        state.token = null
      })
      .addCase(signin.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.data.token;
        state.errorMessage = null;
      })
      .addCase(signin.rejected, (state, action) => {
        state.loading = true;
        state.errorMessage = action.payload;
        state.token = null
      })
  }
});

export const authSelector = {
  selectToken : (state) => state.auth.token,
  loading : (state) => state.auth.loading,
  errorMessage : (state) => state.auth.errorMessage
}

export default authSlice.reducer;
