import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ExternalLink, MapPin, Star, AlertTriangle, CheckCircle, Info } from 'lucide-react';

export function GoogleReviewsExploration() {
  const implementationSteps = [
    {
      title: "Google Places API Setup",
      status: "feasible",
      description: "Register for Google Cloud Platform and enable Places API",
      requirements: ["Google Cloud account", "API key with Places API enabled", "Billing account"]
    },
    {
      title: "Places API Integration",
      status: "feasible", 
      description: "Use Place Details API to fetch reviews for each property",
      requirements: ["Place ID for each property", "API rate limiting consideration", "Review data parsing"]
    },
    {
      title: "Review Data Normalization",
      status: "complex",
      description: "Transform Google Reviews to match existing review structure",
      requirements: ["Data mapping logic", "Handle different rating scales", "Merge with existing reviews"]
    },
    {
      title: "Real-time Updates",
      status: "challenging",
      description: "Google doesn't provide webhooks, would need polling strategy",
      requirements: ["Scheduled API calls", "Change detection", "Rate limit management"]
    }
  ];

  const apiLimitations = [
    "Maximum 5 reviews returned per request",
    "Reviews older than 1 year may not be available", 
    "No webhook support for real-time updates",
    "Rate limits: 100,000 requests per day (can be increased)",
    "Costs apply per API request"
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'feasible': return <CheckCircle className="h-4 w-4 text-success" />;
      case 'complex': return <AlertTriangle className="h-4 w-4 text-warning" />;
      case 'challenging': return <AlertTriangle className="h-4 w-4 text-destructive" />;
      default: return <Info className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'feasible': return 'success';
      case 'complex': return 'outline';
      case 'challenging': return 'destructive';
      default: return 'secondary';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Google Reviews Integration Exploration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              <strong>Feasibility Assessment:</strong> Google Reviews integration is technically possible 
              using the Google Places API, but comes with limitations and costs. Below is a detailed analysis.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Implementation Steps</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {implementationSteps.map((step, index) => (
              <div key={index} className="border rounded-md p-4">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium flex items-center gap-2">
                    {getStatusIcon(step.status)}
                    {step.title}
                  </h4>
                  <Badge variant={getStatusColor(step.status) as any}>
                    {step.status}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{step.description}</p>
                <div className="space-y-1">
                  <p className="text-xs font-medium">Requirements:</p>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    {step.requirements.map((req, reqIndex) => (
                      <li key={reqIndex} className="flex items-center gap-1">
                        <div className="w-1 h-1 bg-muted-foreground rounded-full" />
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>API Limitations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {apiLimitations.map((limitation, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-warning mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{limitation}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recommended Approach</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="p-3 bg-success/10 rounded-md">
                  <h4 className="font-medium text-success mb-1">Phase 1: Basic Integration</h4>
                  <p className="text-sm">Implement Places API to fetch and display Google Reviews alongside existing reviews.</p>
                </div>
                
                <div className="p-3 bg-primary/10 rounded-md">
                  <h4 className="font-medium text-primary mb-1">Phase 2: Enhanced Features</h4>
                  <p className="text-sm">Add review comparison, sentiment analysis, and automated response suggestions.</p>
                </div>
                
                <div className="p-3 bg-muted rounded-md">
                  <h4 className="font-medium mb-1">Phase 3: Advanced Analytics</h4>
                  <p className="text-sm">Implement trend analysis, competitor comparison, and predictive insights.</p>
                </div>
              </div>

              <div className="pt-4 border-t">
                <Button className="w-full" variant="outline">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View Google Places API Documentation
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sample Implementation Code</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-muted rounded-md p-4 text-sm font-mono overflow-x-auto">
            <pre>{`// Google Places API integration example
const fetchGoogleReviews = async (placeId: string) => {
  const response = await fetch(
    \`https://maps.googleapis.com/maps/api/place/details/json?\` +
    \`place_id=\${placeId}&\` +
    \`fields=reviews,rating,user_ratings_total&\` +
    \`key=\${GOOGLE_PLACES_API_KEY}\`
  );
  
  const data = await response.json();
  
  return data.result.reviews?.map(review => ({
    id: \`google-\${review.time}\`,
    author: review.author_name,
    rating: review.rating,
    content: review.text,
    date: new Date(review.time * 1000).toISOString(),
    channel: 'google',
    profilePhoto: review.profile_photo_url
  })) || [];
};`}</pre>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}