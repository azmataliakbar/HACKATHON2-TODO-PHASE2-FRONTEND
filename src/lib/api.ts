// frontend/src/lib/api.ts
// API client wrapper with JWT injection and error handling

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

class ApiError extends Error {
  public statusCode: number;
  public details: any;

  constructor(message: string, statusCode: number, details?: any) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    this.name = 'ApiError';
  }
}

export interface ApiResponse<T = any> {
  data?: T;
  error?: ApiError;
}

export const apiClient = {
  async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

      const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
      } as Record<string, string>;

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const fullUrl = `${API_BASE_URL}${endpoint}`;
      console.log('🔍 Full URL:', fullUrl);
      console.log('🔍 API_BASE_URL:', API_BASE_URL);
      console.log('🔍 endpoint:', endpoint);

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
      });

      console.log('📡 Status:', response.status, response.ok);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new ApiError(
          errorData.detail || errorData.message || `HTTP ${response.status}`,
          response.status,
          errorData
        );
      }

      const data = await response.json();
      console.log('✅ Success:', data);
      return { data };
    } catch (error) {
      if (error instanceof ApiError) {
        return { error };
      }
      
      if (error instanceof TypeError) {
        throw new ApiError('Network error - check connection', 500);
      }

      throw new ApiError('Unexpected error occurred', 500);
    }
  },

  get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' });
  },

  post<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  put<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  patch<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  },
};

export default apiClient;
export { ApiError };
