# the flex. - Reviews Dashboard

Professional property management reviews dashboard with Mockaway API integration for managing guest feedback across multiple properties.

## How It Works

### Architecture Overview
The application consists of two main components:
1. **Frontend**: React-based dashboard running on port 8080
2. **Backend**: Express.js Mockaway API server running on port 3001

### Data Flow
1. **API Authentication**: All requests require valid API keys for security
2. **Data Fetching**: Frontend fetches reviews, properties, and metrics from Mockaway API
3. **Review Management**: Users can approve/reject reviews, with status persisted in localStorage
4. **Public Display**: Only approved reviews appear on the public-facing page

### API Key System
The application uses 4 pre-configured API keys for authentication:
- `demo-api-key-12345` (default)
- `test-api-key-67890` 
- `dev-api-key-abcdef`
- `prod-api-key-xyz789`

**How API Keys Work:**
- Server validates API keys on every request
- Frontend automatically includes the default key in all API calls
- Invalid keys return 401 Unauthorized errors
- Keys are sent via `X-API-Key` header

## Running the Application

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation
```bash
npm install
```

### Backend (Mockaway API Server)
```bash
npm run mockaway
```
- Server runs on `http://localhost:3001`
- Provides mock data for reviews, properties, and metrics
- Implements API key authentication
- Supports review status updates (approve/reject)

### Frontend (React Dashboard)
```bash
npm run dev
```
- Application runs on `http://localhost:8080`
- Hot reload enabled for development
- Connects to Mockaway API automatically

### Run Both Together
```bash
npm run dev:full
```
- Starts both backend and frontend simultaneously
- Uses concurrently to manage both processes

## Application Features

### Dashboard Page
- **Overview Stats**: Total reviews, average rating, response rate
- **Property Metrics**: Individual property performance cards
- **Review Management**: Filter and view all reviews
- **Real-time Data**: All metrics calculated from actual API data

### Properties Page
- **Property Selection**: Choose specific property to manage
- **Review Approval**: Approve/reject individual reviews
- **Status Management**: Only pending reviews shown by default
- **Toast Notifications**: Feedback for approval actions

### Public Reviews Page
- **Approved Reviews Only**: Displays only approved reviews
- **Property Filtering**: Filter by specific property or view all
- **Guest-Facing**: Clean, public-friendly interface
- **Property Names**: Shows which property each review belongs to

### API Integration Features
- **Authentication**: Secure API key validation
- **Error Handling**: Graceful error states and loading indicators
- **Data Transformation**: Converts Hostaway API format to application format
- **Status Persistence**: Review approvals saved in localStorage
- **Real-time Updates**: UI updates immediately after actions

## Technical Implementation

### Backend (Mockaway API)
- **Express.js Server**: RESTful API endpoints
- **CORS Enabled**: Allows frontend requests
- **In-memory Storage**: Review statuses stored in Map
- **Data Validation**: Input validation and error handling
- **Metrics Calculation**: Dynamic calculation from review data

### Frontend Architecture
- **React + TypeScript**: Type-safe component development
- **React Router**: Client-side routing between pages
- **React Query**: API state management and caching
- **Tailwind CSS**: Utility-first styling
- **shadcn/ui**: Pre-built component library

### Key Components
- **FlexLogo**: Reusable brand logo component
- **ReviewCard**: Individual review display with actions
- **PropertyMetricsCard**: Property performance visualization
- **ReviewFilters**: Filtering and search functionality
- **Navigation**: Main app navigation with branding

### Data Management
- **API Service**: Centralized API communication
- **Data Transformation**: Hostaway format to app format
- **Status Manager**: localStorage-based review approval tracking
- **Error Boundaries**: Graceful error handling

## API Endpoints

### Reviews
- `GET /api/mockaway/reviews` - Get all reviews
- `GET /api/mockaway/reviews/:id` - Get specific review
- `PATCH /api/mockaway/reviews/:id/status` - Update review status

### Properties
- `GET /api/mockaway/properties` - Get all properties
- `GET /api/mockaway/properties/:id/metrics` - Get property metrics
- `GET /api/mockaway/properties/metrics` - Get all property metrics

### Health
- `GET /api/mockaway/health` - API health check

## Development

### Project Structure
```
src/
├── components/          # Reusable UI components
├── pages/              # Main application pages
├── services/           # API communication
├── utils/              # Utility functions
├── types/              # TypeScript type definitions
└── data/               # Mock data and interfaces
```

### Key Files
- `mockaway-server.js` - Backend API server
- `src/services/mockawayApiWithAuth.ts` - API service with authentication
- `src/utils/hostawayTransformer.ts` - Data transformation utilities
- `src/utils/reviewStatusManager.ts` - Review approval management

## Deployment

### Vercel Deployment

The application is configured for easy deployment on Vercel:

1. **Connect Repository**: Link your GitHub repository to Vercel
2. **Environment Variables**: Set `VITE_MOCKAWAY_API_KEY` in Vercel dashboard
3. **Build Settings**: Vercel will automatically detect the Vite configuration
4. **Deploy**: Click deploy and your app will be live!

**Vercel Configuration:**
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

**Environment Variables for Vercel:**
```
VITE_MOCKAWAY_API_KEY=demo-api-key-12345
```

**Note**: The Mockaway API server runs locally. For production, you'll need to deploy the backend separately or use a real API.

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Backend**: Express.js, Node.js
- **Styling**: Tailwind CSS, shadcn/ui
- **State Management**: React Query, localStorage
- **Routing**: React Router DOM
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Deployment**: Vercel-ready
