import {SelectOption} from '../types/select.ts';
import {Offer} from '../types/offer.ts';

export function getSortedOffers(offers: Offer[], sortOption: SelectOption['key']): Offer[] {
  const sorted = [...offers];

  switch (sortOption) {
    case 'price_LtH':
      return sorted.sort((a, b) => a.price - b.price);

    case 'price_HtL':
      return sorted.sort((a, b) => b.price - a.price);

    case 'topRated':
      return sorted.sort((a, b) => b.starsCount - a.starsCount);
    default:
      return sorted;
  }
}
