import {Offer, OffersByCity} from '../types/offer.ts';
import {CitiesMap} from '../types/city.ts';

export const extractCities = (offers: Offer[]): CitiesMap => {
  const cities: CitiesMap = {};
  offers.forEach((offer) => {
    if (!Object.hasOwn(cities, offer.city.name)) {
      cities[offer.city.name] = {...offer.city};
    }
  });
  return cities;
};

export const groupOffersByCity = (offers: Offer[]): OffersByCity => {
  const offersByCity: OffersByCity = {};
  offers.forEach((offer) => {
    const city = offer.city.name;
    if (!Object.hasOwn(offersByCity, city)) {
      offersByCity[city] = [];
    }
    offersByCity[city].push(offer);
  });
  return offersByCity;
};
