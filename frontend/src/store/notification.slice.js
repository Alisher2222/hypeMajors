import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import API from "../api";

export const scheduleEmail = createAsyncThunk(
  "notification/scheduleEmail",
  async ({ email, hashtag, interval }, { rejectWithValue }) => {
    try {
      const response = await API.post("/api/notify", {
        email,
        hashtag,
        interval,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { error: "Unknown error" }
      );
    }
  }
);

const notificationSlice = createSlice({
  name: "notification",
  initialState: {
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(scheduleEmail.pending, (state) => {
        state.status = "loading";
      })
      .addCase(scheduleEmail.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(scheduleEmail.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          action.payload?.error || "Failed to schedule notification";
      });
  },
});

export default notificationSlice.reducer;
