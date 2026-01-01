import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { AdminUser } from '@/types/admin/user.types';
import type { Pagination } from '@/types/pagination.types';

export interface IAdminUserSlice {
  users: AdminUser[];
  selectedUser: AdminUser | null;
  pagination: Pagination | null;
  loading: boolean;
  error: string | null;
}

const initialState: IAdminUserSlice = {
  users: [],
  selectedUser: null,
  pagination: null,
  loading: false,
  error: null,
};

const adminUserSlice = createSlice({
  name: 'adminUser',
  initialState,
  reducers: {
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
      state.loading = false;
    },
    setUsers(state, action: PayloadAction<{ users: AdminUser[]; pagination: Pagination }>) {
      state.users = action.payload.users;
      state.pagination = action.payload.pagination;
      state.loading = false;
      state.error = null;
    },
    addUser(state, action: PayloadAction<AdminUser>) {
      state.users.unshift(action.payload);
    },
    updateUser(state, action: PayloadAction<AdminUser>) {
      const index = state.users.findIndex(u => u.id === action.payload.id);
      if (index !== -1) {
        state.users[index] = action.payload;
      }
      if (state.selectedUser?.id === action.payload.id) {
        state.selectedUser = action.payload;
      }
    },
    removeUser(state, action: PayloadAction<number>) {
      state.users = state.users.filter(u => u.id !== action.payload);
    },
    setSelectedUser(state, action: PayloadAction<AdminUser | null>) {
      state.selectedUser = action.payload;
    },
  },
});

export const { actions: adminUserActions, reducer } = adminUserSlice;
export default reducer;
