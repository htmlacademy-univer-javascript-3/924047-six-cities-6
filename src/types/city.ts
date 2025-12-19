import {Location} from './location.ts';

export type City = {
  name: string;
  location: Location;
};

export type CitiesMap = Record<City['name'], City>;
