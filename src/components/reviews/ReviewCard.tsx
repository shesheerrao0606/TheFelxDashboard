import { Review } from '@/types/reviews';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star, ThumbsUp, CheckCircle, XCircle, Clock, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ReviewCardProps {
  review: Review;
  onApprove?: (reviewId: string) => void;
  onReject?: (reviewId: string) => void;
  showActions?: boolean;
  compact?: boolean;
  showPropertyName?: boolean;
}

export function ReviewCard({ 
  review, 
  onApprove, 
  onReject, 
  showActions = false,
  compact = false,
  showPropertyName = false
}: ReviewCardProps) {
  const getChannelColor = (channel: string) => {
    switch (channel) {
      case 'airbnb': return 'bg-red-100 text-red-800';
      case 'booking': return 'bg-blue-100 text-blue-800';
      case 'vrbo': return 'bg-yellow-100 text-yellow-800';
      case 'direct': return 'bg-success text-success-foreground';
      case 'hostaway': return 'bg-purple-100 text-purple-800';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="h-4 w-4 text-success" />;
      case 'rejected': return <XCircle className="h-4 w-4 text-destructive" />;
      case 'pending': return <Clock className="h-4 w-4 text-warning" />;
      default: return null;
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={cn(
          "h-4 w-4",
          i < rating ? "fill-accent text-accent" : "text-muted-foreground"
        )}
      />
    ));
  };

  return (
    <Card className={cn(
      "transition-all duration-200 hover:shadow-md",
      compact && "py-2"
    )}>
      <CardHeader className={cn("pb-3", compact && "pb-2")}>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={review.guestAvatar} />
              <AvatarFallback>{review.guestName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-semibold text-foreground">{review.guestName}</h4>
                {review.verifiedStay && (
                  <Badge variant="secondary" className="text-xs">Verified</Badge>
                )}
              </div>
              {showPropertyName && review.propertyName && (
                <div className="flex items-center gap-1 mt-1">
                  <MapPin className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">{review.propertyName}</span>
                </div>
              )}
              <div className="flex items-center gap-2 mt-1">
                <div className="flex items-center gap-1">
                  {renderStars(review.rating)}
                </div>
                <span className="text-sm text-muted-foreground">
                  {new Date(review.date).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={getChannelColor(review.channel)} variant="outline">
              {review.channel.toUpperCase()}
            </Badge>
            {getStatusIcon(review.status)}
          </div>
        </div>
      </CardHeader>

      <CardContent className={cn("pt-0", compact && "pt-0")}>
        {!compact && (
          <div className="mb-3">
            <h5 className="font-medium text-foreground mb-2">{review.title}</h5>
            <p className="text-muted-foreground leading-relaxed">{review.content}</p>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <ThumbsUp className="h-3 w-3" />
              {review.helpful}
            </span>
            <span>{review.stayDuration} nights</span>
            <Badge variant="outline" className="text-xs">
              {review.category}
            </Badge>
          </div>

          {showActions && review.status === 'pending' && (
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => onReject?.(review.id)}
                className="text-destructive hover:text-destructive"
              >
                <XCircle className="h-4 w-4 mr-1" />
                Reject
              </Button>
              <Button
                size="sm"
                onClick={() => onApprove?.(review.id)}
                className="bg-success hover:bg-success/90 text-success-foreground"
              >
                <CheckCircle className="h-4 w-4 mr-1" />
                Approve
              </Button>
            </div>
          )}
        </div>

        {review.response && !compact && (
          <div className="mt-4 p-3 bg-muted rounded-md">
            <div className="flex items-start gap-2">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-sm">Response from {review.response.author}</span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(review.response.date).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{review.response.content}</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}