import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, Database } from 'lucide-react';

export function HostawayIntegrationBadge() {
  return (
    <Card className="bg-purple-50 border-purple-200">
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-purple-700">
            <Database className="h-4 w-4" />
            <span className="font-medium text-sm">Hostaway Integration</span>
          </div>
          <Badge variant="secondary" className="bg-success text-success-foreground flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            Connected
          </Badge>
        </div>
        <p className="text-xs text-purple-600 mt-2">
          Reviews are now being synchronized from your Hostaway account and transformed to match the dashboard format.
        </p>
      </CardContent>
    </Card>
  );
}