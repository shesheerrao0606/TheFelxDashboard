export interface Review {
  id: string;
  propertyId: string;
  propertyName: string;
  guestName: string;
  guestAvatar?: string;
  rating: number;
  title: string;
  content: string;
  date: string;
  channel: 'airbnb' | 'booking' | 'vrbo' | 'direct' | 'google' | 'hostaway';
  category: 'cleanliness' | 'communication' | 'location' | 'value' | 'amenities' | 'overall';
  status: 'pending' | 'approved' | 'rejected';
  helpful: number;
  verifiedStay: boolean;
  stayDuration: number; // nights
  response?: {
    content: string;
    date: string;
    author: string;
  };
}

export interface Property {
  id: string;
  name: string;
  location: string;
  type: 'apartment' | 'house' | 'studio' | 'loft';
  averageRating: number;
  totalReviews: number;
  approvedReviews: number;
  image: string;
}

export interface ReviewFilters {
  property?: string;
  channel?: string;
  rating?: number;
  status?: string;
  category?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface PropertyMetrics {
  propertyId: string;
  averageRating: number;
  totalReviews: number;
  approvedReviews: number;
  channelBreakdown: Record<string, number>;
  categoryRatings: Record<string, number>;
  recentTrend: 'up' | 'down' | 'stable';
  responseRate: number;
}