// Mockaway API Server - Mock API for property reviews and metrics
import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3001;

const reviewStatuses = new Map();
const mockReviews = [
  {
    id: 7453,
    type: "host-to-guest",
    rating: null,
    publicReview: "Shane and family are wonderful! Would definitely host again :)",
    reviewCategory: [
      { category: "cleanliness", rating: 10 },
      { category: "communication", rating: 10 },
      { category: "respect_house_rules", rating: 10 }
    ],
    submittedAt: "2024-01-20 22:45:14",
    guestName: "Shane Finkelstein",
    listingName: "2B N1 A - 29 Shoreditch Heights"
  },
  {
    id: 7454,
    type: "guest-to-host",
    rating: 9,
    publicReview: "Amazing stay! The property was exactly as described and Shane was very responsive. The location is perfect for exploring the city.",
    reviewCategory: [
      { category: "cleanliness", rating: 9 },
      { category: "communication", rating: 10 },
      { category: "location", rating: 10 },
      { category: "value", rating: 8 }
    ],
    submittedAt: "2024-01-19 14:30:22",
    guestName: "Maria Rodriguez",
    listingName: "Downtown Luxury Loft"
  },
  {
    id: 7455,
    type: "guest-to-host",
    rating: 7,
    publicReview: "Good location but some maintenance issues. The host was quick to respond to our concerns.",
    reviewCategory: [
      { category: "cleanliness", rating: 6 },
      { category: "communication", rating: 9 },
      { category: "location", rating: 9 },
      { category: "amenities", rating: 5 }
    ],
    submittedAt: "2024-01-18 09:15:33",
    guestName: "David Chen",
    listingName: "Cozy Brooklyn Apartment"
  },
  {
    id: 7456,
    type: "guest-to-host",
    rating: 10,
    publicReview: "Absolutely perfect! This place exceeded all expectations. The host was incredibly helpful and the property was spotless.",
    reviewCategory: [
      { category: "cleanliness", rating: 10 },
      { category: "communication", rating: 10 },
      { category: "location", rating: 10 },
      { category: "value", rating: 10 },
      { category: "amenities", rating: 10 }
    ],
    submittedAt: "2024-01-17 16:20:45",
    guestName: "Jennifer Liu",
    listingName: "Modern Studio Space"
  },
  {
    id: 7457,
    type: "guest-to-host",
    rating: 6,
    publicReview: "The place was okay but had some issues. The Wi-Fi was unreliable and the heating didn't work properly.",
    reviewCategory: [
      { category: "cleanliness", rating: 7 },
      { category: "communication", rating: 8 },
      { category: "location", rating: 8 },
      { category: "value", rating: 5 },
      { category: "amenities", rating: 4 }
    ],
    submittedAt: "2024-01-16 11:30:12",
    guestName: "Robert Johnson",
    listingName: "Downtown Luxury Loft"
  },
  {
    id: 7458,
    type: "guest-to-host",
    rating: 8,
    publicReview: "Great location and comfortable stay. The host was very accommodating and the apartment was clean and well-equipped.",
    reviewCategory: [
      { category: "cleanliness", rating: 8 },
      { category: "communication", rating: 9 },
      { category: "location", rating: 9 },
      { category: "value", rating: 7 },
      { category: "amenities", rating: 8 }
    ],
    submittedAt: "2024-01-15 18:45:30",
    guestName: "Sarah Williams",
    listingName: "Cozy Brooklyn Apartment"
  },
  {
    id: 7459,
    type: "guest-to-host",
    rating: 5,
    publicReview: "Average experience. The place was clean but quite noisy due to street traffic. Good for a short stay.",
    reviewCategory: [
      { category: "cleanliness", rating: 7 },
      { category: "communication", rating: 6 },
      { category: "location", rating: 4 },
      { category: "value", rating: 6 },
      { category: "amenities", rating: 5 }
    ],
    submittedAt: "2024-01-14 12:20:15",
    guestName: "Michael Brown",
    listingName: "Modern Studio Space"
  },
  {
    id: 7460,
    type: "guest-to-host",
    rating: 9,
    publicReview: "Exceptional stay! The loft was beautifully designed and the host provided excellent recommendations for local restaurants.",
    reviewCategory: [
      { category: "cleanliness", rating: 9 },
      { category: "communication", rating: 10 },
      { category: "location", rating: 9 },
      { category: "value", rating: 8 },
      { category: "amenities", rating: 9 }
    ],
    submittedAt: "2024-01-13 20:15:45",
    guestName: "Emily Davis",
    listingName: "Downtown Luxury Loft"
  },
  {
    id: 7461,
    type: "guest-to-host",
    rating: 4,
    publicReview: "Disappointing experience. The apartment was not as described and had several maintenance issues.",
    reviewCategory: [
      { category: "cleanliness", rating: 5 },
      { category: "communication", rating: 4 },
      { category: "location", rating: 6 },
      { category: "value", rating: 3 },
      { category: "amenities", rating: 4 }
    ],
    submittedAt: "2024-01-12 14:30:20",
    guestName: "James Wilson",
    listingName: "Cozy Brooklyn Apartment"
  },
  {
    id: 7462,
    type: "guest-to-host",
    rating: 7,
    publicReview: "Nice studio with good amenities. The location was convenient and the host was responsive to messages.",
    reviewCategory: [
      { category: "cleanliness", rating: 7 },
      { category: "communication", rating: 8 },
      { category: "location", rating: 8 },
      { category: "value", rating: 7 },
      { category: "amenities", rating: 6 }
    ],
    submittedAt: "2024-01-11 16:45:10",
    guestName: "Lisa Anderson",
    listingName: "Modern Studio Space"
  },
  {
    id: 7463,
    type: "guest-to-host",
    rating: 10,
    publicReview: "Perfect stay! Everything was exactly as advertised. The loft was spacious, clean, and in a fantastic location.",
    reviewCategory: [
      { category: "cleanliness", rating: 10 },
      { category: "communication", rating: 10 },
      { category: "location", rating: 10 },
      { category: "value", rating: 9 },
      { category: "amenities", rating: 10 }
    ],
    submittedAt: "2024-01-10 11:20:35",
    guestName: "Alex Thompson",
    listingName: "Downtown Luxury Loft"
  },
  {
    id: 7464,
    type: "guest-to-host",
    rating: 6,
    publicReview: "Decent place but could use some improvements. The bed was comfortable but the kitchen was quite small.",
    reviewCategory: [
      { category: "cleanliness", rating: 6 },
      { category: "communication", rating: 7 },
      { category: "location", rating: 7 },
      { category: "value", rating: 6 },
      { category: "amenities", rating: 5 }
    ],
    submittedAt: "2024-01-09 19:30:25",
    guestName: "Rachel Green",
    listingName: "Cozy Brooklyn Apartment"
  },
  {
    id: 7465,
    type: "guest-to-host",
    rating: 8,
    publicReview: "Great value for money! The studio was modern and well-maintained. Would definitely stay again.",
    reviewCategory: [
      { category: "cleanliness", rating: 8 },
      { category: "communication", rating: 8 },
      { category: "location", rating: 8 },
      { category: "value", rating: 9 },
      { category: "amenities", rating: 7 }
    ],
    submittedAt: "2024-01-08 15:15:40",
    guestName: "Tom Martinez",
    listingName: "Modern Studio Space"
  },
  {
    id: 7466,
    type: "guest-to-host",
    rating: 3,
    publicReview: "Not recommended. The place was dirty and the host was unresponsive. Many issues with basic amenities.",
    reviewCategory: [
      { category: "cleanliness", rating: 3 },
      { category: "communication", rating: 2 },
      { category: "location", rating: 5 },
      { category: "value", rating: 2 },
      { category: "amenities", rating: 3 }
    ],
    submittedAt: "2024-01-07 10:45:15",
    guestName: "Kevin Lee",
    listingName: "Downtown Luxury Loft"
  }
];

const getMockawayReviews = () => ({
  status: 'success',
  result: mockReviews
});

const getMockawayReviewById = (id) => {
  return mockReviews.find(review => review.id === id);
};

// Middleware
app.use(cors());
app.use(express.json());

// API Key validation middleware
const validateApiKey = (req, res, next) => {
  const apiKey = req.headers['x-api-key'] || req.headers['authorization']?.replace('Bearer ', '');
  
  const validApiKeys = [
    'demo-api-key-12345',
    'test-api-key-67890',
    'dev-api-key-abcdef',
    'prod-api-key-xyz789'
  ];

  // Skip API key validation for health check
  if (req.path === '/api/mockaway/health') {
    return next();
  }

  if (!apiKey) {
    return res.status(401).json({ 
      error: 'API key required',
      message: 'Please provide an API key in the X-API-Key header or Authorization header'
    });
  }

  if (!validApiKeys.includes(apiKey)) {
    return res.status(401).json({ 
      error: 'Invalid API key',
      message: 'The provided API key is not valid'
    });
  }

  // Rate limiting removed for reliable development

  next();
};

app.use('/api/mockaway', (req, res, next) => {
  if (req.path === '/health') {
    return next();
  }
  validateApiKey(req, res, next);
});

// Health check endpoint
app.get('/api/mockaway/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'Mockaway API',
    version: '1.0.0'
  });
});


app.get('/api/mockaway/reviews', (req, res) => {
  const { property } = req.query;
  let reviews = getMockawayReviews();

  reviews.result = reviews.result.map(review => {
    const status = reviewStatuses.get(review.id.toString()) || 'pending';
    return {
      ...review,
      status: status
    };
  });

  if (property) {
    reviews.result = reviews.result.filter(review => 
      review.listingName.toLowerCase().includes(property.toLowerCase())
    );
  }

  res.json(reviews);
});

app.get('/api/mockaway/reviews/:id', (req, res) => {
  const { id } = req.params;
  const review = getMockawayReviewById(parseInt(id));

  if (!review) {
    return res.status(404).json({ error: 'Review not found' });
  }

  res.json(review);
});


app.get('/api/mockaway/properties', (req, res) => {

    const properties = [
      {
        id: 'prop-1',
        name: 'Downtown Luxury Loft',
        location: 'Manhattan, NYC',
        type: 'loft',
        averageRating: 4.8,
        totalReviews: 127,
        approvedReviews: 98
      },
      {
        id: 'prop-2',
        name: 'Cozy Brooklyn Apartment',
        location: 'Brooklyn, NYC',
        type: 'apartment',
        averageRating: 4.6,
        totalReviews: 89,
        approvedReviews: 76
      },
      {
        id: 'prop-3',
        name: 'Modern Studio Space',
        location: 'Queens, NYC',
        type: 'studio',
        averageRating: 4.4,
        totalReviews: 56,
        approvedReviews: 45
      }
    ];

    res.json(properties);
});

function calculatePropertyMetrics(propertyId, reviews) {
  const propertyReviews = reviews.filter(review => {
    const propertyMapping = {
      'Downtown Luxury Loft': 'prop-1',
      'Cozy Brooklyn Apartment': 'prop-2', 
      'Modern Studio Space': 'prop-3',
      '2B N1 A - 29 Shoreditch Heights': 'prop-1'
    };
    return propertyMapping[review.listingName] === propertyId;
  });

  if (propertyReviews.length === 0) {
    return {
      propertyId,
      averageRating: 0,
      totalReviews: 0,
      approvedReviews: 0,
      channelBreakdown: {},
      categoryRatings: {},
      recentTrend: 'stable',
      responseRate: 0
    };
  }

  const ratings = propertyReviews.map(r => r.rating).filter(r => r !== null);
  const averageRating = ratings.length > 0 ? (ratings.reduce((sum, r) => sum + r, 0) / ratings.length) / 2 : 0;

  const channelBreakdown = {};
  propertyReviews.forEach(review => {
    const channel = review.type === 'guest-to-host' ? 'hostaway' : 'hostaway';
    channelBreakdown[channel] = (channelBreakdown[channel] || 0) + 1;
  });

  const categoryRatings = {};
  const categoryCounts = {};
  
  propertyReviews.forEach(review => {
    if (review.reviewCategory) {
      review.reviewCategory.forEach(cat => {
        if (!categoryRatings[cat.category]) {
          categoryRatings[cat.category] = 0;
          categoryCounts[cat.category] = 0;
        }
        const convertedRating = cat.rating / 2;
        categoryRatings[cat.category] += convertedRating;
        categoryCounts[cat.category] += 1;
      });
    }
  });

  Object.keys(categoryRatings).forEach(category => {
    categoryRatings[category] = Math.round((categoryRatings[category] / categoryCounts[category]) * 10) / 10;
  });

  const approvedReviews = propertyReviews.filter(review => {
    const status = reviewStatuses.get(review.id.toString()) || 'pending';
    return status === 'approved';
  }).length;

  const responseRate = 100;

  return {
    propertyId,
    averageRating: Math.round(averageRating * 10) / 10,
    totalReviews: propertyReviews.length,
    approvedReviews: approvedReviews,
    channelBreakdown,
    categoryRatings,
    recentTrend: 'stable',
    responseRate
  };
}

app.get('/api/mockaway/properties/:id/metrics', (req, res) => {
  const { id } = req.params;
  const reviews = getMockawayReviews().result;
  
  const metrics = calculatePropertyMetrics(id, reviews);
  res.json(metrics);
});

app.get('/api/mockaway/properties/metrics', (req, res) => {
  const propertyIds = ['prop-1', 'prop-2', 'prop-3'];
  const reviews = getMockawayReviews().result;
  
  const allMetrics = propertyIds.map(id => calculatePropertyMetrics(id, reviews));
  res.json(allMetrics);
});

app.patch('/api/mockaway/reviews/:id/status', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  
  if (!['approved', 'rejected', 'pending'].includes(status)) {
    return res.status(400).json({ 
      error: 'Invalid status', 
      message: 'Status must be approved, rejected, or pending' 
    });
  }
  
  reviewStatuses.set(id.toString(), status);
  
  res.json({
    success: true,
    message: `Review status updated to ${status}`,
    reviewId: id,
    newStatus: status
  });
});

app.use((error, req, res, next) => {
  console.error('Mockaway API Error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

app.use('*', (req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 Mockaway API Server running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/mockaway/health`);
  console.log(`📝 Reviews: http://localhost:${PORT}/api/mockaway/reviews`);
  console.log(`🏠 Properties: http://localhost:${PORT}/api/mockaway/properties`);
  console.log(`📈 Metrics: http://localhost:${PORT}/api/mockaway/properties/metrics`);
});

export default app;
