import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../api";

// --- ASYNC THUNKS ---

export const fetchInstagramTrends = createAsyncThunk(
  "trends/fetchInstagram",
  async (formData, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const token = state.auth.token;

      const response = await API.post("/trends/instagram", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        timeout: 120000,
      });

      return response.data.trends;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { error: "Failed to fetch Instagram trends" }
      );
    }
  }
);

export const fetchTiktokTrends = createAsyncThunk(
  "trends/fetchTiktok",
  async (formData, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const token = state.auth.token;

      const response = await API.post("/trends/tiktok", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        timeout: 120000,
      });

      return response.data.trends;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { error: "Failed to fetch TikTok trends" }
      );
    }
  }
);

// --- SLICE ---

const trendSlice = createSlice({
  name: "trends",
  initialState: {
    instagram: {
      data: [],
      status: "idle",
      error: null,
    },
    tiktok: {
      data: [],
      status: "idle",
      error: null,
    },
  },
  reducers: {
    resetTrends(state) {
      state.instagram = { data: [], status: "idle", error: null };
      state.tiktok = { data: [], status: "idle", error: null };
    },
  },
  extraReducers: (builder) => {
    // Instagram
    builder
      .addCase(fetchInstagramTrends.pending, (state) => {
        state.instagram.status = "loading";
      })
      .addCase(fetchInstagramTrends.fulfilled, (state, action) => {
        state.instagram.status = "succeeded";
        state.instagram.data = action.payload;
      })
      .addCase(fetchInstagramTrends.rejected, (state, action) => {
        state.instagram.status = "failed";
        state.instagram.error = action.payload;
      });

    // TikTok
    builder
      .addCase(fetchTiktokTrends.pending, (state) => {
        state.tiktok.status = "loading";
      })
      .addCase(fetchTiktokTrends.fulfilled, (state, action) => {
        state.tiktok.status = "succeeded";
        state.tiktok.data = action.payload;
      })
      .addCase(fetchTiktokTrends.rejected, (state, action) => {
        state.tiktok.status = "failed";
        state.tiktok.error = action.payload;
      });
  },
});

export const { resetTrends } = trendSlice.actions;

export default trendSlice.reducer;
