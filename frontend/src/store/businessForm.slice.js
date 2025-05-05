import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../api";

export const submitBusinessForm = createAsyncThunk(
  "business/submit",
  async (formData, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const user_id = state.auth.user.id;
      const token = state.auth.token;

      const response = await API.post(
        "/business/create",
        { ...formData, user_id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      return response.data.business;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { error: "Unknown error" }
      );
    }
  }
);

export const fetchUserBusinesses = createAsyncThunk(
  "business/fetchUserBusinesses",
  async ({ userId }, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const response = await API.get(`/business/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { error: "Failed to load businesses" }
      );
    }
  }
);

export const updateBusiness = createAsyncThunk(
  "business/update",
  async ({ businessId, formData }, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      await API.put(`/business/${businessId}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return { businessId, ...formData };
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { error: "Update failed" }
      );
    }
  }
);

export const deleteBusiness = createAsyncThunk(
  "business/delete",
  async (businessId, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      await API.delete(`/business/${businessId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return businessId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { error: "Delete failed" }
      );
    }
  }
);

const businessSlice = createSlice({
  name: "business",
  initialState: {
    businessName: "",
    industry: "",
    instagramHashtag: "",
    targetAudience: "",
    marketingGoal: "",
    brandTone: "",
    instagramUsername: "",
    tiktokUsername: "",
    location: "",
    businesses: [],
    status: "idle",
    error: null,
  },

  reducers: {
    setFormData(state, action) {
      const { name, value } = action.payload;
      state[name] = value;
    },
    resetForm(state) {
      state.businessName = "";
      state.industry = "";
      state.instagramHashtag = "";
      state.targetAudience = "";
      state.marketingGoal = "";
      state.brandTone = "";
      state.instagramUsername = "";
      state.tiktokUsername = "";
      state.location = "";
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitBusinessForm.pending, (state) => {
        state.status = "loading";
      })
      .addCase(submitBusinessForm.fulfilled, (state, action) => {
        state.status = "succeeded";
        const business = action.payload;
        state.businessName = business.business_name;
        state.industry = business.industry;
        state.instagramHashtag = business.instagram_hashtag;
        state.targetAudience = business.target_audience;
        state.marketingGoal = business.marketing_goal;
        state.brandTone = business.brand_tone;
        state.businesses.push(business);
        state.instagramUsername = business.instagram_username;
        state.tiktokUsername = business.tiktok_username;
        state.location = business.location;
      })
      .addCase(submitBusinessForm.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(fetchUserBusinesses.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUserBusinesses.fulfilled, (state, action) => {
        state.status = "succeeded";
        console.log(action.payload);
        const business = action.payload.business;
        state.businessName = business.business_name;
        state.industry = business.industry;
        state.instagramHashtag = business.instagram_hashtag;
        state.targetAudience = business.target_audience;
        state.marketingGoal = business.marketing_goal;
        state.brandTone = business.brand_tone;
        state.instagramUsername = business.instagram_username;
        state.tiktokUsername = business.tiktok_username;
        state.location = business.location;

        state.businesses.push(business);
      })
      .addCase(fetchUserBusinesses.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(updateBusiness.fulfilled, (state, action) => {
        state.businesses = state.businesses.map((b) =>
          b.id === action.payload.businessId ? { ...b, ...action.payload } : b
        );
      })
      .addCase(deleteBusiness.fulfilled, (state, action) => {
        state.businesses = state.businesses.filter(
          (b) => b.id !== action.payload
        );
      });
  },
});

export const { setFormData, resetForm } = businessSlice.actions;

export default businessSlice.reducer;
