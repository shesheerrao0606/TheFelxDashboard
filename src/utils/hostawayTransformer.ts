// Hostaway API data transformer - converts API responses to application format
import { Review } from '@/types/reviews';
import { HostawayReview, HostawayApiResponse } from '@/data/hostawayApiResponse';

const calculateOverallRating = (reviewCategories: { category: string; rating: number }[] | undefined | null): number => {
  if (!reviewCategories || reviewCategories.length === 0) return 0;
  const total = reviewCategories.reduce((sum, cat) => sum + cat.rating, 0);
  return Math.round((total / reviewCategories.length) / 2);
};

const getPrimaryCategory = (reviewCategories: { category: string; rating: number }[] | undefined | null): 'cleanliness' | 'communication' | 'location' | 'value' | 'amenities' | 'overall' => {
  if (!reviewCategories || reviewCategories.length === 0) return 'overall';
  
  const highest = reviewCategories.reduce((prev, current) => 
    current.rating > prev.rating ? current : prev
  );
  
  const categoryMap: Record<string, 'cleanliness' | 'communication' | 'location' | 'value' | 'amenities' | 'overall'> = {
    'cleanliness': 'cleanliness',
    'communication': 'communication',
    'location': 'location',
    'value': 'value',
    'respect_house_rules': 'amenities',
    'amenities': 'amenities'
  };
  
  return categoryMap[highest.category] || 'overall';
};

const convertStatus = (hostawayStatus: string): 'pending' | 'approved' | 'rejected' => {
  switch (hostawayStatus.toLowerCase()) {
    case 'published':
      return 'approved';
    case 'pending':
      return 'pending';
    case 'rejected':
    case 'hidden':
      return 'rejected';
    default:
      return 'pending';
  }
};

const generatePropertyId = (listingName: string | undefined | null): string => {
  if (!listingName) {
    return 'prop-unknown';
  }
  
  const listingNameLower = listingName.toLowerCase();
  
  if (listingNameLower.includes('downtown luxury loft')) {
    return 'prop-1';
  } else if (listingNameLower.includes('cozy brooklyn apartment')) {
    return 'prop-2';
  } else if (listingNameLower.includes('modern studio space')) {
    return 'prop-3';
  } else if (listingNameLower.includes('shoreditch heights')) {
    return 'prop-1';
  }
  
  const normalized = listingName.toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '-');
  return `prop-${normalized.substring(0, 20)}`;
};
export const transformHostawayReview = (hostawayReview: HostawayReview): Review => {
  const overallRating = hostawayReview.rating || calculateOverallRating(hostawayReview.reviewCategory || []);
  const rating = hostawayReview.rating ? Math.min(5, Math.round(hostawayReview.rating / 2)) : overallRating;
  
  return {
    id: `hostaway-${hostawayReview.id}`,
    propertyId: generatePropertyId(hostawayReview.listingName),
    propertyName: hostawayReview.listingName || 'Unknown Property',
    guestName: hostawayReview.guestName || 'Anonymous',
    guestAvatar: undefined,
    rating: rating,
    title: `${hostawayReview.type === 'guest-to-host' ? 'Guest Review' : 'Host Review'}`,
    content: hostawayReview.publicReview || 'No review content available',
    date: hostawayReview.submittedAt ? hostawayReview.submittedAt.split(' ')[0] : new Date().toISOString().split('T')[0],
    channel: 'hostaway' as const,
    category: getPrimaryCategory(hostawayReview.reviewCategory || []),
    status: 'pending' as const, // Reviews start as pending and need approval
    helpful: Math.floor(Math.random() * 10) + 1, // Random helpful count since not provided
    verifiedStay: true, // Hostaway reviews are always verified
    stayDuration: Math.floor(Math.random() * 7) + 1, // Random stay duration since not provided
  };
};

// Transform entire Hostaway API response to our Review array
export const transformHostawayResponse = (response: HostawayApiResponse): Review[] => {
  if (response.status !== 'success' || !response.result) {
    return [];
  }
  
  return response.result.map(transformHostawayReview);
};

export const mergeWithMockReviews = (existingReviews: Review[], hostawayResponse: HostawayApiResponse): Review[] => {
  const transformedHostawayReviews = transformHostawayResponse(hostawayResponse);
  const allReviews = [...existingReviews, ...transformedHostawayReviews];
  return allReviews.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};