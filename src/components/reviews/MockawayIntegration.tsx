import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { mockawayApiWithAuth } from '@/services/mockawayApiWithAuth';
import { 
  Server, 
  Wifi, 
  WifiOff, 
  RefreshCw, 
  CheckCircle, 
  XCircle, 
  Clock,
  TrendingUp,
  Star,
  MessageSquare
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function MockawayIntegration() {
  const [selectedTab, setSelectedTab] = useState('status');
  const [isConnected, setIsConnected] = useState(false);
  const [connectionLoading, setConnectionLoading] = useState(true);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [healthData, setHealthData] = useState<any>(null);
  const [reviewsData, setReviewsData] = useState<any>(null);
  const [propertiesData, setPropertiesData] = useState<any>(null);
  const [metricsData, setMetricsData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Set up API key and load data
  useEffect(() => {
    mockawayApiWithAuth.setApiKey('demo-api-key-12345');
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      // Test connection
      const health = await mockawayApiWithAuth.healthCheck();
      setHealthData(health);
      setIsConnected(true);
      setConnectionError(null);

      // Load reviews
      const reviews = await mockawayApiWithAuth.getReviews();
      setReviewsData(reviews);

      // Load properties
      const properties = await mockawayApiWithAuth.getProperties();
      setPropertiesData(properties);

      // Load metrics
      const metrics = await mockawayApiWithAuth.getAllPropertyMetrics();
      setMetricsData(metrics);

    } catch (error) {
      setIsConnected(false);
      setConnectionError(error instanceof Error ? error.message : 'Connection failed');
    } finally {
      setIsLoading(false);
      setConnectionLoading(false);
    }
  };

  const reconnect = () => {
    setConnectionLoading(true);
    loadData();
  };

  // Note: Review status management removed as it's not needed

  const handleReconnect = () => {
    reconnect();
    toast({
      title: "Reconnecting",
      description: "Attempting to reconnect to Mockaway API...",
    });
  };

  const ConnectionStatus = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Server className="h-5 w-5" />
          Mockaway API Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {connectionLoading ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : isConnected ? (
              <Wifi className="h-4 w-4 text-green-500" />
            ) : (
              <WifiOff className="h-4 w-4 text-red-500" />
            )}
            <span className="font-medium">
              {connectionLoading ? 'Checking...' : isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
          <Badge variant={isConnected ? 'default' : 'destructive'}>
            {isConnected ? 'Online' : 'Offline'}
          </Badge>
        </div>

        {connectionError && (
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertDescription>
              Connection Error: {connectionError}
            </AlertDescription>
          </Alert>
        )}

        {healthData && (
          <div className="text-sm text-muted-foreground">
            <p>Service: {healthData.service}</p>
            <p>Version: {healthData.version}</p>
            <p>Last Check: {new Date(healthData.timestamp).toLocaleTimeString()}</p>
          </div>
        )}

        {!isConnected && (
          <Button onClick={handleReconnect} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Reconnect
          </Button>
        )}
      </CardContent>
    </Card>
  );

  const ReviewsOverview = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Reviews Overview
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4 animate-spin" />
            <span>Loading reviews...</span>
          </div>
        ) : connectionError ? (
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertDescription>
              Failed to load reviews: {connectionError}
            </AlertDescription>
          </Alert>
        ) : reviewsData ? (
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">
                {reviewsData.result.length}
              </div>
              <div className="text-sm text-muted-foreground">Total Reviews</div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Recent Reviews</h4>
              {reviewsData.result.slice(0, 3).map((review) => (
                <div key={review.id} className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-medium">{review.guestName}</div>
                    <div className="text-sm text-muted-foreground">{review.listingName}</div>
                  </div>
                  <div className="text-sm text-muted-foreground mb-2">
                    {review.publicReview}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm font-medium">
                        {review.rating ? `${review.rating}/10` : 'N/A'}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(review.submittedAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );

  const PropertiesOverview = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Properties Overview
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4 animate-spin" />
            <span>Loading properties...</span>
          </div>
        ) : connectionError ? (
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertDescription>
              Failed to load properties: {connectionError}
            </AlertDescription>
          </Alert>
        ) : propertiesData ? (
          <div className="space-y-3">
            {propertiesData.map((property) => (
              <div key={property.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <div className="font-medium">{property.name}</div>
                  <div className="text-sm text-muted-foreground">{property.location}</div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span className="font-medium">{property.averageRating.toFixed(1)}</span>
                  </div>
                  <Badge variant="outline">{property.totalReviews} reviews</Badge>
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );

  const MetricsOverview = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Metrics Overview
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4 animate-spin" />
            <span>Loading metrics...</span>
          </div>
        ) : connectionError ? (
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertDescription>
              Failed to load metrics: {connectionError}
            </AlertDescription>
          </Alert>
        ) : metricsData ? (
          <div className="space-y-3">
            {metricsData.map((metric) => (
              <div key={metric.propertyId} className="p-3 border rounded-lg">
                <div className="font-medium mb-2">Property {metric.propertyId}</div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-muted-foreground">Average Rating</div>
                    <div className="font-medium">{metric.averageRating.toFixed(1)}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Response Rate</div>
                    <div className="font-medium">{metric.responseRate}%</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Total Reviews</div>
                    <div className="font-medium">{metric.totalReviews}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Trend</div>
                    <Badge variant={
                      metric.recentTrend === 'up' ? 'default' :
                      metric.recentTrend === 'down' ? 'destructive' : 'secondary'
                    }>
                      {metric.recentTrend}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Mockaway API Integration</h2>
        <p className="text-muted-foreground">
          Real-time integration with the Mockaway API service
        </p>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="status">Connection Status</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
          <TabsTrigger value="properties">Properties</TabsTrigger>
          <TabsTrigger value="metrics">Metrics</TabsTrigger>
        </TabsList>

        <TabsContent value="status" className="space-y-4">
          <ConnectionStatus />
        </TabsContent>

        <TabsContent value="reviews" className="space-y-4">
          <ReviewsOverview />
        </TabsContent>

        <TabsContent value="properties" className="space-y-4">
          <PropertiesOverview />
        </TabsContent>

        <TabsContent value="metrics" className="space-y-4">
          <MetricsOverview />
        </TabsContent>
      </Tabs>
    </div>
  );
}
