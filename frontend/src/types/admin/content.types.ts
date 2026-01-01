export type ContentType = 'review' | 'comment' | 'image' | 'description' | 'other';

export type ContentStatus = 'pending' | 'approved' | 'rejected';

export interface ContentItem {
  id: number;
  type: ContentType;
  author: string;
  venue?: string;
  venueId?: number;
  content: string;
  reason?: string;
  reportedBy: string;
  status: ContentStatus;
  reportedAt: string;
  createdAt?: string;
}

export interface ContentFilters {
  status?: ContentStatus | 'all';
  type?: ContentType | 'all';
  search?: string;
  page?: number;
  perPage?: number;
}
