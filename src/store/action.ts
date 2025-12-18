import {Offer} from '../types/offer.ts';
import {createAction} from '@reduxjs/toolkit';
import {City} from '../types/city.ts';

export const setCity = createAction<City>('city/set');
export const setOffers = createAction<Offer[]>('offers/set');
export const setActiveOffer = createAction<Offer['id']>('offerActive/set');
