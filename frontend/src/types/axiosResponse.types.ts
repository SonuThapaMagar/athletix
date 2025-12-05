export interface IAxiosRes<T> {
  data: {
    message: string;
    success: boolean;
    data: T;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  error?: string;
}