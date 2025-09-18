// Mockaway API service with authentication - handles API calls with API key validation
import { HostawayApiResponse, HostawayReview } from '@/data/hostawayApiResponse';
import { Review, Property, PropertyMetrics } from '@/types/reviews';

export const MOCKAWAY_CONFIG = {
  baseUrl: 'http://localhost:3001/api/mockaway',
  apiKey: import.meta.env.VITE_MOCKAWAY_API_KEY || 'demo-api-key-12345',
  apiKeyHeader: 'X-API-Key',
};

const VALID_API_KEYS = [
  'demo-api-key-12345',
  'test-api-key-67890',
  'dev-api-key-abcdef',
  'prod-api-key-xyz789'
];
export class MockawayApiServiceWithAuth {
  private baseUrl: string;
  private apiKey: string;
  private apiKeyHeader: string;

  constructor(
    baseUrl: string = MOCKAWAY_CONFIG.baseUrl, 
    apiKey: string = MOCKAWAY_CONFIG.apiKey,
    apiKeyHeader: string = MOCKAWAY_CONFIG.apiKeyHeader
  ) {
    this.baseUrl = baseUrl;
    this.apiKey = apiKey;
    this.apiKeyHeader = apiKeyHeader;
  }

  private validateApiKey(apiKey: string): boolean {
    return VALID_API_KEYS.includes(apiKey);
  }

  private async apiCall<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    if (!this.validateApiKey(this.apiKey)) {
      throw new Error('Invalid API key');
    }

    const headers = {
      'Content-Type': 'application/json',
      [this.apiKeyHeader]: this.apiKey,
      ...options.headers,
    };

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (response.status === 401) {
      throw new Error('Unauthorized: Invalid API key');
    }

    if (response.status === 403) {
      throw new Error('Forbidden: API key does not have permission for this resource');
    }

    if (response.status === 429) {
      throw new Error('Rate limit exceeded: Too many requests');
    }

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  }

  setApiKey(apiKey: string): void {
    this.apiKey = apiKey;
  }

  getApiKey(): string {
    return this.apiKey.length > 8 
      ? `${this.apiKey.substring(0, 4)}...${this.apiKey.substring(this.apiKey.length - 4)}`
      : '***';
  }

  async testApiKey(): Promise<{ valid: boolean; message: string }> {
    try {
      await this.apiCall('/health');
      return { valid: true, message: 'API key is valid' };
    } catch (error) {
      return { 
        valid: false, 
        message: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  async getReviews(): Promise<HostawayApiResponse> {
    return this.apiCall<HostawayApiResponse>('/reviews');
  }

  async getReviewsByProperty(propertyId: string): Promise<HostawayApiResponse> {
    return this.apiCall<HostawayApiResponse>(`/reviews?property=${propertyId}`);
  }

  async getReviewById(id: number): Promise<HostawayReview> {
    return this.apiCall<HostawayReview>(`/reviews/${id}`);
  }

  async getProperties(): Promise<Property[]> {
    return this.apiCall<Property[]>('/properties');
  }

  async getPropertyMetrics(propertyId: string): Promise<PropertyMetrics> {
    return this.apiCall<PropertyMetrics>(`/properties/${propertyId}/metrics`);
  }

  async getAllPropertyMetrics(): Promise<PropertyMetrics[]> {
    return this.apiCall<PropertyMetrics[]>('/properties/metrics');
  }

  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    return this.apiCall<{ status: string; timestamp: string }>('/health');
  }

  async updateReviewStatus(reviewId: string, status: 'approved' | 'rejected' | 'pending'): Promise<{ success: boolean; message: string; reviewId: string; newStatus: string }> {
    return this.apiCall(`/reviews/${reviewId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    });
  }
}

export const mockawayApiWithAuth = new MockawayApiServiceWithAuth();

export const API_KEY_UTILS = {
  generateDemoKey: (): string => {
    const validKeys = [
      'demo-api-key-12345',
      'test-api-key-67890',
      'dev-api-key-abcdef',
      'prod-api-key-xyz789'
    ];
    return validKeys[Math.floor(Math.random() * validKeys.length)];
  },

  validateFormat: (apiKey: string): boolean => {
    const validKeys = [
      'demo-api-key-12345',
      'test-api-key-67890',
      'dev-api-key-abcdef',
      'prod-api-key-xyz789'
    ];
    return validKeys.includes(apiKey);
  },

  maskApiKey: (apiKey: string): string => {
    if (apiKey.length <= 8) return '***';
    return `${apiKey.substring(0, 4)}...${apiKey.substring(apiKey.length - 4)}`;
  },

  getValidKeys: (): string[] => {
    return [
      'demo-api-key-12345',
      'test-api-key-67890',
      'dev-api-key-abcdef',
      'prod-api-key-xyz789'
    ];
  }
};
export type { HostawayApiResponse, HostawayReview } from '@/data/hostawayApiResponse';
export type { Review, Property, PropertyMetrics } from '@/types/reviews';
