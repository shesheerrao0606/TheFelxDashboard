import { ReviewCard } from '@/components/reviews/ReviewCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Star, MapPin, Calendar, Filter, RefreshCw, AlertCircle } from 'lucide-react';
import { useState, useMemo, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { mockawayApiWithAuth } from '@/services/mockawayApiWithAuth';
import { transformHostawayResponse } from '@/utils/hostawayTransformer';
import { reviewStatusManager } from '@/utils/reviewStatusManager';

export default function PublicReviews() {
  const [selectedProperty, setSelectedProperty] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('newest');
  const [reviews, setReviews] = useState<any[]>([]);
  const [properties, setProperties] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load data from Mockaway API
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Set API key
        mockawayApiWithAuth.setApiKey('demo-api-key-12345');
        
        // Load reviews
        const reviewsResponse = await mockawayApiWithAuth.getReviews();
        const transformedReviews = transformHostawayResponse(reviewsResponse);
        
        // Merge with localStorage status
        const reviewsWithStatus = transformedReviews.map(review => ({
          ...review,
          status: reviewStatusManager.isApproved(review.id) ? 'approved' : review.status
        }));
        
        setReviews(reviewsWithStatus);
        
        // Load properties
        const propertiesResponse = await mockawayApiWithAuth.getProperties();
        setProperties(propertiesResponse);
        
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Only show approved reviews
  const approvedReviews = reviews.filter(review => {
    // Check if review is approved via API status or localStorage
    return review.status === 'approved' || reviewStatusManager.isApproved(review.id);
  });

  const filteredAndSortedReviews = useMemo(() => {
    let filtered = approvedReviews;

    if (selectedProperty !== 'all') {
      filtered = filtered.filter(review => review.propertyId === selectedProperty);
    }

    // Sort reviews
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case 'oldest':
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case 'highest':
          return b.rating - a.rating;
        case 'lowest':
          return a.rating - b.rating;
        case 'helpful':
          return b.helpful - a.helpful;
        default:
          return 0;
      }
    });
  }, [approvedReviews, selectedProperty, sortBy]);

  const averageRating = useMemo(() => {
    if (filteredAndSortedReviews.length === 0) return 0;
    return Number((filteredAndSortedReviews.reduce((sum, review) => sum + review.rating, 0) / filteredAndSortedReviews.length).toFixed(1));
  }, [filteredAndSortedReviews]);

  const renderStars = (rating: number, size: 'sm' | 'lg' = 'sm') => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={cn(
          size === 'sm' ? "h-4 w-4" : "h-6 w-6",
          i < Math.floor(rating) ? "fill-accent text-accent" : "text-muted-foreground"
        )}
      />
    ));
  };

  const getRatingDistribution = () => {
    const distribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    filteredAndSortedReviews.forEach(review => {
      distribution[review.rating] = (distribution[review.rating] || 0) + 1;
    });
    return distribution;
  };

  const ratingDistribution = getRatingDistribution();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary/10 to-accent/10 border-b">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Guest Reviews
            </h1>
            <p className="text-xl text-muted-foreground mb-6">
              See what our guests are saying about their stays at the flex. properties
            </p>
            <div className="flex items-center justify-center gap-4">
              <div className="flex items-center gap-2">
                {renderStars(averageRating, 'lg')}
                <span className="text-2xl font-bold text-foreground">{averageRating}</span>
              </div>
              <div className="text-muted-foreground">
                Based on {filteredAndSortedReviews.length} verified reviews
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center p-8">
            <RefreshCw className="h-8 w-8 animate-spin mr-2" />
            <span>Loading reviews...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="p-4 border border-red-200 rounded-lg bg-red-50 mb-6">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
              <span className="text-red-700">Error loading reviews: {error}</span>
            </div>
          </div>
        )}

        {/* Main Content */}
        {!isLoading && !error && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Filters */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Filters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Property</label>
                  <Select value={selectedProperty} onValueChange={setSelectedProperty}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Properties</SelectItem>
                      {properties.map(property => (
                        <SelectItem key={property.id} value={property.id}>
                          {property.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Sort by</label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Newest First</SelectItem>
                      <SelectItem value="oldest">Oldest First</SelectItem>
                      <SelectItem value="highest">Highest Rating</SelectItem>
                      <SelectItem value="lowest">Lowest Rating</SelectItem>
                      <SelectItem value="helpful">Most Helpful</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Rating Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Rating Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[5, 4, 3, 2, 1].map(rating => {
                    const count = ratingDistribution[rating] || 0;
                    const percentage = filteredAndSortedReviews.length > 0 
                      ? (count / filteredAndSortedReviews.length) * 100 
                      : 0;
                    
                    return (
                      <div key={rating} className="flex items-center gap-2">
                        <div className="flex items-center gap-1 min-w-[60px]">
                          <span className="text-sm">{rating}</span>
                          <Star className="h-3 w-3 fill-accent text-accent" />
                        </div>
                        <div className="flex-1 bg-muted rounded-full h-2">
                          <div 
                            className="bg-accent rounded-full h-2 transition-all duration-300"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <span className="text-sm text-muted-foreground min-w-[30px]">
                          {count}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Property Info (if specific property selected) */}
            {selectedProperty !== 'all' && (
              <Card>
                <CardContent className="p-4">
                  {(() => {
                    const property = properties.find(p => p.id === selectedProperty);
                    if (!property) return null;
                    
                    return (
                      <div className="space-y-3">
                        <h3 className="font-semibold">{property.name}</h3>
                        <div className="flex items-center gap-1 text-muted-foreground text-sm">
                          <MapPin className="h-4 w-4" />
                          {property.location}
                        </div>
                        <Badge variant="outline" className="capitalize">
                          {property.type}
                        </Badge>
                        <div className="flex items-center gap-2">
                          {renderStars(property.averageRating)}
                          <span className="font-medium">{property.averageRating.toFixed(1)}</span>
                          <span className="text-muted-foreground text-sm">
                            ({property.totalReviews} reviews)
                          </span>
                        </div>
                      </div>
                    );
                  })()}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Reviews Content */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold">
                Reviews ({filteredAndSortedReviews.length})
              </h2>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                Updated regularly
              </div>
            </div>

            {filteredAndSortedReviews.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Star className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No reviews yet</h3>
                  <p className="text-muted-foreground">
                    Be the first to share your experience!
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {filteredAndSortedReviews.map(review => (
                  <ReviewCard
                    key={review.id}
                    review={review}
                    showActions={false}
                    showPropertyName={selectedProperty === 'all'}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
        )}
      </div>
    </div>
  );
}