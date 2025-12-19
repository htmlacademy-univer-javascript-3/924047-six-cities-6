import {City} from '../types/city.ts';

export enum Cities {
  Amsterdam = 'Amsterdam',
  Paris = 'Paris',
  Cologne = 'Cologne',
  Brussels = 'Brussels',
  Hamburg = 'Hamburg',
  Dusseldorf = 'Dusseldorf',
}

export const defaultCity: City = {
  name: 'Amsterdam',
  location: {latitude: 52.37454, longitude: 4.897976, zoom: 13},
};
