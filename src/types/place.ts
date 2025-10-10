export enum PlaceType {
  Room = 'Room',
  Apartment = 'Apartment',
}

export type Place = {
  id: number;
  placeImageSrc: string;
  isPremium: boolean;
  price: number;
  starsCount: 1 | 2 | 3 | 4 | 5;
  isBookmarked: boolean;
  placeName: string;
  placeType: PlaceType;
}
