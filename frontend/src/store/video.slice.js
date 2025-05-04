import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../api";

// --- ASYNC THUNKS ---

export const fetchInstagramTrends = createAsyncThunk(
  "video/fetchInstagramTrends",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await API.post("/video/instagram", formData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { error: "Failed to fetch Instagram trends" }
      );
    }
  }
);

export const fetchTiktokTrends = createAsyncThunk(
  "video/fetchTiktokTrends",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await API.post("/video/tiktok", formData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { error: "Failed to fetch TikTok trends" }
      );
    }
  }
);

export const generateVideoTemplate = createAsyncThunk(
  "video/generateVideoTemplate",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await API.post("/video/generate-template", formData);
      return response.data.template_text;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { error: "Failed to generate template" }
      );
    }
  }
);

export const generateVideoFromTemplate = createAsyncThunk(
  "video/generateVideoFromTemplate",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await API.post("/video/generate-video", formData);
      return response.data.video_url;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { error: "Failed to generate video" }
      );
    }
  }
);

export const generateVideoFromImage = createAsyncThunk(
  "video/generateVideoFromImage",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await API.post("/video/generate-image-video", formData);
      return response.data.video_url;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { error: "Failed to generate video from image" }
      );
    }
  }
);

const videoSlice = createSlice({
  name: "video",
  initialState: {
    instagramTrends: [],
    tiktokTrends: [],
    templateText: "",
    videoUrl: "",
    loading: false,
    error: null,
  },
  reducers: {
    resetVideoData: (state) => {
      state.instagramTrends = [];
      state.tiktokTrends = [];
      state.templateText = "";
      state.videoUrl = "";
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Instagram
      .addCase(fetchInstagramTrends.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchInstagramTrends.fulfilled, (state, action) => {
        state.loading = false;
        state.instagramTrends = action.payload;
      })
      .addCase(fetchInstagramTrends.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // TikTok
      .addCase(fetchTiktokTrends.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTiktokTrends.fulfilled, (state, action) => {
        state.loading = false;
        state.tiktokTrends = action.payload;
      })
      .addCase(fetchTiktokTrends.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Template
      .addCase(generateVideoTemplate.pending, (state) => {
        state.loading = true;
      })
      .addCase(generateVideoTemplate.fulfilled, (state, action) => {
        state.loading = false;
        state.templateText = action.payload;
      })
      .addCase(generateVideoTemplate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Video
      .addCase(generateVideoFromTemplate.pending, (state) => {
        state.loading = true;
      })
      .addCase(generateVideoFromTemplate.fulfilled, (state, action) => {
        state.loading = false;
        state.videoUrl = action.payload;
      })
      .addCase(generateVideoFromTemplate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      }) // Image2Video
      .addCase(generateVideoFromImage.pending, (state) => {
        state.loading = true;
      })
      .addCase(generateVideoFromImage.fulfilled, (state, action) => {
        state.loading = false;
        state.videoUrl = action.payload;
      })
      .addCase(generateVideoFromImage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetVideoData } = videoSlice.actions;
export default videoSlice.reducer;
