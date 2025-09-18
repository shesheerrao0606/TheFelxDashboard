import { useState, useEffect } from 'react';
import { PropertyMetricsCard } from '@/components/reviews/PropertyMetricsCard';
import { ReviewCard } from '@/components/reviews/ReviewCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Building2, Star, TrendingUp, MessageSquare, Eye, RefreshCw, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { mockawayApiWithAuth } from '@/services/mockawayApiWithAuth';
import { transformHostawayResponse } from '@/utils/hostawayTransformer';
import { reviewStatusManager } from '@/utils/reviewStatusManager';

export default function Properties() {
  const [selectedProperty, setSelectedProperty] = useState<string>('');
  const [reviewFilters, setReviewFilters] = useState({
    status: 'all',
    rating: 'all'
  });
  const [reviews, setReviews] = useState<any[]>([]);
  const [properties, setProperties] = useState<any[]>([]);
  const [metrics, setMetrics] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

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
        
        // Load metrics
        const metricsResponse = await mockawayApiWithAuth.getAllPropertyMetrics();
        setMetrics(metricsResponse);
        
        // Set default selected property only if none is selected
        if (propertiesResponse.length > 0 && selectedProperty === '') {
          setSelectedProperty(propertiesResponse[0].id);
        }
        
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data');
        toast({
          title: "Error Loading Data",
          description: "Failed to load data from Mockaway API. Please check your connection.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [toast]);

  const currentProperty = properties.find(p => p.id === selectedProperty);
  const currentMetrics = metrics.find(m => m.propertyId === selectedProperty);
  
  // Only show pending reviews by default (approved reviews are hidden)
  const propertyReviews = reviews.filter(r => r.propertyId === selectedProperty);
  const filteredReviews = propertyReviews.filter(review => {
    // Only show pending reviews unless specifically filtering for others
    if (reviewFilters.status === 'all') {
      // Show only pending reviews when "all" is selected
      if (review.status !== 'pending') return false;
    } else if (review.status !== reviewFilters.status) {
      return false;
    }
    if (reviewFilters.rating !== 'all' && review.rating !== parseInt(reviewFilters.rating)) return false;
    return true;
  });

  const handleViewPublicPage = () => {
    toast({
      title: "Public Page",
      description: "This would navigate to the public property page with approved reviews.",
    });
  };

  const handleApproveReview = async (reviewId: string) => {
    try {
      // Update the API (even though it doesn't persist, we still call it)
      await mockawayApiWithAuth.updateReviewStatus(reviewId, 'approved');
      
      // Update localStorage for persistence
      reviewStatusManager.approveReview(reviewId);
      
      // Update the local state
      setReviews(prevReviews => 
        prevReviews.map(review => 
          review.id === reviewId ? { ...review, status: 'approved' } : review
        )
      );
      
      toast({
        title: "Review Approved",
        description: "The review has been approved and will now appear on the public page.",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to approve review. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleRejectReview = async (reviewId: string) => {
    try {
      await mockawayApiWithAuth.updateReviewStatus(reviewId, 'rejected');
      
      // Update localStorage for persistence
      reviewStatusManager.rejectReview(reviewId);
      
      // Update the local state
      setReviews(prevReviews => 
        prevReviews.map(review => 
          review.id === reviewId ? { ...review, status: 'rejected' } : review
        )
      );
      
      toast({
        title: "Review Rejected",
        description: "The review has been rejected and will not appear on the public page.",
        variant: "destructive",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reject review. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center">
          <RefreshCw className="h-8 w-8 animate-spin mr-2" />
          <span>Loading properties...</span>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="p-4 border border-red-200 rounded-lg bg-red-50">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
            <span className="text-red-700">Error loading data: {error}</span>
          </div>
        </div>
      </div>
    );
  }

  if (!currentProperty || !currentMetrics) {
    return <div>Property not found</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Properties</h1>
            <p className="text-muted-foreground mt-1">
              Detailed view of individual property performance
            </p>
          </div>
          <Button onClick={handleViewPublicPage} className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            View Public Page
          </Button>
        </div>

        {/* Property Selector */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <Building2 className="h-5 w-5 text-primary" />
              <div className="flex-1">
                <label className="text-sm font-medium mb-2 block">Select Property</label>
                <Select value={selectedProperty} onValueChange={setSelectedProperty}>
                  <SelectTrigger className="w-full max-w-md">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {properties.map(property => (
                      <SelectItem key={property.id} value={property.id}>
                        <div className="flex items-center gap-2">
                          <span>{property.name}</span>
                          <Badge variant="outline" className="text-xs">
                            {property.location}
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Property Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <PropertyMetricsCard
              property={currentProperty}
              metrics={currentMetrics}
            />
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start" variant="outline">
                <MessageSquare className="h-4 w-4 mr-2" />
                Respond to Reviews
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Star className="h-4 w-4 mr-2" />
                Feature Reviews
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Eye className="h-4 w-4 mr-2" />
                Preview Public Page
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Property Reviews */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Property Reviews ({filteredReviews.length})
              </CardTitle>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium">Status:</label>
                  <Select 
                    value={reviewFilters.status} 
                    onValueChange={(value) => setReviewFilters(prev => ({ ...prev, status: value }))}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium">Min Rating:</label>
                  <Select 
                    value={reviewFilters.rating} 
                    onValueChange={(value) => setReviewFilters(prev => ({ ...prev, rating: value }))}
                  >
                    <SelectTrigger className="w-24">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="5">5★</SelectItem>
                      <SelectItem value="4">4★+</SelectItem>
                      <SelectItem value="3">3★+</SelectItem>
                      <SelectItem value="2">2★+</SelectItem>
                      <SelectItem value="1">1★+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="list" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="list">List View</TabsTrigger>
                <TabsTrigger value="grid">Grid View</TabsTrigger>
              </TabsList>
              
              <TabsContent value="list" className="space-y-4 mt-6">
                {filteredReviews.length === 0 ? (
                  <div className="text-center py-8">
                    <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-semibold text-lg mb-2">No reviews found</h3>
                    <p className="text-muted-foreground">
                      No reviews match your current filters.
                    </p>
                  </div>
                ) : (
                  filteredReviews.map(review => (
                    <ReviewCard
                      key={review.id}
                      review={review}
                      showActions={review.status === 'pending'}
                      onApprove={handleApproveReview}
                      onReject={handleRejectReview}
                    />
                  ))
                )}
              </TabsContent>
              
              <TabsContent value="grid" className="mt-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {filteredReviews.length === 0 ? (
                    <div className="col-span-2 text-center py-8">
                      <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="font-semibold text-lg mb-2">No reviews found</h3>
                      <p className="text-muted-foreground">
                        No reviews match your current filters.
                      </p>
                    </div>
                  ) : (
                    filteredReviews.map(review => (
                      <ReviewCard
                        key={review.id}
                        review={review}
                        showActions={review.status === 'pending'}
                        onApprove={handleApproveReview}
                        onReject={handleRejectReview}
                        compact={false}
                      />
                    ))
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}