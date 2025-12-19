import { Location } from './location.ts';
import {City} from './city';

export enum PlaceType {
  Room = 'room',
  Apartment = 'apartment',
}

export type Offer = {
  id: string;
  title: string;
  type: PlaceType;
  price: number;
  city: City;
  location: Location;
  isFavorite: boolean;
  isPremium: boolean;
  rating: 1 | 2 | 3 | 4 | 5;
  previewImage: string;
}

export type OffersByCity = Record<Offer['city']['name'], Offer[]>;
