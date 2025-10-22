export enum PlaceType {
  Room = 'Room',
  Apartment = 'Apartment',
}

export enum Cities {
  Amsterdam = 'Amsterdam',
  Paris = 'Paris',
  Cologne = 'Cologne',
  Brussels = 'Brussels',
  Hamburg = 'Hamburg',
  Dusseldorf = 'Dusseldorf',
}

export type Offer = {
  id: number;
  placeImageSrc: string;
  isPremium: boolean;
  price: number;
  starsCount: 1 | 2 | 3 | 4 | 5;
  isBookmarked: boolean;
  placeName: string;
  placeType: PlaceType;
  city: Cities;
}
