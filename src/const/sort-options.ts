import {SelectOption} from '../types/select.ts';

export const sortOptions: SelectOption[] = [
  {key: 'popular', value: 'Popular'},
  {key: 'price_LtH', value: 'Price: low to high'},
  {key: 'price_HtL', value: 'Price: high to low'},
  {key: 'topRated', value: 'Top rated first'},
];
