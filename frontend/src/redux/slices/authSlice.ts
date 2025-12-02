import type { IUserProfile } from '@/types/user.types/user.types';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
//initial state
export interface AuthState {
    isLoggedIn: boolean;
    userRole: "PLAYER" | "VENUE_OWNER" | "ADMIN" | null;
    profile?: IUserProfile | null;
}

const initialState: AuthState = {
    isLoggedIn: !!localStorage.getItem("accessToken"),
    userRole: (localStorage.getItem("userRole") as AuthState["userRole"]) || null,
    profile: null,
};

// Create slice (reducer + actions)
const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        signInSuccess: (state, action: PayloadAction<{ role: AuthState["userRole"] }>) => {
            state.isLoggedIn = true;
            state.userRole = action.payload.role;
        },
        signOut: (state) => {
            state.isLoggedIn = false;
            state.userRole = null;
            localStorage.clear();
        },
        setUserProfile: (state, action: PayloadAction<IUserProfile>) => {
        state.profile = action.payload;
    },
    },
});

// Export actions (for components to dispatch)
export const { actions: authActions, reducer } = authSlice;

// Export reducer (for store)
export default reducer;