import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Key, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Copy, 
  Eye, 
  EyeOff,
  RefreshCw
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { mockawayApiWithAuth, API_KEY_UTILS } from '@/services/mockawayApiWithAuth';

export function ApiKeyDemo() {
  const [apiKey, setApiKey] = useState('demo-api-key-12345');
  const [showApiKey, setShowApiKey] = useState(false);
  const [testResult, setTestResult] = useState<{ valid: boolean; message: string } | null>(null);
  const [isTesting, setIsTesting] = useState(false);
  const { toast } = useToast();

  const validApiKeys = API_KEY_UTILS.getValidKeys();

  const handleTestApiKey = async () => {
    setIsTesting(true);
    setTestResult(null);

    try {
      // Update the service with the new API key
      mockawayApiWithAuth.setApiKey(apiKey);
      
      // Test the API key
      const result = await mockawayApiWithAuth.testApiKey();
      setTestResult(result);
      
      if (result.valid) {
        toast({
          title: "API Key Valid",
          description: "Your API key is working correctly!",
        });
      } else {
        toast({
          title: "API Key Invalid",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setTestResult({ valid: false, message: errorMessage });
      toast({
        title: "Test Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleGenerateKey = () => {
    const newKey = API_KEY_UTILS.generateDemoKey();
    setApiKey(newKey);
    setTestResult(null);
    toast({
      title: "New API Key Generated",
      description: "A new demo API key has been generated.",
    });
  };

  const handleCopyKey = () => {
    navigator.clipboard.writeText(apiKey);
    toast({
      title: "API Key Copied",
      description: "API key has been copied to clipboard.",
    });
  };

  const handleUseValidKey = (key: string) => {
    setApiKey(key);
    setTestResult(null);
  };

  const ApiKeyInput = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Key className="h-5 w-5" />
          API Key Configuration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="api-key">API Key</Label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Input
                id="api-key"
                type={showApiKey ? "text" : "password"}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter your API key"
                className="pr-20"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                onClick={() => setShowApiKey(!showApiKey)}
              >
                {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            <Button onClick={handleCopyKey} variant="outline" size="sm">
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex gap-2">
          <Button onClick={handleTestApiKey} disabled={isTesting || !apiKey}>
            {isTesting ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Testing...
              </>
            ) : (
              'Test API Key'
            )}
          </Button>
          <Button onClick={handleGenerateKey} variant="outline">
            Generate Demo Key
          </Button>
        </div>

        {testResult && (
          <Alert variant={testResult.valid ? "default" : "destructive"}>
            {testResult.valid ? (
              <CheckCircle className="h-4 w-4" />
            ) : (
              <XCircle className="h-4 w-4" />
            )}
            <AlertDescription>
              {testResult.message}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );

  const ValidKeysDemo = () => (
    <Card>
      <CardHeader>
        <CardTitle>Valid Demo API Keys</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            These are the valid API keys for the Mockaway API demo:
          </p>
          {validApiKeys.map((key) => (
            <div key={key} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-2">
                <code className="text-sm bg-muted px-2 py-1 rounded">
                  {API_KEY_UTILS.maskApiKey(key)}
                </code>
                <Badge variant="outline">Valid</Badge>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleUseValidKey(key)}
              >
                Use This Key
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  const ApiKeyUsage = () => (
    <Card>
      <CardHeader>
        <CardTitle>How API Keys Work</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div>
            <h4 className="font-medium mb-2">1. Authentication</h4>
            <p className="text-sm text-muted-foreground">
              API keys authenticate your requests to the Mockaway API. Without a valid key, 
              you'll get a 401 Unauthorized error.
            </p>
          </div>

          <div>
            <h4 className="font-medium mb-2">2. Rate Limiting</h4>
            <p className="text-sm text-muted-foreground">
              The API includes rate limiting simulation. You might occasionally get a 429 
              "Too Many Requests" error to test your error handling.
            </p>
          </div>

          <div>
            <h4 className="font-medium mb-2">3. Security</h4>
            <p className="text-sm text-muted-foreground">
              In production, API keys should be stored securely and never exposed in client-side code. 
              This demo shows how they work, but real implementations use environment variables.
            </p>
          </div>
        </div>

        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Security Note:</strong> In a real application, API keys should be stored in 
            environment variables and never hardcoded in your frontend code.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );

  const CodeExample = () => (
    <Card>
      <CardHeader>
        <CardTitle>Code Example</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">Using API Key in Requests</h4>
            <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
{`// Method 1: X-API-Key header
const response = await fetch('/api/mockaway/reviews', {
  headers: {
    'X-API-Key': 'your-api-key-here',
    'Content-Type': 'application/json'
  }
});

// Method 2: Authorization header (Bearer token)
const response = await fetch('/api/mockaway/reviews', {
  headers: {
    'Authorization': 'Bearer your-api-key-here',
    'Content-Type': 'application/json'
  }
});

// Method 3: Using the service class
const api = new MockawayApiServiceWithAuth();
api.setApiKey('your-api-key-here');
const reviews = await api.getReviews();`}
            </pre>
          </div>

          <div>
            <h4 className="font-medium mb-2">Error Handling</h4>
            <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
{`try {
  const reviews = await api.getReviews();
} catch (error) {
  if (error.message.includes('Invalid API key')) {
    // Handle authentication error
    console.error('Please check your API key');
  } else if (error.message.includes('Rate limit exceeded')) {
    // Handle rate limiting
    console.error('Too many requests, please wait');
  } else {
    // Handle other errors
    console.error('API request failed:', error.message);
  }
}`}
            </pre>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">API Key Authentication Demo</h2>
        <p className="text-muted-foreground">
          Learn how API keys work with the Mockaway API
        </p>
      </div>

      <Tabs defaultValue="input" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="input">API Key Input</TabsTrigger>
          <TabsTrigger value="valid-keys">Valid Keys</TabsTrigger>
          <TabsTrigger value="usage">How It Works</TabsTrigger>
          <TabsTrigger value="code">Code Examples</TabsTrigger>
        </TabsList>

        <TabsContent value="input" className="space-y-4">
          <ApiKeyInput />
        </TabsContent>

        <TabsContent value="valid-keys" className="space-y-4">
          <ValidKeysDemo />
        </TabsContent>

        <TabsContent value="usage" className="space-y-4">
          <ApiKeyUsage />
        </TabsContent>

        <TabsContent value="code" className="space-y-4">
          <CodeExample />
        </TabsContent>
      </Tabs>
    </div>
  );
}
