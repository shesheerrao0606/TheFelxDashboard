import { useState, useMemo, useEffect } from 'react';
import { ReviewFilters } from '@/types/reviews';
import { PropertyMetricsCard } from '@/components/reviews/PropertyMetricsCard';
import { ReviewCard } from '@/components/reviews/ReviewCard';
import { ReviewFiltersComponent } from '@/components/reviews/ReviewFilters';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, Star, MessageSquare, CheckCircle, Clock, AlertCircle, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { GoogleReviewsExploration } from '@/components/reviews/GoogleReviewsExploration';
import { HostawayIntegrationBadge } from '@/components/reviews/HostawayIntegrationBadge';
import { MockawayIntegration } from '@/components/reviews/MockawayIntegration';
import { ApiKeyDemo } from '@/components/reviews/ApiKeyDemo';
import { mockawayApiWithAuth } from '@/services/mockawayApiWithAuth';
import { transformHostawayResponse } from '@/utils/hostawayTransformer';
import { reviewStatusManager } from '@/utils/reviewStatusManager';

export default function Dashboard() {
  const [filters, setFilters] = useState<ReviewFilters>({});
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

  const filteredReviews = useMemo(() => {
    return reviews.filter(review => {
      if (filters.property && review.propertyId !== filters.property) return false;
      if (filters.channel && review.channel !== filters.channel) return false;
      if (filters.rating && review.rating !== filters.rating) return false;
      if (filters.status && review.status !== filters.status) return false;
      if (filters.category && review.category !== filters.category) return false;
      if (filters.dateFrom && new Date(review.date) < new Date(filters.dateFrom)) return false;
      if (filters.dateTo && new Date(review.date) > new Date(filters.dateTo)) return false;
      return true;
    });
  }, [reviews, filters]);

  // Note: Review approval/rejection removed as it's not needed

  const overallStats = {
    totalReviews: reviews.length,
    averageRating: reviews.length > 0 ? Number((reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)) : 0,
    responseRate: reviews.length > 0 ? Math.round((reviews.filter(r => r.response).length / reviews.length) * 100) : 0
  };

  // Calculate metrics from merged review data (includes localStorage status)
  const calculatePropertyMetrics = (propertyId: string) => {
    const propertyReviews = reviews.filter(review => review.propertyId === propertyId);
    const approvedReviews = propertyReviews.filter(review => review.status === 'approved');
    
    return {
      propertyId,
      totalReviews: propertyReviews.length,
      approvedReviews: approvedReviews.length,
      averageRating: propertyReviews.length > 0 ? Number((propertyReviews.reduce((sum, r) => sum + r.rating, 0) / propertyReviews.length).toFixed(1)) : 0,
      responseRate: 100, // All reviews are considered responded to
      channelBreakdown: { hostaway: propertyReviews.length },
      categoryRatings: {},
      recentTrend: 'stable' as const
    };
  };

  const StatCard = ({ 
    title, 
    value, 
    subtitle, 
    icon: Icon, 
    trend, 
    color = "text-foreground" 
  }: {
    title: string;
    value: string | number;
    subtitle: string;
    icon: any;
    trend?: string;
    color?: string;
  }) => (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <div className="flex items-center gap-2">
              <p className={`text-2xl font-bold ${color}`}>{value}</p>
              {trend && (
                <Badge variant="secondary" className="text-xs">
                  {trend}
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          </div>
          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
            <Icon className="h-6 w-6 text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Reviews Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Manage and monitor guest reviews across all properties
          </p>
        </div>

        {/* Hostaway Integration Status */}
        <HostawayIntegrationBadge />

        {/* Overview Stats */}
        {isLoading ? (
          <div className="flex items-center justify-center p-8">
            <RefreshCw className="h-8 w-8 animate-spin mr-2" />
            <span>Loading dashboard data...</span>
          </div>
        ) : error ? (
          <div className="p-4 border border-red-200 rounded-lg bg-red-50">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
              <span className="text-red-700">Error loading data: {error}</span>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatCard
              title="Total Reviews"
              value={overallStats.totalReviews}
              subtitle="All time"
              icon={MessageSquare}
              trend="+12% this month"
            />
            <StatCard
              title="Average Rating"
              value={overallStats.averageRating}
              subtitle="Across all properties"
              icon={Star}
              color="text-accent"
            />
            <StatCard
              title="Response Rate"
              value={`${overallStats.responseRate}%`}
              subtitle="Manager responses"
              icon={TrendingUp}
              color="text-primary"
              trend="Target: 90%"
            />
          </div>
        )}

        {/* Main Content */}
        <Tabs defaultValue="properties" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="properties">Property Overview</TabsTrigger>
            <TabsTrigger value="reviews">Review Management</TabsTrigger>
            <TabsTrigger value="google">Google Integration</TabsTrigger>
            <TabsTrigger value="mockaway">Mockaway API</TabsTrigger>
            <TabsTrigger value="apikey">API Key Demo</TabsTrigger>
          </TabsList>

          <TabsContent value="properties" className="space-y-6">
            {isLoading ? (
              <div className="flex items-center justify-center p-8">
                <RefreshCw className="h-8 w-8 animate-spin mr-2" />
                <span>Loading properties...</span>
              </div>
            ) : error ? (
              <div className="p-4 border border-red-200 rounded-lg bg-red-50">
                <div className="flex items-center">
                  <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                  <span className="text-red-700">Error loading properties: {error}</span>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {properties.map((property) => {
                  const propertyMetrics = calculatePropertyMetrics(property.id);
                  return (
                    <PropertyMetricsCard
                      key={property.id}
                      property={property}
                      metrics={propertyMetrics}
                    />
                  );
                })}
              </div>
            )}
          </TabsContent>

          <TabsContent value="reviews" className="space-y-6">
            {isLoading ? (
              <div className="flex items-center justify-center p-8">
                <RefreshCw className="h-8 w-8 animate-spin mr-2" />
                <span>Loading reviews...</span>
              </div>
            ) : error ? (
              <div className="p-4 border border-red-200 rounded-lg bg-red-50">
                <div className="flex items-center">
                  <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                  <span className="text-red-700">Error loading reviews: {error}</span>
                </div>
              </div>
            ) : (
              <>
                {/* Filters */}
                <ReviewFiltersComponent
                  filters={filters}
                  onFiltersChange={setFilters}
                  properties={properties.map(p => ({ id: p.id, name: p.name }))}
                />

                {/* Reviews List */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold">
                      Reviews ({filteredReviews.length})
                    </h2>
                  </div>

                  {filteredReviews.length === 0 ? (
                    <Card>
                      <CardContent className="text-center py-8">
                        <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="font-semibold text-lg mb-2">No reviews found</h3>
                        <p className="text-muted-foreground">
                          Try adjusting your filters to see more reviews.
                        </p>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      {filteredReviews.map((review) => (
                        <ReviewCard
                          key={review.id}
                          review={review}
                          showActions={false}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </TabsContent>

          <TabsContent value="google" className="space-y-6">
            <GoogleReviewsExploration />
          </TabsContent>

          <TabsContent value="mockaway" className="space-y-6">
            <MockawayIntegration />
          </TabsContent>

          <TabsContent value="apikey" className="space-y-6">
            <ApiKeyDemo />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}