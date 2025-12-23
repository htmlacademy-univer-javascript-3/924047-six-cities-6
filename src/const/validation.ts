export const ReviewValidation = {
  MinLength: 50,
  MaxLength: 300,
} as const;

export const OfferLimits = {
  MaxImages: 6,
  MaxNearbyOffers: 3,
  MaxFeedbacks: 10,
} as const;

export const RatingDisplay = {
  StarPercentage: 20,
} as const;

export const FavoriteStatus = {
  NotFavorite: 0,
  Favorite: 1,
} as const;

