import type { IUserProfile } from '@/types/user.types/user.types';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
//initial state
export interface IAuthSlice {
    isLoggedIn: boolean;
    userRole: "PLAYER" | "VENUE_OWNER" | "ADMIN" | null;
    profile?: IUserProfile | null;
}

const initialState: IAuthSlice = {
    isLoggedIn: !!localStorage.getItem("accessToken"),
    userRole: (localStorage.getItem("userRole") as IAuthSlice["userRole"]) || null,
    profile: null,
};

// Create slice (reducer + actions)
const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        signInSuccess: (state, action) => {
            state.isLoggedIn = true;
            state.userRole = action.payload.role;
        },
        signOut: (state) => {
            state.isLoggedIn = false;
            state.userRole = null;
            state.profile = null;
        },
        setUserProfile: (state, action: PayloadAction<IUserProfile>) => {
            state.profile = action.payload;
        },
        
    },
});

// Export actions (for components to dispatch)
export const { actions: authActions, reducer } = authSlice;
export default reducer;