import { Location } from './location.ts';
import {City} from './city';
import {User} from './user.ts';

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

export type OfferDetails = Omit<Offer, 'previewImage'> & {
  description: string;
  bedrooms: number;
  goods: string[];
  host: User;
  images: string[];
  maxAdults: number;
}

export type OffersByCity = Record<Offer['city']['name'], Offer[]>;
