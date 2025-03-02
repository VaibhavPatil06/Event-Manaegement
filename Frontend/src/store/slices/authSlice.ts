import { createSlice,  } from '@reduxjs/toolkit';
import { AuthState} from '../../types';

// Mock users for demo purposes
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state,action) => {
      state.user = action.payload;

    },
    setIsAuthenticated: (state, action) => {
      state.isAuthenticated = action.payload;
    },
  },
});

export const {
setUser,
setIsAuthenticated
} = authSlice.actions;

export default authSlice.reducer;