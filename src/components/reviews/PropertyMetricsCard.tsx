import { Property, PropertyMetrics } from '@/types/reviews';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Star, TrendingUp, TrendingDown, Minus, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PropertyMetricsCardProps {
  property: Property;
  metrics: PropertyMetrics;
}

export function PropertyMetricsCard({ property, metrics }: PropertyMetricsCardProps) {
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-success" />;
      case 'down': return <TrendingDown className="h-4 w-4 text-destructive" />;
      case 'stable': return <Minus className="h-4 w-4 text-muted-foreground" />;
      default: return null;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return 'text-success';
      case 'down': return 'text-destructive';
      case 'stable': return 'text-muted-foreground';
      default: return '';
    }
  };

  const getChannelColor = (channel: string) => {
    switch (channel) {
      case 'airbnb': return 'bg-red-500';
      case 'booking': return 'bg-blue-500';
      case 'vrbo': return 'bg-yellow-500';
      case 'direct': return 'bg-success';
      case 'hostaway': return 'bg-purple-500';
      case 'google': return 'bg-gray-500';
      default: return 'bg-muted';
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={cn(
          "h-4 w-4",
          i < Math.floor(rating) ? "fill-accent text-accent" : "text-muted-foreground"
        )}
      />
    ));
  };

  return (
    <Card className="transition-all duration-200 hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg font-semibold">{property.name}</CardTitle>
            <p className="text-muted-foreground text-sm">{property.location}</p>
            <Badge variant="outline" className="mt-2 capitalize">
              {property.type}
            </Badge>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1 mb-1">
              {renderStars(metrics.averageRating)}
              <span className="ml-1 font-semibold">{metrics.averageRating.toFixed(1)}</span>
            </div>
            <div className={cn("flex items-center gap-1", getTrendColor(metrics.recentTrend))}>
              {getTrendIcon(metrics.recentTrend)}
              <span className="text-sm capitalize">{metrics.recentTrend}</span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0 space-y-4">
        {/* Review Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{metrics.totalReviews}</div>
            <div className="text-xs text-muted-foreground">Total Reviews</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-success">{metrics.approvedReviews}</div>
            <div className="text-xs text-muted-foreground">Approved</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-accent">{metrics.responseRate}%</div>
            <div className="text-xs text-muted-foreground">Response Rate</div>
          </div>
        </div>

        {/* Channel Breakdown */}
        <div>
          <h4 className="font-medium mb-2 flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Channel Distribution
          </h4>
          <div className="space-y-2">
            {Object.entries(metrics.channelBreakdown).map(([channel, count]) => {
              const percentage = (count / metrics.totalReviews) * 100;
              return (
                <div key={channel} className="flex items-center gap-2">
                  <div className={cn("w-3 h-3 rounded-full", getChannelColor(channel))} />
                  <span className="text-sm capitalize min-w-[60px]">{channel}</span>
                  <Progress value={percentage} className="flex-1 h-2" />
                  <span className="text-sm text-muted-foreground min-w-[30px]">{count}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Category Ratings */}
        <div>
          <h4 className="font-medium mb-2">Category Ratings</h4>
          <div className="grid grid-cols-1 gap-2">
            {Object.entries(metrics.categoryRatings).map(([category, rating]) => (
              <div key={category} className="flex items-center justify-between">
                <span className="text-sm capitalize">{category}</span>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    {renderStars(rating)}
                  </div>
                  <span className="text-sm font-medium min-w-[30px]">{rating.toFixed(1)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}