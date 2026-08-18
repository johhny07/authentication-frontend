import {
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";

import axiosInstance from "../../../../api/axiosInstance.js";

const getSavedAuth = () => {
  try {
    const savedAuth = sessionStorage.getItem("auth");

    if (!savedAuth) {
      return null;
    }

    const parsedAuth = JSON.parse(savedAuth);

    if (
      !parsedAuth?.accessToken ||
      !parsedAuth?.email
    ) {
      sessionStorage.removeItem("auth");
      return null;
    }

    return parsedAuth;
  } catch (error) {
    console.error(
      "Failed to restore authentication data:",
      error
    );

    sessionStorage.removeItem("auth");
    return null;
  }
};

const savedAuth = getSavedAuth();

const getErrorMessage = (error, fallbackMessage) => {
  const responseData = error.response?.data;

  return (
    responseData?.message ||
    responseData?.error ||
    (typeof responseData === "string"
      ? responseData
      : null) ||
    fallbackMessage
  );
};

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (loginData, thunkAPI) => {
    try {
      const response = await axiosInstance.post(
        "/auth/login",
        loginData
      );

      const {
        accessToken,
        email,
      } = response.data;

      if (!accessToken || !email) {
        return thunkAPI.rejectWithValue(
          "Invalid login response from the server."
        );
      }

      const authData = {
        accessToken,
        email,
      };

      sessionStorage.setItem(
        "auth",
        JSON.stringify(authData)
      );

      return authData;
    } catch (error) {
      const errorMessage = getErrorMessage(
        error,
        "Login failed. Please check your email and password."
      );

      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (registerData, thunkAPI) => {
    try {
      const response = await axiosInstance.post(
        "/auth/register",
        registerData
      );

      return response.data;
    } catch (error) {
      const errorMessage = getErrorMessage(
        error,
        "Registration failed. Please check your information."
      );

      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

const initialState = {
  accessToken: savedAuth?.accessToken ?? null,
  email: savedAuth?.email ?? null,
  isAuthenticated: Boolean(savedAuth?.accessToken),

  isLoading: false,
  error: null,

  registerSuccess: false,
  registerMessage: "",
};

const authSlice = createSlice({
  name: "auth",

  initialState,

  reducers: {
    logout: (state) => {
      sessionStorage.removeItem("auth");

      state.accessToken = null;
      state.email = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = null;
      state.registerSuccess = false;
      state.registerMessage = "";
    },

    clearAuthError: (state) => {
      state.error = null;
    },

    resetRegisterStatus: (state) => {
      state.registerSuccess = false;
      state.registerMessage = "";
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })

      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.accessToken = action.payload.accessToken;
        state.email = action.payload.email;
        state.isAuthenticated = true;
        state.error = null;
      })

      .addCase(loginUser.rejected, (state, action) => {
        sessionStorage.removeItem("auth");

        state.isLoading = false;
        state.accessToken = null;
        state.email = null;
        state.isAuthenticated = false;
        state.error =
          action.payload || "Login failed.";
      })

      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.registerSuccess = false;
        state.registerMessage = "";
      })

      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.registerSuccess = true;
        state.registerMessage =
          action.payload?.message ||
          "Account created successfully.";
        state.error = null;
      })

      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.registerSuccess = false;
        state.registerMessage = "";
        state.error =
          action.payload || "Registration failed.";
      });
  },
});

export const {
  logout,
  clearAuthError,
  resetRegisterStatus,
} = authSlice.actions;

export default authSlice.reducer;