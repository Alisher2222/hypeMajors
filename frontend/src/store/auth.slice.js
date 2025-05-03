import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "./../api";

export const register = createAsyncThunk(
  "auth/register",
  async ({ name, surname, email, password }, { rejectWithValue }) => {
    try {
      const response = await API.post("/auth/register", {
        name,
        surname,
        email,
        password,
      });
      return response.data;
    } catch (error) {
      if (error.response && error.response.status > 400) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue(error.response.data);
    }
  }
);

export const login = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await API.post("/auth/login", {
        email,
        password,
      });
      return response.data;
    } catch (error) {
      if (error.response && error.response.status > 400) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue("Something went wrong");
    }
  }
);

export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const response = await API.post(
        "/auth/logout",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error) {
      if (error.response && error.response.status > 400) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue("Something went wrong");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    token: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(register.rejected, (state, action) => {
        state.error = action.payload.message || "Registration failed";
        state.loading = false;
      })
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(login.rejected, (state, action) => {
        state.error = action.payload || "Login failed";
        state.loading = null;
      })
      .addCase(logout.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logout.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.user = null;
        state.token = null;
        state.isAuthorized = false;
      })
      .addCase(logout.rejected, (state, action) => {
        state.error = action.payload || "Logout failed";
        state.loading = null;
        state.user = null;
        state.token = null;
        state.isAuthorized = false;
      });
  },
});

export default authSlice.reducer;
