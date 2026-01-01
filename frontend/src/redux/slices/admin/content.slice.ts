import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { ContentItem } from '@/types/admin/content.types';
import type { Pagination } from '@/types/pagination.types';

export interface IAdminContentSlice {
  contentItems: ContentItem[];
  selectedContent: ContentItem | null;
  pagination: Pagination | null;
  loading: boolean;
  error: string | null;
}

const initialState: IAdminContentSlice = {
  contentItems: [],
  selectedContent: null,
  pagination: null,
  loading: false,
  error: null,
};

const adminContentSlice = createSlice({
  name: 'adminContent',
  initialState,
  reducers: {
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
      state.loading = false;
    },
    setContentItems(state, action: PayloadAction<{ contentItems: ContentItem[]; pagination: Pagination }>) {
      state.contentItems = action.payload.contentItems;
      state.pagination = action.payload.pagination;
      state.loading = false;
      state.error = null;
    },
    addContentItem(state, action: PayloadAction<ContentItem>) {
      state.contentItems.unshift(action.payload);
    },
    updateContentItem(state, action: PayloadAction<ContentItem>) {
      const index = state.contentItems.findIndex(c => c.id === action.payload.id);
      if (index !== -1) {
        state.contentItems[index] = action.payload;
      }
      if (state.selectedContent?.id === action.payload.id) {
        state.selectedContent = action.payload;
      }
    },
    removeContentItem(state, action: PayloadAction<number>) {
      state.contentItems = state.contentItems.filter(c => c.id !== action.payload);
    },
    setSelectedContent(state, action: PayloadAction<ContentItem | null>) {
      state.selectedContent = action.payload;
    },
  },
});

export const { actions: adminContentActions, reducer } = adminContentSlice;
export default reducer;
