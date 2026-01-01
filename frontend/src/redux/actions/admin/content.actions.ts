import requests from "@/helper/requests";
import { adminContentActions } from "@/redux/slices/admin/content.slice";
import { AppDispatch } from "@/redux/store";
import type { ContentItem, ContentFilters } from "@/types/admin/content.types";
import type { PaginationResponse } from "@/types/venueOwner/payment.types";
import type { AxiosResponse } from "axios";
import type { ApiResponse } from "@/types/axiosResponse.types";

export const FETCH_ADMIN_CONTENT_ITEMS_ACTION = (filters?: ContentFilters): Promise<{ contentItems: ContentItem[]; pagination: any }> =>
  new Promise((resolve, reject) => {
    AppDispatch(adminContentActions.setLoading(true));

    requests.admin.content
      .getContentItems(filters)
      .then((res: AxiosResponse<ApiResponse<PaginationResponse<ContentItem>>>) => {
        const paginatedData = res.data.data || res.data;
        const contentItems = paginatedData.items || [];
        const pagination = paginatedData.pagination;
        AppDispatch(adminContentActions.setContentItems({ contentItems, pagination }));
        resolve({ contentItems, pagination });
      })
      .catch((err: any) => {
        const message = err.response?.data?.message || "Failed to fetch content items";
        AppDispatch(adminContentActions.setError(message));
        reject(err);
      });
  });

export const MODERATE_CONTENT_ACTION = (contentId: number, action: 'approve' | 'reject'): Promise<ContentItem> =>
  new Promise((resolve, reject) => {
    AppDispatch(adminContentActions.setLoading(true));

    requests.admin.content
      .moderateContent(contentId, action)
      .then((res: AxiosResponse<ApiResponse<ContentItem>>) => {
        const content = res.data.data || res.data;
        AppDispatch(adminContentActions.updateContentItem(content));
        AppDispatch(adminContentActions.setLoading(false));
        resolve(content);
      })
      .catch((err: any) => {
        const message = err.response?.data?.message || "Failed to moderate content";
        AppDispatch(adminContentActions.setError(message));
        reject(err);
      });
  });
