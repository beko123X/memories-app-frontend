import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { API } from "../../api/api";

export const signin = createAsyncThunk(
  "auth/signin",
  async ({ formData, navigate }, { rejectWithValue }) => {
    try {
      const { data } = await API.post("/users/signin", formData);
      
      // ✅ تأكد من أن البيانات بنفس هيكل Google login
      const profileData = {
        result: {
          ...data.result,
          // تأكد من وجود _id في النتيجة
          _id: data.result._id || data.result.id,
          googleId: data.result.googleId || null
        },
        token: data.token
      };
      
      localStorage.setItem("profile", JSON.stringify(profileData));
      navigate("/");
      return profileData;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.response?.data);
    }
  }
);

export const signup = createAsyncThunk(
  "auth/signup",
  async ({ formData, navigate }, { rejectWithValue }) => {
    try {
      const { data } = await API.post("/users/signup", formData);
      
      const profileData = {
        result: {
          ...data.result,
          _id: data.result._id || data.result.id,
          googleId: data.result.googleId || null
        },
        token: data.token
      };
      
      localStorage.setItem("profile", JSON.stringify(profileData));
      navigate("/");
      return profileData;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.response?.data);
    }
  }
);

const initialState = {
  authData: JSON.parse(localStorage.getItem("profile")),
};

const AuthSlice = createSlice({
  name: "auth",
  initialState,

  reducers: {
    auth: (state, action) => {
      const profileData = {
        result: action.payload.result,
        token: action.payload.token
      };
      state.authData = profileData;
      localStorage.setItem("profile", JSON.stringify(profileData));
    },

    logout: (state) => {
      state.authData = null;
      localStorage.removeItem("profile");
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(signin.fulfilled, (state, action) => {
        state.authData = action.payload;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.authData = action.payload;
      });
  },
});

export const { auth, logout } = AuthSlice.actions;
export default AuthSlice.reducer;