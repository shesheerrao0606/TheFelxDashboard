// Hostaway API Response Example
export interface HostawayReviewCategory {
  category: string;
  rating: number;
}

export interface HostawayReview {
  id: number;
  type: string;
  status: string;
  rating: number | null;
  publicReview: string;
  reviewCategory: HostawayReviewCategory[];
  submittedAt: string;
  guestName: string;
  listingName: string;
}

export interface HostawayApiResponse {
  status: string;
  result: HostawayReview[];
}

// Example Hostaway API Response
export const hostawayApiResponseExample: HostawayApiResponse = {
  "status": "success",
  "result": [
    {
      "id": 7453,
      "type": "host-to-guest",
      "status": "published",
      "rating": null,
      "publicReview": "Shane and family are wonderful! Would definitely host again :)",
      "reviewCategory": [
        {
          "category": "cleanliness",
          "rating": 10
        },
        {
          "category": "communication",
          "rating": 10
        },
        {
          "category": "respect_house_rules",
          "rating": 10
        }
      ],
      "submittedAt": "2020-08-21 22:45:14",
      "guestName": "Shane Finkelstein",
      "listingName": "2B N1 A - 29 Shoreditch Heights"
    },
    {
      "id": 7454,
      "type": "guest-to-host",
      "status": "published",
      "rating": 9,
      "publicReview": "Amazing stay! The property was exactly as described and Shane was very responsive. The location is perfect for exploring the city.",
      "reviewCategory": [
        {
          "category": "cleanliness",
          "rating": 9
        },
        {
          "category": "communication",
          "rating": 10
        },
        {
          "category": "location",
          "rating": 10
        },
        {
          "category": "value",
          "rating": 8
        }
      ],
      "submittedAt": "2020-08-22 14:30:22",
      "guestName": "Maria Rodriguez",
      "listingName": "Downtown Luxury Loft"
    },
    {
      "id": 7455,
      "type": "guest-to-host", 
      "status": "pending",
      "rating": 7,
      "publicReview": "Good location but some maintenance issues. The host was quick to respond to our concerns.",
      "reviewCategory": [
        {
          "category": "cleanliness",
          "rating": 6
        },
        {
          "category": "communication",
          "rating": 9
        },
        {
          "category": "location",
          "rating": 9
        },
        {
          "category": "amenities",
          "rating": 5
        }
      ],
      "submittedAt": "2020-08-23 09:15:33",
      "guestName": "David Chen",
      "listingName": "Cozy Brooklyn Apartment"
    }
  ]
};